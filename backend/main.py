from fastapi import FastAPI

# Initialize FastAPI app
app = FastAPI(
    title="EcoTrack Backend",
    description="API backend for EcoTrack System",
    version="1.0.0"
)

# Test root endpoint
@app.get("/")
def read_root():
    return {"message": "Welcome to EcoTrack API 🚀"}
