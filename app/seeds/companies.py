from sqlalchemy.sql import text
from app.models import SCHEMA, Company, db, environment

# Adding company records
company1 = Company(
    company_name="Stripe",
    short_description="A technology company that builds economic infrastructure for the internet.",
    ai_prompt="Empowering businesses of all sizes to accept payments online.",
    founded_year=2010,
    identifier="STRIPE-001",
    location_identifiers="San Francisco, USA",
    categories="Payments, FinTech, SaaS",
    num_employees_enum=7000,
    revenue_range="1B+",
    operating_status="Active",
    website_url="https://www.stripe.com"
)

company2 = Company(
    company_name="SpaceX",
    short_description="Aerospace manufacturer and space transportation services company.",
    ai_prompt="Revolutionizing space technology, with the ultimate goal of enabling people to live on other planets.",
    founded_year=2002,
    identifier="SPACEX-002",
    location_identifiers="Hawthorne, USA",
    categories="Aerospace, Space, Technology",
    num_employees_enum=12000,
    revenue_range="2B+",
    operating_status="Active",
    website_url="https://www.spacex.com"
)

company3 = Company(
    company_name="Robinhood",
    short_description="A financial services company offering commission-free trades of stocks and exchange-traded funds.",
    ai_prompt="Democratizing finance for all.",
    founded_year=2013,
    identifier="ROBINHOOD-003",
    location_identifiers="Menlo Park, USA",
    categories="Finance, Stock Trading, Technology",
    num_employees_enum=3800,
    revenue_range="1B+",
    operating_status="Active",
    website_url="https://www.robinhood.com",
)

def seed_companies():
    db.session.add(company1)
    db.session.add(company2)
    db.session.add(company3)
    db.session.commit()

def undo_companies():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.companies RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM companies"))

    db.session.commit()
