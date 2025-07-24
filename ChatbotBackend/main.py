import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import google.generativeai as genai
from pymongo import MongoClient
from bson import json_util

# Load environment variables
load_dotenv()
print("GOOGLE_API_KEY:", os.getenv("GOOGLE_API_KEY"))
print("MONGO_URI:", os.getenv("MONGO_URI"))


GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
MONGO_URI = os.getenv("MONGO_URI")

if not GOOGLE_API_KEY or not MONGO_URI:
    raise EnvironmentError("Missing GOOGLE_API_KEY or MONGO_URI in .env file")

# Configure Gemini
genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel("models/gemini-1.5-flash")


# MongoDB connection
client = MongoClient(MONGO_URI)
db = client["test"]
collection = db["students"]

# Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Prompt template
PROMPT_TEMPLATE = """Convert this natural language query to a MongoDB find query.
Return ONLY valid JSON format with the query in a 'query' field.
Always include at least one filter condition using an existing field from the 'students' collection.
Assume the 'students' collection has the following fields:
- name (string)
- roll_no (number)
- email (string)
- phone_no (number)
- address (string)
- dob (date in YYYY-MM-DD format)
- class (string)
- status (string)

Example Input: Show all active users
Example Output: {{ "query": {{ "status": "active" }} }}

Input: {user_input}
Output:"""

# Utility: Clean LLM response
def clean_json_response(response: str) -> dict:
    try:
        cleaned = response.strip().replace('```json', '').replace('```', '')
        return json.loads(cleaned)
    except json.JSONDecodeError as e:
        raise ValueError(f"Invalid JSON: {e}")

# Route: POST /query
@app.route("/query", methods=["POST"])
def handle_query():
    try:
        data = request.get_json()
        user_query = data.get("query")

        if not user_query:
            return jsonify({"error": "Missing 'query' in request body"}), 400

        prompt = PROMPT_TEMPLATE.format(user_input=user_query)
        response = model.generate_content(prompt)
        result = clean_json_response(response.text)
        mongo_query = result.get("query", {})

        if not mongo_query:
            return jsonify({"error": "Empty or invalid query generated."}), 400

        cursor = collection.find(mongo_query)
        results = list(cursor)

        if not results:
            return jsonify({"message": "No documents found."}), 200

        json_docs = json.loads(json_util.dumps(results))
        return jsonify({"results": json_docs})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Entry point
if __name__ == "__main__":
    app.run(debug=True, port=8000)
