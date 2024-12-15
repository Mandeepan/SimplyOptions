from sqlalchemy.sql import text
from app.models import SCHEMA, Instrument, db, environment
from .instruments_data import instruments
from datetime import datetime


def seed_instruments():
    for instrument in instruments:
        issued_on_et = datetime.strptime(instrument["issued_on_et"], "%Y-%m-%d").date()
        new_instrument = Instrument(
            company_id=instrument["company_id"],
            instrument_name=instrument["instrument_name"],
            issuer_user_id=instrument["issuer_user_id"],
            issued_on_et=issued_on_et,
            instrument_type=instrument["instrument_type"],
            instrument_class=instrument["instrument_class"],
            updated_value=instrument["updated_value"],
            updated_issued_quantity=instrument["updated_issued_quantity"],
            updated_price=instrument["updated_price"],
        )
        db.session.add(new_instrument)
    db.session.commit()


def undo_instruments():
    if environment == "production":
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.instruments RESTART IDENTITY CASCADE;"
        )
    else:
        db.session.execute(text("DELETE FROM instruments"))

    db.session.commit()
