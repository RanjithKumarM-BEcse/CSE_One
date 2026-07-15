from sqlalchemy import Column, String, Boolean, Enum
from db.base import Base
import uuid
from models.role import Role

class User(Base):
    __tablename__ = "users"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(Enum(Role), nullable=False, default=Role.STUDENT)
    is_active = Column(Boolean, default=True)
    full_name = Column(String(255), nullable=True)
