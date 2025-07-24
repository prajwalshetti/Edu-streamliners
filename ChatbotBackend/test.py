import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=api_key)


model = genai.GenerativeModel("models/gemini-1.5-flash")

try:
    response = model.generate_content("Say hello from the new project")
    print(response.text)
except Exception as e:
    print(f"Gemini test failed: {e}")
