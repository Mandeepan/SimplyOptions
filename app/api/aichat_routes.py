from flask import Blueprint, request, jsonify
import openai
import os
from dotenv import load_dotenv


chat_bp = Blueprint("chat_bp", __name__)
client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


@chat_bp.route("/", methods=["POST"])
def chat():
    try:
        data = request.get_json()
        user_message = data.get("message", "")
        company_name = data.get("company_name", "a company")
        company_short_intro = data.get("company_short_intro", "")

        if not user_message:
            return jsonify({"error": "Message cannot be empty"}), 400

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a helpful assistant with answer investors question about %s in a professional and concise manner.%s"
                        % (company_name, company_short_intro)
                    ),
                },
                {"role": "user", "content": user_message},
            ],
        )

        ai_response = response.choices[0].message.content
        print(ai_response)
        return jsonify({"message": ai_response})

    except Exception as e:
        return jsonify({"error": str(e)}), 500
