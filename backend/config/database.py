import motor.motor_asyncio
import os
from dotenv import load_dotenv

# Load .env variables
load_dotenv()

# MongoDB connection string
MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME", "Eco-Track")

# JWT settings
SECRET_KEY = os.getenv("SECRET_KEY", "supersecretkey")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60))

# Create a Motor client
client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URI)

# Access the database
db = client[DB_NAME]
