import os
from dotenv import load_dotenv
import motor.motor_asyncio

# Load .env from backend folder
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '.env'))

MONGO_URI = os.getenv("MONGO_URI")
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))

client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URI)
db = client["Hustle-Base"]  # Use your actual DB name here

# ...existing code...