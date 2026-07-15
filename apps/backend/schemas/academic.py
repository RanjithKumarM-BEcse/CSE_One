from pydantic import BaseModel
from typing import Optional
from models.academic import SemesterEnum

# Department
class DepartmentBase(BaseModel):
    name: str
    code: str

class DepartmentCreate(DepartmentBase):
    pass

class DepartmentResponse(DepartmentBase):
    id: str

    class Config:
        from_attributes = True

# Subject
class SubjectBase(BaseModel):
    code: str
    name: str
    credits: int = 3
    is_active: bool = True

class SubjectCreate(SubjectBase):
    department_id: str

class SubjectResponse(SubjectBase):
    id: str
    department_id: str

    class Config:
        from_attributes = True

# Section
class SectionBase(BaseModel):
    name: str
    year: int
    semester: SemesterEnum

class SectionCreate(SectionBase):
    department_id: str

class SectionResponse(SectionBase):
    id: str
    department_id: str

    class Config:
        from_attributes = True

# Student Profile
class StudentProfileBase(BaseModel):
    section_id: str
    faculty_advisor_id: Optional[str] = None

class StudentProfileCreate(StudentProfileBase):
    user_id: str

class StudentProfileResponse(StudentProfileBase):
    user_id: str

    class Config:
        from_attributes = True
