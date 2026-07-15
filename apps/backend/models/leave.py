from sqlalchemy import Column, String, ForeignKey, Enum, Date, DateTime, Text
from sqlalchemy.orm import relationship
import uuid
import enum
from datetime import datetime
from db.base import Base

class LeaveStatusEnum(str, enum.Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"

class LeaveRequest(Base):
    __tablename__ = "leave_requests"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    student_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    faculty_advisor_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    reason = Column(Text, nullable=False)
    document_url = Column(String(255), nullable=True)
    
    status = Column(Enum(LeaveStatusEnum), default=LeaveStatusEnum.PENDING, nullable=False)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    student = relationship("User", foreign_keys=[student_id])
    faculty_advisor = relationship("User", foreign_keys=[faculty_advisor_id])
