from flask.cli import AppGroup

from app.models.db import SCHEMA, db, environment

# from .tweets import seed_tweets, undo_tweets
from .users import seed_users, undo_users
from .companies import seed_companies,undo_companies
from .instruments import seed_instruments,undo_instruments
from .instrument_prices import seed_instrument_prices,undo_instrument_prices
from .offers import seed_offers, undo_offers
from .listings import seed_listings, undo_listings
from .transactions import seed_transactions, undo_transactions
from .documents import seed_documents, undo_documents
# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup("seed")


# Creates the `flask seed all` command
@seed_commands.command("all")
def seed():
    if environment == "production":
        # Before seeding in production, you want to run the seed undo
        # command, which will  truncate all tables prefixed with
        # the schema name (see comment in users.py undo_users function).
        # Make sure to add all your other model's undo functions below
        undo_documents()
        undo_transactions()
        undo_offers()
        undo_listings()
        undo_instrument_prices()
        undo_instruments()
        undo_users()
        undo_companies()
    
    seed_companies() 
    seed_users()
    seed_instruments()
    seed_instrument_prices()
    seed_listings()
    seed_offers()
    seed_transactions()
    seed_documents()

# Creates the `flask seed undo` command
@seed_commands.command("undo")
def undo():
    undo_documents()
    undo_transactions()
    undo_offers()
    undo_listings()
    undo_instrument_prices()
    undo_instruments()
    undo_users()
    undo_companies()
