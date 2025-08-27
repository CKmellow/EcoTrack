from fastapi import APIRouter, Depends, HTTPException
from bson import ObjectId
from models.user import UserSignup
from services import auth_service
from config.database import db

router = APIRouter()

# --- Require Admin ---
async def require_admin(current_user=Depends(auth_service.get_current_user)):
    if current_user["role"] != "Company Admin":
        raise HTTPException(status_code=403, detail="Admins only")
    return current_user

# --- Add User ---
@router.post("/company/add-user")
async def add_user(new_user: UserSignup, current_user=Depends(require_admin)):
    user_dict = new_user.dict()
    # enforce same company as admin
    user_dict["companyName"] = current_user["companyName"]

    existing = await db["users"].find_one({"email": user_dict["email"]})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user_id = await auth_service.create_user(user_dict)
    return {"message": "User created successfully", "user_id": user_id}

# --- Get single User (for editing / detail view) ---
@router.get("/company/user/{user_id}")
async def get_user(user_id: str, current_user=Depends(require_admin)):
    user = await db["users"].find_one(
        {"_id": ObjectId(user_id), "companyName": current_user["companyName"]},
        {"password": 0}  # don’t leak password hash
    )
    if not user:
        raise HTTPException(status_code=404, detail="User not found or not in your company")
    user["_id"] = str(user["_id"])
    return user

# --- Edit User ---
@router.put("/company/edit-user/{user_id}")
async def edit_user(user_id: str, update: dict, current_user=Depends(require_admin)):
    # prevent companyName change
    update.pop("companyName", None)

    result = await db["users"].update_one(
        {"_id": ObjectId(user_id), "companyName": current_user["companyName"]},
        {"$set": update}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found or not in your company")

    return {"message": "User updated successfully"}

# --- Delete User ---
@router.delete("/company/delete-user/{user_id}")
async def delete_user(user_id: str, current_user=Depends(require_admin)):
    result = await db["users"].delete_one(
        {"_id": ObjectId(user_id), "companyName": current_user["companyName"]}
    )
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found or not in your company")

    return {"message": "User deleted successfully"}

# --- View all Department Admins ---
@router.get("/company/department-admins")
async def get_department_admins(current_user=Depends(require_admin)):
    cursor = db["users"].find(
        {"companyName": current_user["companyName"], "role": "Department Admin"},
        {"password": 0}
    )
    admins = []
    async for admin in cursor:
        admin["_id"] = str(admin["_id"])
        admins.append(admin)
    return admins
