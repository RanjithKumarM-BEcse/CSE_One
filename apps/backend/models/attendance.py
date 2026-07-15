from sqlalchemy import Column, String, ForeignKey, Enum, DateTime, Date
from sqlalchemy.orm import relationship
import uuid
import enum
from datetime import datetime
from db.base import Base

class SessionStatusEnum(str, enum.Enum):
    DRAFT = "DRAFT"
    COMMITTED = "COMMITTED"
    LOCKED = "LOCKED"

class AttendanceStatusEnum(str, enum.Enum):
    PRESENT = "PRESENT"
    ABSENT = "ABSENT"
    ON_LEAVE = "ON_LEAVE"

class AttendanceSession(Base):
    __tablename__ = "attendance_sessions"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    timetable_period_id = Column(String(36), ForeignKey("timetable_periods.id"), nullable=False)
    date = Column(Date, nullable=False, index=True)
    status = Column(Enum(SessionStatusEnum), default=SessionStatusEnum.DRAFT, nullable=False)
    marked_by_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    timetable_period = relationship("TimetablePeriod")
    marked_by = relationship("User")
    records = relationship("AttendanceRecord", back_populates="session", cascade="all, delete-orphan")

class AttendanceRecord(Base):
    __tablename__ = "attendance_records"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    session_id = Column(String(36), ForeignKey("attendance_sessions.id"), nullable=False)
    student_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    status = Column(Enum(AttendanceStatusEnum), default=AttendanceStatusEnum.PRESENT, nullable=False)
    remarks = Column(String(255), nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    session = relationship("AttendanceSession", back_populates="records")
    student = relationship("User")
