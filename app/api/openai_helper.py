from openai import OpenAI
import os
from dotenv import load_dotenv


# MP : Following is the legacy model, working on trying the updated assistant beta model


def get_insight(company_name, company_short_description):
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    prompt_insight = (
        "Write a paragraph with at least 200 characters, and no more than 400 characters about the company called %s. %s, you can start with your expectation for their near term and long term business development, and cite any relavant data you have. It ends with the main product and cusomters, and expected share price range."
        % (company_name, company_short_description)
    )

    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": "You are a helpful assistant to find private company information based on your best and updated knowledge",
            },
            {"role": "user", "content": prompt_insight},
        ],
    )

    answer = completion.choices[0].message.content
    return answer


# "What is price range for Common Shares price per share for Hulu. Hulu is the media platform company.Understanding it's a private company, but predict based on your best updated knowledge. your answer will show these in order (no other sentences or reply or explanation will be at the end after this formatter):  the lower band price with 2 decimal, follow by comma, then the upper band price with 2 decimal, follow by comma, then following by 3 sentences to describe what information you are based on, and how you predict that range. for example : 30.00, 50.00, Hulu last round of fund raising is... ",


def get_founded_year(company_name, company_short_description):
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    prompt_found_year = (
        "Use a 4-digit to answer, no other explanation or extra words in the response: the founding year in 4 digit for the company called %s. %s"
        % (company_name, company_short_description)
    )

    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": "You are a helpful assistant to find private company information based on your best and updated knowledge",
            },
            {"role": "user", "content": prompt_found_year},
        ],
    )

    answer = completion.choices[0].message.content
    return answer


def get_revenue_range(company_name, company_short_description):
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    prompt_revenue_range = (
        "Choose one of item, no other explanation or extra words in the response: what is the approximate revenue range for the company called %s. %s, List is (Less than $1M,$1M - $5M,$5M - $10M,$10M - $50M,$50M - $100M,$100M - $500M,$500M - $1B,$1B - $5B,$5B - $10B,$10B - $50B,$50B - $100B, $100B - $500B,$500B +)"
        % (company_name, company_short_description)
    )

    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": "You are a helpful assistant to find private company information based on your best and updated knowledge",
            },
            {"role": "user", "content": prompt_revenue_range},
        ],
    )

    answer = completion.choices[0].message.content
    return answer


def get_industry_category(company_name, company_short_description):
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    prompt_category = (
        "Choose one of item, no other explanation or extra words in the response: what is industry category for the company called %s. %s, List is (Technology, Healthcare, Finance, Consumer Goods, Energy, Industrials, Utilities, Real Estate, Telecommunications, Materials, Transportation, Retail, Food & Beverage, Automotive, Education, Hospitality, Aerospace & Defense, Media & Entertainment, Agriculture, Construction, Financial Services, Insurance, Pharmaceuticals, Biotechnology, Chemical, Logistics, Consulting, Public Services, Other)"
        % (company_name, company_short_description)
    )

    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": "You are a helpful assistant to find private company information based on your best and updated knowledge",
            },
            {"role": "user", "content": prompt_category},
        ],
    )

    answer = completion.choices[0].message.content
    return answer


def get_employee_count_range(company_name, company_short_description):
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    prompt_employee_range = (
        "Choose one of item, no other explanation or extra words in the response: what is employee count range for the company called %s. %s, List is (1-10, 11-50, 51-100, 101-500, 501-1000, 1001-5000, 5001-10000, 10001-50000, 50000+)"
        % (company_name, company_short_description)
    )

    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": "You are a helpful assistant to find private company information based on your best and updated knowledge",
            },
            {"role": "user", "content": prompt_employee_range},
        ],
    )

    answer = completion.choices[0].message.content
    return answer


def get_investors(company_name, company_short_description):
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    prompt_investors = (
        "Give me a string, no other explanation or extra words in the response: what are the investors for the company called %s. %s, ypu can separate them with comma."
        % (company_name, company_short_description)
    )

    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": "You are a helpful assistant to find private company information based on your best and updated knowledge",
            },
            {"role": "user", "content": prompt_investors},
        ],
    )

    answer = completion.choices[0].message.content
    return answer


if __name__ == "__main__":
    load_dotenv()
