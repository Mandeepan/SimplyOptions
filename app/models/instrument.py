from .db import SCHEMA, add_prefix_for_prod, db, environment, current_eastern_time
from .instrumentPrice import InstrumentPrice
from .offer import Offer
from .listing import Listing
class Instrument(db.Model):
    __tablename__ = "instruments"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    company_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("companies.id")), nullable=False)
    instrument_name = db.Column(db.String, nullable=False)
    issuer_user_id = db.Column(db.Integer,db.ForeignKey(add_prefix_for_prod("users.id")))
    issued_on_et = db.Column(db.Date)
    instrument_type = db.Column(db.String, nullable=False)
    instrument_class = db.Column(db.String, nullable=False)  
    updated_value = db.Column(db.Float(precision=2))
    updated_issued_quantity = db.Column(db.Integer)
    updated_price = db.Column(db.Float(precision=2), nullable=False)
    created_at_et = db.Column(db.DateTime, default=current_eastern_time)
    updated_at_et = db.Column(db.DateTime, default=current_eastern_time, onupdate=current_eastern_time)
    
    instrument_prices = db.relationship('InstrumentPrice', backref='instruments',lazy=True)
    offers = db.relationship('Offer', backref='instruments',lazy=True)
    listings = db.relationship('Listing', backref='instruments',lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "company_id": self.company_id,
            "instrument_name": self.instrument_name,
            "issuer_user_id": self.issuer_user_id,
            "issued_on_et": self.issued_on_et,
            "instrument_type": self.instrument_type,
            "instrument_class_": self.instrument_class_,
            "updated_value": self.updated_value,
            "updated_issued_quantity": self.updated_issued_quantity,
            "updated_price": self.updated_price,
            "created_at_et": self.created_at_et,
            "updated_at_et": self.updated_at_et
        }
