from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from db.session import SessionLocal
from api.deps import get_db, RoleChecker, get_current_user
from models.user import User, Role
from models.academic import Department, Subject, Section
from schemas.academic import (
    DepartmentResponse, DepartmentCreate,
    SubjectResponse, SubjectCreate,
    SectionResponse, SectionCreate
)

router = APIRouter()

# --- Departments ---
@router.get("/departments", response_model=List[DepartmentResponse])
def read_departments(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(Department).offset(skip).limit(limit).all()

@router.post("/departments", response_model=DepartmentResponse, dependencies=[Depends(RoleChecker([Role.ADMIN]))])
def create_department(department: DepartmentCreate, db: Session = Depends(get_db)):
    db_dept = Department(**department.model_dump())
    db.add(db_dept)
    db.commit()
    db.refresh(db_dept)
    return db_dept

# --- Subjects ---
@router.get("/subjects", response_model=List[SubjectResponse])
def read_subjects(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(Subject).offset(skip).limit(limit).all()

@router.post("/subjects", response_model=SubjectResponse, dependencies=[Depends(RoleChecker([Role.ADMIN]))])
def create_subject(subject: SubjectCreate, db: Session = Depends(get_db)):
    db_subject = Subject(**subject.model_dump())
    db.add(db_subject)
    db.commit()
    db.refresh(db_subject)
    return db_subject

# --- Sections ---
@router.get("/sections", response_model=List[SectionResponse])
def read_sections(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(Section).offset(skip).limit(limit).all()

@router.post("/sections", response_model=SectionResponse, dependencies=[Depends(RoleChecker([Role.ADMIN]))])
def create_section(section: SectionCreate, db: Session = Depends(get_db)):
    db_section = Section(**section.model_dump())
    db.add(db_section)
    db.commit()
    db.refresh(db_section)
    return db_section
