# models/department.py
from calendar import month
from pydantic import BaseModel
from typing import Optional

class Department(BaseModel):
    name: str
    employee_count: int
    expected_power_intensity: float
    month
    department_type: str   # IT, HR, Finance, etc.
    admin_id: Optional[str] = None
    is_active: bool = True
