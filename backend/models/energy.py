# backend/models/energy.py
from pydantic import BaseModel, Field, validator
from typing import Optional
from datetime import datetime
import re

MONTH_REGEX = re.compile(r"^\d{4}-(0[1-9]|1[0-2])$")  # YYYY-MM

DEFAULT_PRICE_PER_KWH = 18.5  # KES per kWh (assumption)
DEFAULT_EMISSION_FACTOR = 0.43  # kg CO2 per kWh (Kenya grid avg; make overrideable)

def normalize_month(m: str) -> str:
    # force YYYY-MM
    if not MONTH_REGEX.match(m):
        raise ValueError("month must be in 'YYYY-MM' format")
    return m

class MonthlyEnergyCreate(BaseModel):
    month: str = Field(..., examples=["2025-07"])
    amount_spent: float = Field(..., gt=0, description="Amount spent in local currency")
    currency: str = Field("KES", description="Currency code, default KES")
    price_per_kwh: float = Field(DEFAULT_PRICE_PER_KWH, gt=0)
    emission_factor: float = Field(DEFAULT_EMISSION_FACTOR, gt=0, description="kg CO2 per kWh")
    org_id: Optional[str] = Field(None, description="Organization/Company ID (optional if derived from user)")

    @validator("month")
    def validate_month(cls, v):
        return normalize_month(v)

class MonthlyEnergyOut(BaseModel):
    id: str
    month: str
    org_id: str
    currency: str
    amount_spent: float
    price_per_kwh: float
    kwh_used: float
    emission_factor: float
    carbon_emissions_kg: float
    created_at: datetime
    updated_at: datetime

class MonthlyEnergyUpdate(BaseModel):
    amount_spent: Optional[float] = Field(None, gt=0)
    price_per_kwh: Optional[float] = Field(None, gt=0)
    emission_factor: Optional[float] = Field(None, gt=0)
    currency: Optional[str] = None
