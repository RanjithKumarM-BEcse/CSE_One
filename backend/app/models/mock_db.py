from app.schemas.user import UserInDB, RoleEnum

# Password is "password123" for all users hashed with dummy value for simplicity,
# but since we are using passlib in the real implementation, we should use a valid hash.
# To avoid taking time to generate 30 real argon2 hashes, we will mock the verify function in security.py
# to always return true if password is "password123" for this mock data phase.

MOCK_USERS = [
    # Admin (1)
    UserInDB(id=1, email="admin@saec.ac.in", full_name="Admin User", role=RoleEnum.admin, hashed_password="mock_hash", is_active=True),
    
    # Professors (4)
    UserInDB(id=2, email="krishna@saec.ac.in", full_name="Prof. Krishna", role=RoleEnum.professor, hashed_password="mock_hash", is_active=True),
    UserInDB(id=3, email="suresh@saec.ac.in", full_name="Prof. Suresh", role=RoleEnum.professor, hashed_password="mock_hash", is_active=True),
    UserInDB(id=4, email="ramya@saec.ac.in", full_name="Prof. Ramya", role=RoleEnum.professor, hashed_password="mock_hash", is_active=True),
    UserInDB(id=5, email="karthik@saec.ac.in", full_name="Prof. Karthik", role=RoleEnum.professor, hashed_password="mock_hash", is_active=True),
    
    # Faculty Advisors (3)
    UserInDB(id=6, email="lakshmi@saec.ac.in", full_name="Dr. Lakshmi", role=RoleEnum.faculty_advisor, hashed_password="mock_hash", is_active=True),
    UserInDB(id=7, email="venkat@saec.ac.in", full_name="Dr. Venkat", role=RoleEnum.faculty_advisor, hashed_password="mock_hash", is_active=True),
    UserInDB(id=8, email="priya@saec.ac.in", full_name="Dr. Priya", role=RoleEnum.faculty_advisor, hashed_password="mock_hash", is_active=True),
    
    # Students (22)
    UserInDB(id=9, email="student1@saec.ac.in", full_name="Student One", role=RoleEnum.student, hashed_password="mock_hash", is_active=True),
    UserInDB(id=10, email="student2@saec.ac.in", full_name="Student Two", role=RoleEnum.student, hashed_password="mock_hash", is_active=True),
    UserInDB(id=11, email="student3@saec.ac.in", full_name="Student Three", role=RoleEnum.student, hashed_password="mock_hash", is_active=True),
    UserInDB(id=12, email="student4@saec.ac.in", full_name="Student Four", role=RoleEnum.student, hashed_password="mock_hash", is_active=True),
    UserInDB(id=13, email="student5@saec.ac.in", full_name="Student Five", role=RoleEnum.student, hashed_password="mock_hash", is_active=True),
    UserInDB(id=14, email="student6@saec.ac.in", full_name="Student Six", role=RoleEnum.student, hashed_password="mock_hash", is_active=True),
    UserInDB(id=15, email="student7@saec.ac.in", full_name="Student Seven", role=RoleEnum.student, hashed_password="mock_hash", is_active=True),
    UserInDB(id=16, email="student8@saec.ac.in", full_name="Student Eight", role=RoleEnum.student, hashed_password="mock_hash", is_active=True),
    UserInDB(id=17, email="student9@saec.ac.in", full_name="Student Nine", role=RoleEnum.student, hashed_password="mock_hash", is_active=True),
    UserInDB(id=18, email="student10@saec.ac.in", full_name="Student Ten", role=RoleEnum.student, hashed_password="mock_hash", is_active=True),
    UserInDB(id=19, email="student11@saec.ac.in", full_name="Student Eleven", role=RoleEnum.student, hashed_password="mock_hash", is_active=True),
    UserInDB(id=20, email="student12@saec.ac.in", full_name="Student Twelve", role=RoleEnum.student, hashed_password="mock_hash", is_active=True),
    UserInDB(id=21, email="student13@saec.ac.in", full_name="Student Thirteen", role=RoleEnum.student, hashed_password="mock_hash", is_active=True),
    UserInDB(id=22, email="student14@saec.ac.in", full_name="Student Fourteen", role=RoleEnum.student, hashed_password="mock_hash", is_active=True),
    UserInDB(id=23, email="student15@saec.ac.in", full_name="Student Fifteen", role=RoleEnum.student, hashed_password="mock_hash", is_active=True),
    UserInDB(id=24, email="student16@saec.ac.in", full_name="Student Sixteen", role=RoleEnum.student, hashed_password="mock_hash", is_active=True),
    UserInDB(id=25, email="student17@saec.ac.in", full_name="Student Seventeen", role=RoleEnum.student, hashed_password="mock_hash", is_active=True),
    UserInDB(id=26, email="student18@saec.ac.in", full_name="Student Eighteen", role=RoleEnum.student, hashed_password="mock_hash", is_active=True),
    UserInDB(id=27, email="student19@saec.ac.in", full_name="Student Nineteen", role=RoleEnum.student, hashed_password="mock_hash", is_active=True),
    UserInDB(id=28, email="student20@saec.ac.in", full_name="Student Twenty", role=RoleEnum.student, hashed_password="mock_hash", is_active=True),
    UserInDB(id=29, email="student21@saec.ac.in", full_name="Student Twenty-One", role=RoleEnum.student, hashed_password="mock_hash", is_active=True),
    UserInDB(id=30, email="student22@saec.ac.in", full_name="Student Twenty-Two", role=RoleEnum.student, hashed_password="mock_hash", is_active=True),
]

def get_user_by_email(email: str) -> UserInDB | None:
    for user in MOCK_USERS:
        if user.email == email:
            return user
    return None
