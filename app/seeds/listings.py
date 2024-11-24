from sqlalchemy.sql import text
from app.models import SCHEMA, Listing, db, environment
from .seeding_data import listings
from datetime import datetime

def seed_listings():
    for listing in listings:
        listed_on_et = datetime.strptime(listing['listed_on_et'], '%Y-%m-%d').date()
        settled_on_et = None
        if listing['settled_on_et']: 
            settled_on_et = datetime.strptime(listing['settled_on_et'], '%Y-%m-%d').date()
        new_listing = Listing(
            instrument_id=listing['instrument_id'],
            listing_user_id=listing['listing_user_id'],
            status=listing['status'],
            listed_price =listing['listed_price'],
            initial_quantity =listing['initial_quantity'],
            remaining_quantity = listing['remaining_quantity'],
            listed_on_et = listed_on_et,
            settled_on_et = settled_on_et,
        )
        db.session.add(new_listing)
    db.session.commit()

def undo_listings():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.listings RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM listings"))

    db.session.commit()
