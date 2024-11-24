from sqlalchemy.sql import text
from app.models import SCHEMA, Offer, db, environment
from .seeding_data import offers
from datetime import datetime

def seed_offers():
    for offer in offers:
        offered_on_et = datetime.strptime(offer['offered_on_et'], '%Y-%m-%d').date()
        settled_on_et = None
        if offer['settled_on_et']: 
            settled_on_et = datetime.strptime(offer['settled_on_et'], '%Y-%m-%d').date()
        new_offer = Offer(
            instrument_id=offer['instrument_id'],
            offer_user_id=offer['offer_user_id'],
            status=offer['status'],
            offered_price =offer['offered_price'],
            initial_quantity =offer['initial_quantity'],
            remaining_quantity = offer['remaining_quantity'],
            offered_on_et = offered_on_et,
            settled_on_et = settled_on_et,
        )
        db.session.add(new_offer)
    db.session.commit()

def undo_offers():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.offers RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM offers"))

    db.session.commit()
