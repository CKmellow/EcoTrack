# backend/services/energy_service.py
from typing import List, Optional, Dict, Any
from datetime import datetime
from bson import ObjectId
from pydantic import ValidationError
from models.energy import (
    MonthlyEnergyCreate, MonthlyEnergyUpdate, MonthlyEnergyOut, normalize_month
)

COLLECTION_NAME = "monthly_energy"

def _to_str_id(doc: Dict[str, Any]) -> Dict[str, Any]:
    doc["id"] = str(doc["_id"])
    del doc["_id"]
    return doc

async def ensure_indexes(db):
    await db[COLLECTION_NAME].create_index(
        [("org_id", 1), ("month", 1)],
        unique=True,
        name="uniq_org_month"
    )
    await db[COLLECTION_NAME].create_index([("org_id", 1), ("created_at", -1)])

def _compute(amount_spent: float, price_per_kwh: float, emission_factor: float):
    kwh_used = amount_spent / price_per_kwh
    carbon_emissions_kg = kwh_used * emission_factor
    return round(kwh_used, 2), round(carbon_emissions_kg, 2)

async def create_monthly_energy(db, payload: MonthlyEnergyCreate, org_id_fallback: str) -> MonthlyEnergyOut:
    org_id = payload.org_id or org_id_fallback
    month = normalize_month(payload.month)

    kwh_used, carbon_kg = _compute(
        payload.amount_spent, payload.price_per_kwh, payload.emission_factor
    )

    now = datetime.utcnow()
    doc = {
        "org_id": org_id,
        "month": month,
        "currency": payload.currency,
        "amount_spent": payload.amount_spent,
        "price_per_kwh": payload.price_per_kwh,
        "kwh_used": kwh_used,
        "emission_factor": payload.emission_factor,
        "carbon_emissions_kg": carbon_kg,
        "created_at": now,
        "updated_at": now,
    }

    res = await db[COLLECTION_NAME].insert_one(doc)
    saved = await db[COLLECTION_NAME].find_one({"_id": res.inserted_id})
    return MonthlyEnergyOut(**_to_str_id(saved))

async def upsert_monthly_energy(db, payload: MonthlyEnergyCreate, org_id_fallback: str) -> MonthlyEnergyOut:
    """
    If a record for (org_id, month) exists, update values; else create.
    """
    org_id = payload.org_id or org_id_fallback
    month = normalize_month(payload.month)
    kwh_used, carbon_kg = _compute(payload.amount_spent, payload.price_per_kwh, payload.emission_factor)

    now = datetime.UtcNow() if hasattr(datetime, "UtcNow") else datetime.utcnow()  # safety for envs
    update = {
        "$set": {
            "currency": payload.currency,
            "amount_spent": payload.amount_spent,
            "price_per_kwh": payload.price_per_kwh,
            "kwh_used": kwh_used,
            "emission_factor": payload.emission_factor,
            "carbon_emissions_kg": carbon_kg,
            "updated_at": now,
        },
        "$setOnInsert": {
            "org_id": org_id,
            "month": month,
            "created_at": now,
        }
    }

    saved = await db[COLLECTION_NAME].find_one_and_update(
        {"org_id": org_id, "month": month},
        update,
        upsert=True,
        return_document=True  # requires pymongo >=4; for Motor use ReturnDocument.AFTER
    )
    # For Motor < 3, use:
    # from pymongo import ReturnDocument
    # saved = await db[COLLECTION_NAME].find_one_and_update(
    #   {"org_id": org_id, "month": month}, update, upsert=True, return_document=ReturnDocument.AFTER
    # )
    return MonthlyEnergyOut(**_to_str_id(saved))

async def list_monthly_energy(db, org_id: str, limit: int = 50, skip: int = 0) -> List[MonthlyEnergyOut]:
    cursor = db[COLLECTION_NAME].find({"org_id": org_id}).sort("month", -1).skip(skip).limit(limit)
    items = []
    async for doc in cursor:
        items.append(MonthlyEnergyOut(**_to_str_id(doc)))
    return items

async def get_month_record(db, org_id: str, month: str) -> Optional[MonthlyEnergyOut]:
    month = normalize_month(month)
    doc = await db[COLLECTION_NAME].find_one({"org_id": org_id, "month": month})
    return MonthlyEnergyOut(**_to_str_id(doc)) if doc else None

async def update_month_record(db, org_id: str, month: str, payload: MonthlyEnergyUpdate) -> Optional[MonthlyEnergyOut]:
    month = normalize_month(month)
    update_fields = {k: v for k, v in payload.dict(exclude_unset=True).items()}
    if not update_fields:
        return await get_month_record(db, org_id, month)

    # recompute if any inputs that affect computation changed
    doc = await db[COLLECTION_NAME].find_one({"org_id": org_id, "month": month})
    if not doc:
        return None

    amount_spent = update_fields.get("amount_spent", doc["amount_spent"])
    price_per_kwh = update_fields.get("price_per_kwh", doc["price_per_kwh"])
    emission_factor = update_fields.get("emission_factor", doc["emission_factor"])
    kwh_used, carbon_kg = _compute(amount_spent, price_per_kwh, emission_factor)

    update_fields["kwh_used"] = kwh_used
    update_fields["carbon_emissions_kg"] = carbon_kg
    update_fields["updated_at"] = datetime.utcnow()

    saved = await db[COLLECTION_NAME].find_one_and_update(
        {"org_id": org_id, "month": month},
        {"$set": update_fields},
        return_document=True
    )
    return MonthlyEnergyOut(**_to_str_id(saved)) if saved else None

async def delete_month_record(db, org_id: str, month: str) -> bool:
    month = normalize_month(month)
    res = await db[COLLECTION_NAME].delete_one({"org_id": org_id, "month": month})
    return res.deleted_count == 1
