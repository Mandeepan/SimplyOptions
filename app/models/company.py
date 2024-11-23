from .user import User;
from .db import SCHEMA, add_prefix_for_prod, db, environment
from datetime import datetime
import pytz

class Company(db.Model):
    __tablename__ = "companies"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    # user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id'), ondelete="CASCADE"), nullable=False)
    # stock_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('stocks.id'), ondelete="CASCADE"), nullable=False)
    # share_quantity = db.Column(db.Integer)
    # share_price = db.Column(db.Float(precision=2))
    company_name = db.Column(db.String, nullable=False)
    short_description = db.Column(db.String)
    ai_prompt = db.Column(db.String)
    founded_year = db.Column(db.Integer)
    identifier = db.Column(db.String)
    location_identifiers = db.Column(db.String)
    categories = db.Column(db.String)
    num_employees_enum = db.Column(db.Integer)
    revenue_range = db.Column(db.String)
    operating_status = db.Column(db.String)
    website_url = db.Column(db.String)
    created_at_et = db.Column(db.DateTime, default=lambda: datetime.now(pytz.timezone("America/New_York")))
    updated_at_et = db.Column(db.DateTime, default=lambda: datetime.now(pytz.timezone("America/New_York")), onupdate=lambda: datetime.now(pytz.timezone("America/New_York")))

    users = db.relationship('User', backref="company", lazy='dynamic')
    
