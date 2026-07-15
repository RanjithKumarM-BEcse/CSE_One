from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import date

from db.session import SessionLocal
from api.deps import get_db, RoleChecker, get_current_user
from models.user import User, Role
from models.academic import StudentProfile
from models.leave import LeaveRequest, LeaveStatusEnum
from models.attendance import AttendanceSession, AttendanceRecord, AttendanceStatusEnum
from schemas.leave import LeaveRequestCreate, LeaveRequestUpdate, LeaveRequestResponse

router = APIRouter()

@router.post("/apply", response_model=LeaveRequestResponse, dependencies=[Depends(RoleChecker([Role.STUDENT]))])
def apply_leave(leave_in: LeaveRequestCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Lookup the student's Faculty Advisor
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    fa_id = profile.faculty_advisor_id if profile else None
    
    leave = LeaveRequest(
        **leave_in.model_dump(),
        student_id=current_user.id,
        faculty_advisor_id=fa_id
    )
    db.add(leave)
    db.commit()
    db.refresh(leave)
    return leave

@router.get("/student/my-requests", response_model=List[LeaveRequestResponse], dependencies=[Depends(RoleChecker([Role.STUDENT]))])
def get_my_requests(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(LeaveRequest).filter(LeaveRequest.student_id == current_user.id).order_by(LeaveRequest.created_at.desc()).all()

@router.get("/fa/pending", response_model=List[LeaveRequestResponse], dependencies=[Depends(RoleChecker([Role.FACULTY_ADVISOR, Role.ADMIN]))])
def get_pending_requests(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(LeaveRequest).filter(
        LeaveRequest.faculty_advisor_id == current_user.id,
        LeaveRequest.status == LeaveStatusEnum.PENDING
    ).all()

@router.put("/fa/{request_id}/status", response_model=LeaveRequestResponse, dependencies=[Depends(RoleChecker([Role.FACULTY_ADVISOR, Role.ADMIN]))])
def update_leave_status(request_id: str, update_in: LeaveRequestUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    leave = db.query(LeaveRequest).filter(LeaveRequest.id == request_id).first()
    if not leave:
        raise HTTPException(status_code=404, detail="Leave request not found")
        
    # Security: Ensure this FA is assigned to this request, or user is an ADMIN
    if current_user.role != Role.ADMIN and leave.faculty_advisor_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this request")
        
    leave.status = update_in.status
    
    # Auto-Reconciliation with Attendance Engine
    if leave.status == LeaveStatusEnum.APPROVED:
        # Find all attendance records for this student in sessions falling within the leave dates
        sessions = db.query(AttendanceSession).filter(
            AttendanceSession.date >= leave.start_date,
            AttendanceSession.date <= leave.end_date
        ).all()
        
        session_ids = [s.id for s in sessions]
        
        if session_ids:
            records = db.query(AttendanceRecord).filter(
                AttendanceRecord.session_id.in_(session_ids),
                AttendanceRecord.student_id == leave.student_id
            ).all()
            
            for record in records:
                # If they were marked absent, flip to ON_LEAVE. 
                # If they were marked present, we might want to keep it or flip it. Usually flip to ON_LEAVE.
                record.status = AttendanceStatusEnum.ON_LEAVE
                record.remarks = "Auto-updated via Leave Approval"

    db.commit()
    db.refresh(leave)
    return leave
