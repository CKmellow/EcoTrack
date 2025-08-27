from fastapi import FastAPI
from routes import auth_routes
from fastapi.middleware.cors import CORSMiddleware

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

# Routers
app.include_router(auth_routes.router, prefix="/api/auth", tags=["Auth"])

@app.get("/")
def root():
    return {"message": "Welcome to EcoTrack API 🚀"}
