from sqlalchemy.sql import text

from app.models import SCHEMA, User, db, environment

# Adds a demo user, you can add other users here if you want
user1 = User(
    first_name="Demo_User_First_Name",
    last_name="Demo_User_Last_Name",
    email="demo1@simplyoptions.com",
    password="password1",
    user_cash_balance=1000.00,
    amount_to_be_debited=100.00,
    amount_to_be_credited=50.00,
    user_available_balance=950.00,
    is_issuer=False,
    company_id=None
)

user2 = User(
    first_name="Demo_Issuer_First_Name",
    last_name="Demo_Issuer_Last_Name",
    email="demo2@simplyoptions.com",
    password="password2",
    user_cash_balance=1500.00,
    amount_to_be_debited=200.00,
    amount_to_be_credited=75.00,
    user_available_balance=1275.00,
    is_issuer=True,
    company_id=1
)

user3 = User(
    first_name="Carol",
    last_name="Davis",
    email="carol.davis@simplyoption.com",
    password="password123",
    user_cash_balance=2000.00,
    amount_to_be_debited=150.00,
    amount_to_be_credited=100.00,
    user_available_balance=1850.00,
    is_issuer=False,
    company_id=None
)

user4 = User(
    first_name="David",
    last_name="Wilson",
    email="david.wilson@simplyoption.com",
    password="password123",
    user_cash_balance=3000.00,
    amount_to_be_debited=300.00,
    amount_to_be_credited=120.00,
    user_available_balance=2580.00,
    is_issuer=True,
    company_id=2
)

user5 = User(
    first_name="Eve",
    last_name="Martinez",
    email="eve.martinez@simplyoption.com",
    password="password123",
    user_cash_balance=500.00,
    amount_to_be_debited=50.00,
    amount_to_be_credited=25.00,
    user_available_balance=475.00,
    is_issuer=True,
    company_id=3
)


def seed_users():
    db.session.add(user1)
    db.session.add(user2)
    db.session.add(user3)
    db.session.add(user4)
    db.session.add(user5)
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
