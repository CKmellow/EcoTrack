# models/device.py
from pydantic import BaseModel

class Device(BaseModel):
    department_id: str
    device_type: str
    device_name: str
    power_rating: float
    quantity: int
    usage_pattern: str   # always_on, work_hours, on_demand
    carbon_intensity: float
