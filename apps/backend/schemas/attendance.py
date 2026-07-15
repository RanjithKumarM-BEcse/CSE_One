from pydantic import BaseModel
from typing import List, Optional
from datetime import date, datetime
from models.attendance import SessionStatusEnum, AttendanceStatusEnum

# Records
class AttendanceRecordBase(BaseModel):
    student_id: str
    status: AttendanceStatusEnum
    remarks: Optional[str] = None

class AttendanceRecordUpdate(AttendanceRecordBase):
    pass

class AttendanceRecordResponse(AttendanceRecordBase):
    id: str
    session_id: str
    updated_at: datetime

    class Config:
        from_attributes = True

# Sessions
class AttendanceSessionBase(BaseModel):
    timetable_period_id: str
    date: date

class AttendanceSessionCreate(AttendanceSessionBase):
    pass

class AttendanceSessionResponse(AttendanceSessionBase):
    id: str
    status: SessionStatusEnum
    marked_by_id: str
    created_at: datetime
    updated_at: datetime
    records: List[AttendanceRecordResponse] = []

    class Config:
        from_attributes = True

# Bulk marking
class BulkMarkRequest(BaseModel):
    records: List[AttendanceRecordUpdate]
