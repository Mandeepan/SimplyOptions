from .db import SCHEMA, add_prefix_for_prod, db, environment,current_eastern_time
from .user import User
from .instrument import Instrument

class Company(db.Model):
    __tablename__ = "companies"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    company_name = db.Column(db.String, nullable=False)
    short_description = db.Column(db.String)
    ai_prompt = db.Column(db.String)
    founded_year = db.Column(db.Integer)
    api_identifier = db.Column(db.String)
    location_identifiers = db.Column(db.String)
    categories = db.Column(db.String)
    num_employees_enum = db.Column(db.Integer)
    revenue_range = db.Column(db.String)
    operating_status = db.Column(db.String)
    website_url = db.Column(db.String)
    logo_url = db.Column(db.String)
    investors = db.Column(db.String)
    created_at_et = db.Column(db.DateTime, default=current_eastern_time)
    updated_at_et = db.Column(db.DateTime,  default=current_eastern_time, onupdate=current_eastern_time)

    users = db.relationship('User', backref="companies", lazy='dynamic')
    instruments = db.relationship('Instrument', backref='companies',lazy=True)
    
    def to_dict(self):
        return {
            "id": self.id,
            "company_name": self.company_name,
            "short_description": self.short_description,
            "ai_prompt": self.ai_prompt,
            "founded_year": self.founded_year,
            "api_identifier": self.identifier,
            "location_identifiers": self.location_identifiers,
            "categories": self.categories,
            "num_employees_enum": self.num_employees_enum,
            "revenue_range": self.revenue_range,
            "operating_status": self.operating_status,
            "website_url": self.website_url,
            "logo_url": self.logo_url,
            "investors": self.investors,
            "created_at_et": self.created_at_et,
            "updated_at_et": self.updated_at_et
        }
