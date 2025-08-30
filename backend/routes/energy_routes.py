# backend/routes/energy_routes.py
from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List
from models.energy import MonthlyEnergyCreate, MonthlyEnergyOut, MonthlyEnergyUpdate
from services import energy_service, auth_service
from config.database import get_db

router = APIRouter(prefix="/api/energy", tags=["Energy"])

@router.on_event("startup")
async def _ensure_indexes():
    # If running as sub-application, move this to main.py startup
    from config.database import get_db
    db = await get_db()
    await energy_service.ensure_indexes(db)

@router.post("/monthly", response_model=MonthlyEnergyOut)
async def create_or_upsert_monthly(
    payload: MonthlyEnergyCreate,
    db=Depends(get_db),
    current_user=Depends(auth_service.get_current_user),
):
    org_id = (
        getattr(current_user, "org_id", None)
        or getattr(current_user, "organizationId", None)
        or str(current_user.get("id", ""))
        or str(current_user.get("_id", ""))
    )
    if not org_id:
        raise HTTPException(status_code=400, detail="org_id missing and not derivable from user")
    return await energy_service.upsert_monthly_energy(db, payload, org_id)

@router.get("/monthly", response_model=List[MonthlyEnergyOut])
async def list_monthly(
    limit: int = Query(50, ge=1, le=200),
    skip: int = Query(0, ge=0),
    db=Depends(get_db),
    current_user=Depends(auth_service.get_current_user),
):
    org_id = (
        getattr(current_user, "org_id", None)
        or getattr(current_user, "organizationId", None)
        or str(current_user.get("id", ""))
        or str(current_user.get("_id", ""))
    )
    return await energy_service.list_monthly_energy(db, org_id, limit=limit, skip=skip)

@router.get("/monthly/{month}", response_model=MonthlyEnergyOut)
async def get_month(
    month: str,
    db=Depends(get_db),
    current_user=Depends(auth_service.get_current_user),
):
    org_id = (
        getattr(current_user, "org_id", None)
        or getattr(current_user, "organizationId", None)
        or str(current_user.get("id", ""))
        or str(current_user.get("_id", ""))
    )
    rec = await energy_service.get_month_record(db, org_id, month)
    if not rec:
        raise HTTPException(status_code=404, detail="Record not found")
    return rec

@router.patch("/monthly/{month}", response_model=MonthlyEnergyOut)
async def update_month(
    month: str,
    payload: MonthlyEnergyUpdate,
    db=Depends(get_db),
    current_user=Depends(auth_service.get_current_user),
):
    org_id = (
        getattr(current_user, "org_id", None)
        or getattr(current_user, "organizationId", None)
        or str(current_user.get("id", ""))
        or str(current_user.get("_id", ""))
    )
    rec = await energy_service.update_month_record(db, org_id, month, payload)
    if not rec:
        raise HTTPException(status_code=404, detail="Record not found")
    return rec

@router.delete("/monthly/{month}")
async def delete_month(
    month: str,
    db=Depends(get_db),
    current_user=Depends(auth_service.get_current_user),
):
    org_id = (
        getattr(current_user, "org_id", None)
        or getattr(current_user, "organizationId", None)
        or str(current_user.get("id", ""))
        or str(current_user.get("_id", ""))
    )
    ok = await energy_service.delete_month_record(db, org_id, month)
    if not ok:
        raise HTTPException(status_code=404, detail="Record not found")
    return {"deleted": True}
