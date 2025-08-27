import motor.motor_asyncio
import os
from dotenv import load_dotenv

# Load .env variables
load_dotenv()

# MongoDB connection string from .env
MONGO_URI = os.getenv("MONGO_URI")

# Database name
DB_NAME = "Eco-Track"

# Create a Motor client
client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URI)

# Access the database
db = client[DB_NAME]
