import requests
import json
import pandas as pd
import os
from dotenv import load_dotenv
from sqlalchemy.sql import text
import sys
import openai_routes as ai
from tqdm import tqdm

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../")))
from app import app
from app.models import db, Company
from sqlalchemy.exc import IntegrityError


def fetch_data(query, userkey):
    r = requests.post(
        "https://api.crunchbase.com/api/v4/searches/organizations",
        params={"user_key": userkey},
        json=query,
    )
    result = pd.DataFrame(json.loads(r.text))
    return result


def extract_location_string(location_identifiers):
    result_string = ""
    for item in location_identifiers:
        result_string = result_string + ", " + item["value"]
    return result_string[2:]


def data_formatter(data):
    clean_data = pd.DataFrame([])

    for i in range(0, len(data)):
        row_data = pd.DataFrame.from_dict(data.entities[i])

        company_name_value = row_data.properties.loc["name"]
        short_description_value = row_data.properties.loc["short_description"]
        location_identifiers_value = extract_location_string(
            row_data.properties.loc["location_identifiers"]
        )
        website_url_value = row_data.properties.loc["website_url"]
        logo_url_value = row_data.properties.loc["image_url"]
        api_identifier_value = row_data.properties.loc["identifier"]["uuid"]

        each_record = pd.DataFrame(
            {
                "company_name": company_name_value,
                "short_description": short_description_value,
                "location_identifiers": location_identifiers_value,
                "website_url": website_url_value,
                "logo_url": logo_url_value,
                "api_identifier": api_identifier_value,
            },
            index=[i],
        )
        clean_data = pd.concat([clean_data, each_record], axis=0)

    return clean_data


def get_ai_responses(clean_data):
    clean_data[
        [
            "founded_year",
            "ai_prompt",
            "categories",
            "num_employees_enum",
            "revenue_range",
            "investors",
        ]
    ] = "", "", "", "", "", ""

    for i in tqdm(range(0, len(clean_data))):
        company_name = clean_data.loc[i, "company_name"]
        short_desc = clean_data.loc[i, "short_description"]
        try:
            clean_data.loc[i, "founded_year"] = ai.get_founded_year(
                company_name, short_desc
            )
            clean_data.loc[i, "ai_prompt"] = ai.get_insight(company_name, short_desc)
            clean_data.loc[i, "categories"] = ai.get_industry_category(
                company_name, short_desc
            )
            clean_data.loc[i, "num_employees_enum"] = ai.get_employee_count_range(
                company_name, short_desc
            )
            clean_data.loc[i, "revenue_range"] = ai.get_revenue_range(
                company_name, short_desc
            )
            clean_data.loc[i, "investors"] = ai.get_investors(company_name, short_desc)
        except Exception:
            print("Can not fetch response from OpenAI for %s" % company_name)
            continue
    return clean_data


def insert_companies(clean_data):
    """
    Inserts the cleaned company data from a DataFrame into the companies table, using the appropriate
    environment settings for the database (either local SQLite or production PostgreSQL).
    """
    with app.app_context():
        for index, row in clean_data.iterrows():
            try:
                new_company = Company(
                    company_name=row["company_name"],
                    short_description=row["short_description"],
                    location_identifiers=row["location_identifiers"],
                    website_url=row["website_url"],
                    logo_url=row["logo_url"],
                    api_identifier=row["api_identifier"],
                    operating_status="Active",
                    founded_year=int(row["founded_year"]),
                    ai_prompt=row["ai_prompt"],
                    categories=row["categories"],
                    num_employees_enum=row["num_employees_enum"],
                    revenue_range=row["revenue_range"],
                    investors=row["investors"],
                )
                db.session.add(new_company)
            except IntegrityError as e:
                # Rollback the session in case of an integrity error like a duplicate entry
                db.session.rollback()
                print(
                    f"IntegrityError while inserting company {row['company_name']}: {e}"
                )
            except Exception as e:
                # Handle any other exceptions that may occur
                db.session.rollback()
                print(f"Error while inserting company {row['company_name']}: {e}")

        # Commit all valid inserts to the database
        try:
            db.session.commit()
            print("All valid companies inserted successfully.")
        except Exception as e:
            print(f"Error during commit: {e}")
            db.session.rollback()


def main():
    load_dotenv()
    userkey = os.getenv("CRUNCHBASE_API_KEY")
    num_of_company = 30
    query = {
        "field_ids": [
            "name",
            "identifier",
            "location_identifiers",
            "short_description",
            "website_url",
            "image_url",
        ],
        "query": [
            {
                "type": "predicate",
                "field_id": "location_identifiers",
                "operator_id": "includes",
                "values": [
                    "f110fca2-1055-99f6-996d-011c198b3928"
                ],  # this is United States UUID
            },
            {
                "type": "predicate",
                "field_id": "facet_ids",
                "operator_id": "includes",
                "values": ["company"],
            },
        ],
        "limit": num_of_company,
    }
    data = fetch_data(query, userkey)
    clean_data = data_formatter(data)
    full_data = get_ai_responses(clean_data)
    full_data.to_csv("./external_data.csv")
    insert_companies(full_data)


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print("Error in fetching data from external API:", e)
