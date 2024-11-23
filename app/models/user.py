from flask_login import UserMixin
from werkzeug.security import check_password_hash, generate_password_hash
from .db import SCHEMA, db, environment, add_prefix_for_prod
from datetime import datetime
import pytz

def current_eastern_time():
    tz = pytz.timezone("America/New_York")
    return datetime.now(tz)

class User(db.Model, UserMixin):
    __tablename__ = "users"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(40), nullable=False)
    last_name = db.Column(db.String(40), nullable=False)
    email = db.Column(db.String(255), nullable=False, unique=True)
    hashed_password = db.Column(db.String(255), nullable=False)
    user_cash_balance = db.Column(db.Float(precision=2), default=0.0)
    amount_to_be_debited = db.Column(db.Float(precision=2), default=0.0)
    amount_to_be_credited = db.Column(db.Float(precision=2), default=0.0)
    user_available_balance = db.Column(db.Float(precision=2), default=0.0)
    is_issuer=db.Column(db.Boolean, default=False)
    company_id=db.Column(db.Integer,db.ForeignKey(add_prefix_for_prod('companies.id')),default=0)
    created_on_et = db.Column(db.Date, default=lambda: current_eastern_time().date())
    created_at_et = db.Column(db.DateTime, default=current_eastern_time)
    updated_at_et = db.Column(db.DateTime,  default=current_eastern_time, onupdate=current_eastern_time)

    # Related data
    # tweets = db.relationship("Tweet", back_populates="author")
    # liked_tweets = db.relationship("Tweet", back_populates="liked_by", secondary=likes)

    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict_basic(self):
        return {"id": self.id, 
                "first_name": self.first_name, 
                "last_name": self.last_name, 
                "email": self.email,
                "user_cash_balance" : self.user_cash_balance,
                "amount_to_be_credited" : self.amount_to_be_credited,
                "amount_to_be_debited": self.amount_to_be_debited,
                "user_available_balance": self.user_available_balance,
                "is_issuer": self.is_issuer,
                "company_id": self.company_id
                }

    def to_dict(self):
        return {
            **self.to_dict_basic(),
            # "Tweets": [tweet.to_dict_basic() for tweet in self.tweets],
            # "LikedTweets": [tweet.to_dict_basic() for tweet in self.liked_tweets],
        }
