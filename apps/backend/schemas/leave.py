from pydantic import BaseModel, root_validator
from typing import Optional
from datetime import date, datetime
from models.leave import LeaveStatusEnum

class LeaveRequestBase(BaseModel):
    start_date: date
    end_date: date
    reason: str
    document_url: Optional[str] = None
    
    @root_validator(pre=False)
    def validate_dates(cls, values):
        start = values.get('start_date')
        end = values.get('end_date')
        if start and end and start > end:
            raise ValueError("end_date must be after or equal to start_date")
        return values

class LeaveRequestCreate(LeaveRequestBase):
    pass

class LeaveRequestUpdate(BaseModel):
    status: LeaveStatusEnum

class LeaveRequestResponse(LeaveRequestBase):
    id: str
    student_id: str
    faculty_advisor_id: Optional[str]
    status: LeaveStatusEnum
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
