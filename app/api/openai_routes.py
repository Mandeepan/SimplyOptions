from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# MP : Following is the legacy model, working on trying the updated assistant beta model

completion = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {
            "role": "system",
            "content": "You are a helpful assistant to find private company information based on your best and updated knowledge",
        },
        {
            "role": "user",
            "content": "What is price range for Common Shares price per share for Hulu. Hulu is the media platform company.Understanding it's a private company, but predict based on your best updated knowledge. your answer will show these in order (no other sentences or reply or explanation will be at the end after this formatter):  the lower band price with 2 decimal, follow by comma, then the upper band price with 2 decimal, follow by comma, then following by 3 sentences to describe what information you are based on, and how you predict that range. for example : 30.00, 50.00, Hulu last round of fund raising is... ",
        },
    ],
)

print(completion.choices[0].message.content)
