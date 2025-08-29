# config/ai.py
import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

INFLECTION_API_KEY = os.getenv("INFLECTION_API_KEY")

client = OpenAI(api_key=INFLECTION_API_KEY, base_url="https://api.inflection.ai")
