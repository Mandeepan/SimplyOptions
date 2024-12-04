from sqlalchemy.sql import text
from app.models import SCHEMA, Transaction, db, environment
from .seeding_data import transactions
from datetime import datetime


def seed_transactions():
    for transaction in transactions:
        settled_on_et = None
        if transaction["settled_on_et"]:
            settled_on_et = datetime.strptime(
                transaction["settled_on_et"], "%Y-%m-%d"
            ).date()
        new_transaction = Transaction(
            instrument_id=transaction["instrument_id"],
            offer_id=transaction["offer_id"],
            listing_id=transaction["listing_id"],
            status=transaction["status"],
            transaction_price=transaction["transaction_price"],
            transaction_quantity=transaction["transaction_quantity"],
            transaction_fee=transaction["transaction_price"]
            * transaction["transaction_quantity"]
            * 0.02,
            settled_on_et=settled_on_et,
        )
        db.session.add(new_transaction)
    db.session.commit()


def undo_transactions():
    if environment == "production":
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.transactions RESTART IDENTITY CASCADE;"
        )
    else:
        db.session.execute(text("DELETE FROM transactions"))

    db.session.commit()
