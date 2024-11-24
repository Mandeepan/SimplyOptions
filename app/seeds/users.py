from sqlalchemy.sql import text
from .seeding_data import users
from app.models import SCHEMA, User, db, environment
from werkzeug.security import generate_password_hash

def seed_users():
    for user in users:
        hashed_password = generate_password_hash(user['password'])
        new_user = User(
            first_name=user['first_name'],
            last_name=user['last_name'],
            email=user['email'],
            hashed_password=hashed_password,
            user_cash_balance=user['user_cash_balance'],
            amount_to_be_debited=user['amount_to_be_debited'],
            amount_to_be_credited=user['amount_to_be_credited'],
            user_available_balance=user['user_available_balance'],
            is_issuer=user['is_issuer'],
            company_id=user['company_id']
        )
        db.session.add(new_user)
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_users():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM users"))

    db.session.commit()
