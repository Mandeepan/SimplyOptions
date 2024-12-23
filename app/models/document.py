from .db import SCHEMA, add_prefix_for_prod, db, environment, current_eastern_time


class Document(db.Model):
    __tablename__ = "documents"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    transaction_id = db.Column(
        db.Integer,
        db.ForeignKey(add_prefix_for_prod("transactions.id")),
        nullable=False,
    )
    listing_id = db.Column(
        db.Integer, db.ForeignKey(add_prefix_for_prod("listings.id")), nullable=False
    )
    offer_id = db.Column(
        db.Integer, db.ForeignKey(add_prefix_for_prod("offers.id")), nullable=False
    )
    user_id = db.Column(
        db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False
    )
    doc_url = db.Column(db.String)
    created_at_et = db.Column(db.DateTime, default=current_eastern_time)
    updated_at_et = db.Column(
        db.DateTime, default=current_eastern_time, onupdate=current_eastern_time
    )

    def to_dict(self):
        return {
            "id": self.id,
            "listing_id": self.listing_id,
            "offer_id": self.offer_id,
            "user_id": self.user_id,
            "doc_url": self.doc_url,
            "created_at_et": self.created_at_et,
            "updated_at_et": self.updated_at_et,
        }
