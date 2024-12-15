import requests
import json
import pandas as pd
import os
from dotenv import load_dotenv
from sqlalchemy.sql import text
import sys
import openai_helper as ai
from tqdm import tqdm
import random

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
    print("===Getting Company Data====================")
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


def save_seeding_data(full_data, item_name):
    parent_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../"))
    seeds_folder = os.path.join(parent_dir, "seeds")
    output_file_path = os.path.join(seeds_folder, "%s_data.py" % item_name)
    with open(output_file_path, "w") as f:
        f.write("%s = [\n" % item_name)
        for _, row in full_data.iterrows():
            f.write("    {\n")
            for column, value in row.items():
                # Escape strings properly and format the output
                if isinstance(value, str):
                    value = value.replace(
                        '"', '\\"'
                    )  # Escape double quotes for strings
                    f.write(f'        "{column}": "{value}",\n')
                elif pd.isna(value):  # Handle NaN values
                    f.write(f'        "{column}": None,\n')
                else:
                    f.write(f'        "{column}": {value},\n')
            f.write("    },\n")
        f.write("]\n")


def generate_instrument_data(full_company_data):
    types = ["Common Share", "Preferred Share", "Executive Share"]
    classes = ["Class A", "Class B", "Class C"]
    full_instrument_data = pd.DataFrame()
    print("===Getting Instrument Data====================")
    for i in tqdm(range(0, len(full_company_data))):
        company_name = full_company_data.loc[i, "company_name"]
        founder_year = str(full_company_data.loc[i, "founded_year"])
        for j in range(0, 3):
            if j == 0:
                updated_price = round(random.uniform(20, 200), 2)
                updated_quantity = round(random.uniform(1000, 100000), 0)
                updated_value = updated_price * updated_quantity
            else:
                updated_price = updated_price * 1.5
                updated_quantity = updated_quantity * 0.25
                updated_value = updated_price * updated_quantity
            each_row = pd.DataFrame(
                {
                    "company_id": [i + 1],
                    "instrument_name": [company_name + " " + types[j]],
                    "issuer_user_id": [i + 2],
                    "issued_on_et": ["%s-06-01" % founder_year],
                    "instrument_type": [types[j]],
                    "instrument_class": [classes[j]],
                    "updated_value": [round(updated_value, 2)],
                    "updated_issued_quantity": [int(updated_quantity)],
                    "updated_price": [round(updated_price, 2)],
                }
            )
            full_instrument_data = pd.concat([full_instrument_data, each_row], axis=0)
    return full_instrument_data


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
    full_company_data = get_ai_responses(clean_data)
    full_instrument_data = generate_instrument_data(full_company_data)
    save_seeding_data(full_company_data, "companies")
    save_seeding_data(full_instrument_data, "instruments")

    """
    the line below is commented out. It will be used when an ad-hoc data insertion is needed.
    """
    # insert_companies(full_company_data)


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print("Error in fetching data from external API:", e)
