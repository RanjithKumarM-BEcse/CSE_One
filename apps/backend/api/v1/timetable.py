from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from db.session import SessionLocal
from api.deps import get_db, RoleChecker, get_current_user
from models.user import User, Role
from models.timetable import TimetablePeriod
from schemas.timetable import TimetablePeriodResponse, TimetablePeriodCreate, TimetableDayResponse

router = APIRouter()

@router.get("/section/{section_id}", response_model=List[TimetablePeriodResponse])
def get_section_timetable(section_id: str, db: Session = Depends(get_db)):
    periods = db.query(TimetablePeriod).filter(TimetablePeriod.section_id == section_id).order_by(TimetablePeriod.day_of_week, TimetablePeriod.period_number).all()
    return periods

@router.get("/professor/today", response_model=List[TimetablePeriodResponse])
def get_professor_today_timetable(
    db: Session = Depends(get_db), 
    current_user: User = Depends(RoleChecker([Role.PROFESSOR]))
):
    # For testing, we use standard datetime. In production, consider timezone specifics.
    today_day_of_week = datetime.today().isoweekday() # 1 = Monday, 7 = Sunday
    periods = db.query(TimetablePeriod).filter(
        TimetablePeriod.professor_id == current_user.id,
        TimetablePeriod.day_of_week == today_day_of_week
    ).order_by(TimetablePeriod.period_number).all()
    return periods

@router.post("/", response_model=TimetablePeriodResponse, dependencies=[Depends(RoleChecker([Role.ADMIN]))])
def create_timetable_period(period: TimetablePeriodCreate, db: Session = Depends(get_db)):
    # Check for conflicts
    conflict = db.query(TimetablePeriod).filter(
        TimetablePeriod.professor_id == period.professor_id,
        TimetablePeriod.day_of_week == period.day_of_week,
        TimetablePeriod.period_number == period.period_number
    ).first()
    if conflict:
        raise HTTPException(status_code=400, detail="Professor is already scheduled for this period.")
        
    db_period = TimetablePeriod(**period.model_dump())
    db.add(db_period)
    db.commit()
    db.refresh(db_period)
    return db_period
