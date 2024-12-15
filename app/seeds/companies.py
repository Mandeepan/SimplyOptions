from sqlalchemy.sql import text
from app.models import SCHEMA, Company, db, environment
from .companies_data import companies


def seed_companies():
    for company in companies:
        new_company = Company(
            company_name=company["company_name"],
            operating_status="Active",
            location_identifiers=company["location_identifiers"],
            short_description=company["short_description"],
            founded_year=company["founded_year"],
            num_employees_enum=company["num_employees_enum"],
            revenue_range=company["revenue_range"],
            website_url=company["website_url"],
            logo_url=company["logo_url"],
            api_identifier=company["api_identifier"],
            investors=company["investors"],
            ai_prompt=company["ai_prompt"],
            categories=company["categories"],
        )
        db.session.add(new_company)
    db.session.commit()


def undo_companies():
    if environment == "production":
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.companies RESTART IDENTITY CASCADE;"
        )
    else:
        db.session.execute(text("DELETE FROM companies"))

    db.session.commit()
