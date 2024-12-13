from flask import Blueprint, request, make_response, jsonify
from flask_login import login_required, current_user

# from app.api.aws import get_unique_filename, upload_file_to_s3
from app.models import Listing, Instrument, Company, Offer, User, db
from datetime import datetime

listing_routes = Blueprint("listings", __name__)


# get all the listings related to one specific instrument
@listing_routes.route("/instruments/<int:instrumentId>", methods=["GET"])
@login_required
def get_a_listing_by_instrument(instrumentId):
    try:
        listings = (
            Listing.query.filter(
                Listing.instrument_id == instrumentId, Listing.status != "Filled"
            )
            .order_by(Listing.listed_price)
            .all()
        )

        if not listings:
            return make_response(
                jsonify({"message": "Instrument couldn't be found"}),
                404,
                {"Content-Type": "application/json"},
            )

        listings_data = [
            {
                "id": listing.id,
                "instrument_id": listing.instrument_id,
                "listing_user_id": listing.listing_user_id,
                "status": listing.status,
                "listed_price": listing.listed_price,
                "initial_quantity": listing.initial_quantity,
                "remaining_quantity": listing.remaining_quantity,
                "listed_on_et": listing.listed_on_et.strftime("%Y-%m-%d")
                if listing.listed_on_et
                else None,
                "settled_on_et": listing.settled_on_et.strftime("%Y-%m-%d")
                if listing.settled_on_et
                else None,
            }
            for listing in listings
        ]
        response_body = {"listings": listings_data}
        return make_response(jsonify(response_body), 200)
    except Exception as e:
        return make_response(
            jsonify({"message": str(e)}), 500, {"Content-Type": "application/json"}
        )


# get all the listings related to one specific user
@listing_routes.route("/users/<int:userId>", methods=["GET"])
@login_required
def get_listings_by_user(userId):
    try:
        listings = (
            db.session.query(Listing, Instrument, Company)
            .join(Instrument, Instrument.id == Listing.instrument_id)
            .join(Company, Company.id == Instrument.company_id)
            .filter(Listing.listing_user_id == userId, Listing.remaining_quantity != 0)
            .order_by(Listing.created_at_et.desc())
            .all()
        )

        if not listings:
            return make_response(
                jsonify({"listing": []}),
                200,
                {"Content-Type": "application/json"},
            )

        listings_data = [
            {
                "id": listing.id,
                "instrument_id": listing.instrument_id,
                "instrument_name": instrument.instrument_name,
                "instrument_type": instrument.instrument_type,
                "instrument_class": instrument.instrument_class,
                "company_name": company.company_name,
                "listing_user_id": listing.listing_user_id,
                "status": listing.status,
                "listed_price": listing.listed_price,
                "initial_quantity": listing.initial_quantity,
                "remaining_quantity": listing.remaining_quantity,
                "listed_on_et": listing.listed_on_et.strftime("%Y-%m-%d")
                if listing.listed_on_et
                else None,
                "settled_on_et": listing.settled_on_et.strftime("%Y-%m-%d")
                if listing.settled_on_et
                else None,
            }
            for listing, instrument, company in listings
        ]

        response_body = {"listings": listings_data}

        return make_response(jsonify(response_body), 200)
    except Exception as e:
        return make_response(
            jsonify({"message": str(e)}), 500, {"Content-Type": "application/json"}
        )


# add a new listings based on a specific instrument
@listing_routes.route("/instruments/<int:instrumentId>", methods=["POST"])
@login_required
def post_new_listing(instrumentId):
    try:
        # Check if the instrument ID is valid
        instrument = Instrument.query.get(instrumentId)
        if not instrument:
            return make_response(
                jsonify({"message": "Instrument couldn't be found"}),
                404,
                {"Content-Type": "application/json"},
            )

        data = request.get_json()
        listed_price = data.get("listed_price")
        initial_quantity = data.get("initial_quantity")
        listing_user_id = data.get("listing_user_id")

        user = User.query.get(listing_user_id)
        existing_offer = Offer.query.filter(
            Offer.offer_user_id == listing_user_id,
            Offer.status != "Filled",
            Offer.instrument_id == instrumentId,
        ).all()

        existing_listing = Listing.query.filter(
            Listing.listing_user_id == listing_user_id,
            Listing.status != "Filled",
            Listing.instrument_id == instrumentId,
        ).all()
        # check if the input data is valid
        if listed_price is None or initial_quantity is None or listing_user_id is None:
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
                        "message": "Failed to process : Issuer role account can not list the company's own instrument."
                    }
                ),
                400,
                {"Content-Type": "application/json"},
            )

        new_listing = Listing(
            instrument_id=instrumentId,
            listing_user_id=listing_user_id,
            status="Not Filled",
            listed_price=listed_price,
            initial_quantity=initial_quantity,
            remaining_quantity=initial_quantity,
            listed_on_et=datetime.today(),
            settled_on_et=None,
        )

        db.session.add(new_listing)
        db.session.commit()

        response_body = {
            "id": new_listing.id,
            "instrument_id": new_listing.instrument_id,
            "listing_user_id": new_listing.listing_user_id,
            "status": new_listing.status,
            "listed_price": new_listing.listed_price,
            "initial_quantity": new_listing.initial_quantity,
            "remaining_quantity": new_listing.remaining_quantity,
            "listed_on_et": new_listing.listed_on_et.strftime("%Y-%m-%d"),
            "settled_on_et": new_listing.settled_on_et,
        }

        return make_response(jsonify(response_body), 201)
    except Exception as e:
        db.session.rollback()
        return make_response(
            jsonify({"message": str(e)}), 500, {"Content-Type": "application/json"}
        )


# update a listing based on a listing id


@listing_routes.route("/<int:listingId>", methods=["PATCH"])
@login_required
def update_listing(listingId):
    try:
        # Check if the listing ID is valid
        listing = Listing.query.get(listingId)
        if not listing:
            return make_response(
                jsonify({"message": "Listing couldn't be found"}),
                404,
                {"Content-Type": "application/json"},
            )

        data = request.get_json()
        listed_price = data.get("listed_price")
        remaining_quantity = data.get("remaining_quantity")

        if listed_price is not None:
            listing.listed_price = listed_price
        if remaining_quantity is not None:
            if remaining_quantity >= listing.initial_quantity:
                listing.initial_quantity = remaining_quantity
                listing.remaining_quantity = remaining_quantity
            else:
                listing.remaining_quantity = remaining_quantity

        if listing.remaining_quantity == 0:
            listing.status = "Filled"
        elif (
            listing.remaining_quantity > 0
            and listing.initial_quantity > listing.remaining_quantity
        ):
            listing.status = "Partially Filled"
        else:
            listing.status = "Not Filled"

        db.session.commit()

        response_body = {
            "id": listing.id,
            "instrument_id": listing.instrument_id,
            "listing_user_id": listing.listing_user_id,
            "status": listing.status,
            "listed_price": listing.listed_price,
            "initial_quantity": listing.initial_quantity,
            "remaining_quantity": listing.remaining_quantity,
            "listed_on_et": listing.listed_on_et.strftime("%Y-%m-%d"),
            "settled_on_et": listing.settled_on_et,
        }

        return make_response(jsonify(response_body), 201)
    except Exception as e:
        db.session.rollback()
        return make_response(
            jsonify({"message": str(e)}), 500, {"Content-Type": "application/json"}
        )


# route to delete an listing
@listing_routes.route("/<int:listingId>", methods=["DELETE"])
@login_required
def delete_an_listing(listingId):
    try:
        listing = Listing.query.filter_by(id=listingId).first()

        if not listing:
            return make_response(jsonify({"message": "Listing couldn't be found"}), 404)

        db.session.delete(listing)
        db.session.commit()
        return make_response(
            jsonify({"message": "successfully deleted"}),
            200,
            {"Content-Type": "application/json"},
        )
    except Exception as e:
        # if there's error, rollback the database change
        db.session.rollback()
        return make_response(
            jsonify({"message": str(e)}), 500, {"Content-Type": "application/json"}
        )
