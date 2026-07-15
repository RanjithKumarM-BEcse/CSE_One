import enum

class Role(str, enum.Enum):
    STUDENT = "STUDENT"
    PROFESSOR = "PROFESSOR"
    FACULTY_ADVISOR = "FACULTY_ADVISOR"
    ADMIN = "ADMIN"
