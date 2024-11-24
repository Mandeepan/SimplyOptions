from .db import SCHEMA, add_prefix_for_prod, db, environment, current_eastern_time


class Listing(db.Model):
    __tablename__ = "listings"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    instrument_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("instruments.id")), nullable=False)
    listing_user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    status = db.Column(db.String, default="Not Filled")
    listed_price = db.Column(db.Float(precision=2), nullable=False)
    initial_quantity = db.Column(db.Integer, nullable=False)
    remaining_quantity = db.Column(db.Integer, default=initial_quantity)
    listed_on_et = db.Column(db.DateTime, default=lambda: current_eastern_time().date())
    settled_on_et = db.Column (db.Date)
    created_at_et = db.Column(db.DateTime, default=current_eastern_time)
    updated_at_et = db.Column(db.DateTime, default=current_eastern_time, onupdate=current_eastern_time)

    def to_dict(self):
        return {
            "id": self.id,
            "instrument_id": self.instrument_id,
            "listing_user_id":self.listing_user_id,
            "status":self.status,
            "listed_price":self.listed_price,
            "initial_quantity":self.initial_quantity,
            "remaining_quantity":self.remaining_quantity,
            "listed_on_et":self.listed_on_et,
            "settled_on_et":self.settled_on_et,
            "created_at_et": self.created_at_et,
            "updated_at_et": self.updated_at_et
        }
