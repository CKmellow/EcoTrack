from fastapi import FastAPI
from routes import auth_routes, CoAdmin_routes
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials


app = FastAPI(title="EcoTrack Backend")

# Allow frontend
origins = [
    "http://localhost:3000",  
    "http://127.0.0.1:3000",  
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,            
    allow_credentials=True,
    allow_methods=["*"],             
    allow_headers=["*"],              
)

security = HTTPBearer()

# Routers
app.include_router(auth_routes.router, prefix="/api/auth", tags=["Auth"])
app.include_router(CoAdmin_routes.router, prefix="/api/admin", tags=["Admin"])

@app.get("/protected")
async def protected_route(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    # 🔑 Here you’d normally call your JWT verification
    return {"message": "Access granted", "token": token}

@app.get("/")
def root():
    return {"message": "Welcome to EcoTrack API 🚀"}
