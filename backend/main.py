from fastapi import FastAPI, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from routes import energy_routes


# Routers
from routes import auth_routes, CoAdmin_routes, department_routes, ai_routes

# Middleware
from backend.middleware.cors import setup_cors


app = FastAPI(title="EcoTrack Backend")

# Apply CORS
setup_cors(app)

security = HTTPBearer()

# Routers
app.include_router(auth_routes.router, prefix="/api/auth", tags=["Auth"])
app.include_router(CoAdmin_routes.router, prefix="/api/admin", tags=["Admin"])
app.include_router(department_routes.router, prefix="/api/departments", tags=["Departments"])
app.include_router(ai_routes.router)
app.include_router(energy_routes.router)

@app.get("/protected")
async def protected_route(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    return {"message": "Access granted", "token": token}

@app.get("/")
def root():
    return {"message": "Welcome to EcoTrack API 🚀"}
