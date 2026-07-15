from sqlalchemy import Column, String, Integer, ForeignKey
from sqlalchemy.orm import relationship
import uuid
from db.base import Base

class TimetablePeriod(Base):
    __tablename__ = "timetable_periods"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    section_id = Column(String(36), ForeignKey("sections.id"), nullable=False)
    subject_id = Column(String(36), ForeignKey("subjects.id"), nullable=False)
    professor_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    day_of_week = Column(Integer, nullable=False) # 1 = Monday, 5 = Friday
    period_number = Column(Integer, nullable=False) # 1 to 8
    
    section = relationship("Section")
    subject = relationship("Subject")
    professor = relationship("User")
