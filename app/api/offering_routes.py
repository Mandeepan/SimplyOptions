from flask import Blueprint, request, make_response, jsonify
from flask_login import login_required
from app.models import Offer, Instrument, Company, User, Listing, db
from datetime import datetime

offering_routes = Blueprint("offerings", __name__)


# get all offers for a specific instrument
@offering_routes.route("/instruments/<int:instrumentId>", methods=["GET"])
@login_required
def get_an_offer_by_instrument(instrumentId):
    try:
        offerings = (
            Offer.query.filter(
                Offer.instrument_id == instrumentId, Offer.status != "Filled"
            )
            .order_by(Offer.offered_price.desc())
            .all()
        )

        if not offerings:
            return make_response(
                jsonify({"message": "Instrument couldn't be found"}),
                404,
                {"Content-Type": "application/json"},
            )

        offerings_data = [
            {
                "id": offering.id,
                "instrument_id": offering.instrument_id,
                "offer_user_id": offering.offer_user_id,
                "status": offering.status,
                "offered_price": offering.offered_price,
                "initial_quantity": offering.initial_quantity,
                "remaining_quantity": offering.remaining_quantity,
                "offered_on_et": offering.offered_on_et.strftime("%Y-%m-%d")
                if offering.offered_on_et
                else None,
                "settled_on_et": offering.settled_on_et.strftime("%Y-%m-%d")
                if offering.settled_on_et
                else None,
            }
            for offering in offerings
        ]
        return make_response(jsonify({"offerings": offerings_data}), 200)
    except Exception as e:
        return make_response(
            jsonify({"message": str(e)}), 500, {"Content-Type": "application/json"}
        )


# get all offers posted by a specific user
@offering_routes.route("/users/<int:userId>", methods=["GET"])
@login_required
def get_offerings_by_user(userId):
    try:
        offerings = (
            db.session.query(Offer, Instrument, Company)
            .join(Instrument, Instrument.id == Offer.instrument_id)
            .join(Company, Company.id == Instrument.company_id)
            .filter(Offer.offer_user_id == userId, Offer.remaining_quantity != 0)
            .order_by(Offer.created_at_et.desc())
            .all()
        )

        if not offerings:
            return make_response(
                jsonify({"listing": []}),
                200,
                {"Content-Type": "application/json"},
            )
        offerings_data = [
            {
                "id": offering.id,
                "instrument_id": offering.instrument_id,
                "instrument_name": instrument.instrument_name,
                "instrument_type": instrument.instrument_type,
                "instrument_class": instrument.instrument_class,
                "company_name": company.company_name,
                "offer_user_id": offering.offer_user_id,
                "status": offering.status,
                "offered_price": offering.offered_price,
                "initial_quantity": offering.initial_quantity,
                "remaining_quantity": offering.remaining_quantity,
                "offered_on_et": offering.offered_on_et.strftime("%Y-%m-%d")
                if offering.offered_on_et
                else None,
                "settled_on_et": offering.settled_on_et.strftime("%Y-%m-%d")
                if offering.settled_on_et
                else None,
            }
            for offering, instrument, company in offerings
        ]
        return make_response(jsonify({"offerings": offerings_data}), 200)
    except Exception as e:
        return make_response(
            jsonify({"message": str(e)}), 500, {"Content-Type": "application/json"}
        )


# post a new the offer record with a specific instrument ID
@offering_routes.route("/instruments/<int:instrumentId>", methods=["POST"])
@login_required
def post_new_offering(instrumentId):
    try:
        instrument = Instrument.query.get(instrumentId)
        if not instrument:
            return make_response(
                jsonify({"message": "Instrument couldn't be found"}),
                404,
                {"Content-Type": "application/json"},
            )

        data = request.get_json()
        offered_price = data.get("offered_price")
        initial_quantity = data.get("initial_quantity")
        offer_user_id = data.get("offer_user_id")

        user = User.query.get(offer_user_id)
        existing_offer = Offer.query.filter(
            Offer.offer_user_id == offer_user_id,
            Offer.status != "Filled",
            Offer.instrument_id == instrumentId,
        ).all()
        existing_listing = Listing.query.filter(
            Listing.listing_user_id == offer_user_id,
            Listing.status != "Filled",
            Listing.instrument_id == instrumentId,
        ).all()
        # check if input data are valid
        if (
            offered_price is None
            or initial_quantity is None
            or offer_user_id is None
            or user is None
        ):
            return make_response(
                jsonify({"message": "Invalid request data"}),
                400,
                {"Content-Type": "application/json"},
            )
        # check if the user has any existing open offer for this instrument
        if len(existing_offer) > 0:
            return make_response(
                jsonify(
                    {
                        "message": "Failed to precess : User has open offer for this instrument and not fully filled yet."
                    }
                ),
                404,
                {"Content-Type": "application/json"},
            )

        # check if the user has existing listing for this instrument
        if len(existing_listing) > 0:
            return make_response(
                jsonify(
                    {
                        "message": "Failed to precess : User has open listing for this instrument and not fully filled yet."
                    }
                ),
                404,
                {"Content-Type": "application/json"},
            )

        # check if the user is the issuer of this instrument's company
        if instrument.company_id == user.company_id:
            return make_response(
                jsonify(
                    {
                        "message": "Failed to process : Issuer role account can not list offer to the company's own instrument."
                    }
                ),
                400,
                {"Content-Type": "application/json"},
            )

        # check if the user's available balance is higher than 1.1  of the offer value
        offer_value_with_margin = initial_quantity * offered_price * 1.1
        if offer_value_with_margin > user.user_available_balance:
            return make_response(
                jsonify(
                    {
                        "message": "Failed to process : User available balance is not sufficient for offered value."
                    }
                ),
                400,
                {"Content-Type": "application/json"},
            )

        new_offering = Offer(
            instrument_id=instrumentId,
            offer_user_id=offer_user_id,
            status="Not Filled",
            offered_price=offered_price,
            initial_quantity=initial_quantity,
            remaining_quantity=initial_quantity,
            offered_on_et=datetime.today(),
            settled_on_et=None,
        )

        db.session.add(new_offering)
        db.session.commit()

        response_body = {
            "id": new_offering.id,
            "instrument_id": new_offering.instrument_id,
            "offer_user_id": new_offering.offer_user_id,
            "status": new_offering.status,
            "offered_price": new_offering.offered_price,
            "initial_quantity": new_offering.initial_quantity,
            "remaining_quantity": new_offering.remaining_quantity,
            "offered_on_et": new_offering.offered_on_et.strftime("%Y-%m-%d"),
            "settled_on_et": new_offering.settled_on_et,
        }

        return make_response(jsonify(response_body), 201)
    except Exception as e:
        db.session.rollback()
        return make_response(
            jsonify({"message": str(e)}), 500, {"Content-Type": "application/json"}
        )


# update an offer
@offering_routes.route("/<int:offeringId>", methods=["PATCH"])
@login_required
def update_offering(offeringId):
    try:
        offering = Offer.query.get(offeringId)
        if not offering:
            return make_response(
                jsonify({"message": "Offer couldn't be found"}),
                404,
                {"Content-Type": "application/json"},
            )

        data = request.get_json()
        offered_price = data.get("offered_price")
        remaining_quantity = data.get("remaining_quantity")

        if offered_price is not None:
            offering.offered_price = offered_price
        if remaining_quantity is not None:
            if remaining_quantity >= offering.initial_quantity:
                offering.initial_quantity = remaining_quantity
                offering.remaining_quantity = remaining_quantity
            else:
                offering.remaining_quantity = remaining_quantity

        if offering.remaining_quantity == 0:
            offering.status = "Filled"
        elif (
            offering.remaining_quantity > 0
            and offering.initial_quantity > offering.remaining_quantity
        ):
            offering.status = "Partially Filled"
        else:
            offering.status = "Not Filled"

        db.session.commit()

        response_body = {
            "id": offering.id,
            "instrument_id": offering.instrument_id,
            "offer_user_id": offering.offer_user_id,
            "status": offering.status,
            "offered_price": offering.offered_price,
            "initial_quantity": offering.initial_quantity,
            "remaining_quantity": offering.remaining_quantity,
            "offered_on_et": offering.offered_on_et.strftime("%Y-%m-%d"),
            "settled_on_et": offering.settled_on_et,
        }

        return make_response(jsonify(response_body), 201)
    except Exception as e:
        db.session.rollback()
        return make_response(
            jsonify({"message": str(e)}), 500, {"Content-Type": "application/json"}
        )


# delete an offer
@offering_routes.route("/<int:offeringId>", methods=["DELETE"])
@login_required
def delete_an_offering(offeringId):
    try:
        offering = Offer.query.filter_by(id=offeringId).first()

        if not offering:
            return make_response(
                jsonify({"message": "Offer couldn't be found"}),
                404,
                {"Content-Type": "application/json"},
            )

        db.session.delete(offering)
        db.session.commit()
        return make_response(
            jsonify({"message": "successfully deleted"}),
            200,
            {"Content-Type": "application/json"},
        )
    except Exception as e:
        db.session.rollback()
        return make_response(
            jsonify({"message": str(e)}), 500, {"Content-Type": "application/json"}
        )
