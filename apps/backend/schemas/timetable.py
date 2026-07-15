from pydantic import BaseModel
from typing import List

class TimetablePeriodBase(BaseModel):
    section_id: str
    subject_id: str
    professor_id: str
    day_of_week: int
    period_number: int

class TimetablePeriodCreate(TimetablePeriodBase):
    pass

class TimetablePeriodResponse(TimetablePeriodBase):
    id: str

    class Config:
        from_attributes = True

class TimetableDayResponse(BaseModel):
    day_of_week: int
    periods: List[TimetablePeriodResponse]
