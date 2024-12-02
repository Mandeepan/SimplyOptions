import requests
import json
import pandas as pd
import os
from dotenv import load_dotenv
from sqlalchemy.sql import text
import sys

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
        api_identifier_value = row_data.properties.loc["identifier"]

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


# def main():
load_dotenv()
userkey = os.getenv("CRUNCHBASE_API_KEY")
num_of_company = 2
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
            "values": ["4ce61f42-f6c4-e7ec-798d-44813b58856b"],
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
# clean_data.to_csv("./external_data.csv")
insert_companies(clean_data)


# if __name__ == "__main__":
#     try:
#         main()
#     except Exception as e:
#         print("Error in fetching data from external API:", e)
