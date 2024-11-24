from .db import SCHEMA, add_prefix_for_prod, db, environment, current_eastern_time


class Transaction(db.Model):
    __tablename__ = "transactions"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    instrument_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("instruments.id")), nullable=False)
    offer_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("offers.id")), nullable=False)
    listing_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("listings.id")), nullable=False)
    status = db.Column(db.String, default="Pending")
    transaction_price = db.Column(db.Float(precision=2), nullable=False)
    transaction_quantity = db.Column(db.Integer)
    settled_on_et = db.Column (db.Date)
    transaction_price = db.Column(db.Float(precision=2),default=lambda:transaction_price*transaction_quantity*0.02, nullable=False)
    created_at_et = db.Column(db.DateTime, default=current_eastern_time)
    updated_at_et = db.Column(db.DateTime, default=current_eastern_time, onupdate=current_eastern_time)

    def to_dict(self):
        return {
            "id": self.id,
            "instrument_id": self.instrument_id,
            "offer_id":self.offer_id,
            "listing_id":self.listing_id,
            "status":self.status,
            "transaction_price":self.transaction_price,
            "transaction_quantity":self.transaction_quantity,
            "settled_on_et":self.settled_on_et,
            "transaction_fee":self.transaction_fee,
            "created_at_et": self.created_at_et,
            "updated_at_et": self.updated_at_et
        }
