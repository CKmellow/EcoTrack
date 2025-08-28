from fastapi import APIRouter, Depends, HTTPException
from bson import ObjectId
from models.department import Department
from config.database import db
from services import auth_service

router = APIRouter()

# Only Company Admins can manage departments
async def require_admin(current_user=Depends(auth_service.get_current_user)):
    if current_user["role"] != "Company Admin":
        raise HTTPException(status_code=403, detail="Admins only")
    return current_user


# --- Create Department ---
@router.post("/departments")
async def create_department(dept: Department, current_user=Depends(require_admin)):
    dept_dict = dept.dict()
    dept_dict["companyName"] = current_user["companyName"]  # enforce scope
    result = await db["departments"].insert_one(dept_dict)
    return {"message": "Department created", "id": str(result.inserted_id)}


# --- List Departments (Company Only) ---
@router.get("/departments")
async def list_departments(current_user=Depends(require_admin)):
    cursor = db["departments"].find({"companyName": current_user["companyName"]})
    depts = []
    async for d in cursor:
        d["_id"] = str(d["_id"])
        depts.append(d)
    return depts


# --- View Specific Department ---
@router.get("/departments/{dept_id}")
async def get_department(dept_id: str, current_user=Depends(require_admin)):
    dept = await db["departments"].find_one({
        "_id": ObjectId(dept_id),
        "companyName": current_user["companyName"]
    })
    if not dept:
        raise HTTPException(status_code=404, detail="Department not found")
    dept["_id"] = str(dept["_id"])
    return dept


# --- Edit Department ---
@router.put("/departments/{dept_id}")
async def edit_department(dept_id: str, update: dict, current_user=Depends(require_admin)):
    update.pop("companyName", None)  # prevent tampering
    result = await db["departments"].update_one(
        {"_id": ObjectId(dept_id), "companyName": current_user["companyName"]},
        {"$set": update}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Department not found or not yours")
    return {"message": "Department updated successfully"}


# --- Delete Department ---
@router.delete("/departments/{dept_id}")
async def delete_department(dept_id: str, current_user=Depends(require_admin)):
    result = await db["departments"].delete_one(
        {"_id": ObjectId(dept_id), "companyName": current_user["companyName"]}
    )
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Department not found or not yours")
    return {"message": "Department deleted successfully"}
