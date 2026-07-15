from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from db.session import SessionLocal
from api.deps import get_db, RoleChecker, get_current_user
from models.user import User, Role
from models.timetable import TimetablePeriod
from models.academic import StudentProfile
from models.attendance import AttendanceSession, AttendanceRecord, SessionStatusEnum, AttendanceStatusEnum
from schemas.attendance import AttendanceSessionCreate, AttendanceSessionResponse, BulkMarkRequest

router = APIRouter()

@router.post("/sessions", response_model=AttendanceSessionResponse, dependencies=[Depends(RoleChecker([Role.PROFESSOR, Role.ADMIN]))])
def create_session(session_in: AttendanceSessionCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Verify timetable period exists
    period = db.query(TimetablePeriod).filter(TimetablePeriod.id == session_in.timetable_period_id).first()
    if not period:
        raise HTTPException(status_code=404, detail="Timetable period not found")
        
    # Prevent duplicate sessions for same period and date
    existing_session = db.query(AttendanceSession).filter(
        AttendanceSession.timetable_period_id == session_in.timetable_period_id,
        AttendanceSession.date == session_in.date
    ).first()
    
    if existing_session:
        raise HTTPException(status_code=400, detail="Attendance session already exists for this period and date")
        
    # Create the session
    db_session = AttendanceSession(
        timetable_period_id=session_in.timetable_period_id,
        date=session_in.date,
        marked_by_id=current_user.id,
        status=SessionStatusEnum.DRAFT
    )
    db.add(db_session)
    db.flush() # flush to get the ID without committing
    
    # Hydrate default records (all PRESENT) based on the section's students
    students = db.query(StudentProfile).filter(StudentProfile.section_id == period.section_id).all()
    records = []
    for student in students:
        record = AttendanceRecord(
            session_id=db_session.id,
            student_id=student.user_id,
            status=AttendanceStatusEnum.PRESENT
        )
        records.append(record)
        
    db.add_all(records)
    db.commit()
    db.refresh(db_session)
    return db_session

@router.get("/sessions/{session_id}", response_model=AttendanceSessionResponse, dependencies=[Depends(RoleChecker([Role.PROFESSOR, Role.FACULTY_ADVISOR, Role.ADMIN]))])
def get_session(session_id: str, db: Session = Depends(get_db)):
    session = db.query(AttendanceSession).filter(AttendanceSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session

@router.put("/sessions/{session_id}/mark", response_model=AttendanceSessionResponse, dependencies=[Depends(RoleChecker([Role.PROFESSOR, Role.ADMIN]))])
def mark_attendance(session_id: str, payload: BulkMarkRequest, db: Session = Depends(get_db)):
    db_session = db.query(AttendanceSession).filter(AttendanceSession.id == session_id).first()
    if not db_session:
        raise HTTPException(status_code=404, detail="Session not found")
        
    if db_session.status != SessionStatusEnum.DRAFT:
        raise HTTPException(status_code=400, detail=f"Cannot mark attendance in a {db_session.status.value} session")
        
    # Convert payload to a dict for easy lookup
    update_map = {r.student_id: r for r in payload.records}
    
    # Update records
    for record in db_session.records:
        if record.student_id in update_map:
            update_data = update_map[record.student_id]
            record.status = update_data.status
            record.remarks = update_data.remarks
            
    db.commit()
    db.refresh(db_session)
    return db_session

@router.post("/sessions/{session_id}/commit", response_model=AttendanceSessionResponse, dependencies=[Depends(RoleChecker([Role.PROFESSOR, Role.ADMIN]))])
def commit_session(session_id: str, db: Session = Depends(get_db)):
    db_session = db.query(AttendanceSession).filter(AttendanceSession.id == session_id).first()
    if not db_session:
        raise HTTPException(status_code=404, detail="Session not found")
        
    if db_session.status != SessionStatusEnum.DRAFT:
        raise HTTPException(status_code=400, detail=f"Cannot commit a {db_session.status.value} session")
        
    db_session.status = SessionStatusEnum.COMMITTED
    db.commit()
    db.refresh(db_session)
    return db_session
