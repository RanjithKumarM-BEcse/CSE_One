from sqlalchemy import Column, String, Integer, ForeignKey, Enum, Boolean
from sqlalchemy.orm import relationship
import uuid
from db.base import Base
import enum

class SemesterEnum(str, enum.Enum):
    ODD = "ODD"
    EVEN = "EVEN"

class Department(Base):
    __tablename__ = "departments"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    name = Column(String(255), nullable=False)
    code = Column(String(10), unique=True, nullable=False, index=True)

class Subject(Base):
    __tablename__ = "subjects"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    code = Column(String(20), unique=True, nullable=False, index=True)
    name = Column(String(255), nullable=False)
    department_id = Column(String(36), ForeignKey("departments.id"), nullable=False)
    credits = Column(Integer, default=3)
    is_active = Column(Boolean, default=True)
    
    department = relationship("Department")

class Section(Base):
    __tablename__ = "sections"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    name = Column(String(10), nullable=False) # e.g., 'A', 'B'
    year = Column(Integer, nullable=False)    # e.g., 1, 2, 3, 4
    semester = Column(Enum(SemesterEnum), nullable=False)
    department_id = Column(String(36), ForeignKey("departments.id"), nullable=False)
    
    department = relationship("Department")

class StudentProfile(Base):
    __tablename__ = "student_profiles"
    user_id = Column(String(36), ForeignKey("users.id"), primary_key=True)
    section_id = Column(String(36), ForeignKey("sections.id"), nullable=False)
    faculty_advisor_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    
    user = relationship("User", foreign_keys=[user_id])
    section = relationship("Section")
    faculty_advisor = relationship("User", foreign_keys=[faculty_advisor_id])
