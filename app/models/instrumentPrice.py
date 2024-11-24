from .db import SCHEMA, add_prefix_for_prod, db, environment, current_eastern_time

class InstrumentPrice(db.Model):
    __tablename__ = "instrument_prices"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    instrument_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("instruments.id")), nullable=False)
    recorded_on_et= db.Column(db.Date)
    recorded_price = db.Column(db.Float(precision=2), nullable=False)
    created_at_et = db.Column(db.DateTime, default=current_eastern_time)
    updated_at_et = db.Column(db.DateTime, default=current_eastern_time, onupdate=current_eastern_time)

    def to_dict(self):
        return {
            "id": self.id,
            "instrument_id": self.instrument_id,
            "recorded_on_et":self.recorded_on_et,
            "recorded_price": self.recorded_price,
            "created_at_et": self.created_at_et,
            "updated_at_et": self.updated_at_et
        }
