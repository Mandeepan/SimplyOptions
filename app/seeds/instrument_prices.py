from sqlalchemy.sql import text
from app.models import SCHEMA, InstrumentPrice, db, environment
from .seeding_data import instrument_prices
from datetime import datetime

def seed_instrument_prices():
    for instrument_price in instrument_prices:
        recorded_on_et = datetime.strptime(instrument_price['recorded_on_et'], '%Y-%m-%d').date()
        new_instrument_price = InstrumentPrice(
            instrument_id=instrument_price['instrument_id'],
            recorded_on_et = recorded_on_et,
            recorded_price=instrument_price['recorded_price'],
        )
        db.session.add(new_instrument_price)
    db.session.commit()

def undo_instrument_prices():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.instrument_prices RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM instrument_prices"))

    db.session.commit()
