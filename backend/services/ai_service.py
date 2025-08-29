# services/ai_service.py
from config.ai import client

async def ask_ai(prompt: str) -> str:
    """
    Sends a prompt to Inflection AI and returns the response.
    """
    try:
        response = client.chat.completions.create(
            model="inflection-1",  # use the actual Inflection model name from your account
            messages=[{"role": "user", "content": prompt}],
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"AI error: {str(e)}"
