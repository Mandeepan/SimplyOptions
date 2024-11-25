from flask import Blueprint, request, make_response, jsonify
from flask_login import login_required, current_user
# from app.api.aws import get_unique_filename, upload_file_to_s3
from app.models import Company, User, Instrument,Transaction, Offer, Listing, db
from datetime import datetime

instrument_routes = Blueprint("instruments", __name__)

@instrument_routes.route("/", methods=["GET"] )
@login_required
def get_all_instruments():
    try:
        instruments = (
            db.session.query(Instrument, Company)
            .join(Company, Instrument.company_id == Company.id)
            .all()
        )
        instruments_list = []
        for instrument, company in instruments:
            instruments_list.append({
                "id": instrument.id,
                "instrument_name": instrument.instrument_name,
                "issuer_user_id": instrument.issuer_user_id,
                "issued_on_et": instrument.issued_on_et,
                "instrument_type": instrument.instrument_type,
                "instrument_class": instrument.instrument_class,
                "updated_value": instrument.updated_value,
                "updated_issued_quantity": instrument.updated_issued_quantity,
                "updated_price": instrument.updated_price,
                "created_at_et": instrument.created_at_et,
                "updated_at_et": instrument.updated_at_et,
                "company_id": company.id,
                "company_name": company.company_name,
                "founded_year": company.founded_year,
                "location_identifiers": company.location_identifiers,
                "num_employees_enum": company.num_employees_enum,
                "revenue_range": company.revenue_range,
                "operating_status": company.operating_status,
                "website_url": company.website_url,
                "logo_url": company.logo_url,
            })

        return make_response(jsonify({"instruments": instruments_list}), 200)
    except Exception as e :
        return make_response(jsonify({"message": str(e)}), 500, {"Content-Type": "application/json"})


@instrument_routes.route("/", methods=["POST"])
@login_required
def add_an_instrument():
    try:
        data = request.get_json()
        instrument_name = data.get("instrument_name")
        company_id = data.get("company_id")
        issuer_user_id = data.get("issuer_user_id")
        issued_on_et = data.get("issued_on_et")
        instrument_type = data.get("instrument_type")
        instrument_class = data.get("instrument_class")
        updated_value = data.get("updated_value")
        updated_issued_quantity = data.get("updated_issued_quantity")
        updated_price = data.get("updated_price")

        if not all([instrument_name,company_id, issuer_user_id, issued_on_et, instrument_type, instrument_class, updated_value, updated_issued_quantity, updated_price]):
            return make_response(jsonify({"message": "All fields are required."}), 400)

        try:
            issued_on_et_dt = datetime.strptime(issued_on_et, "%Y-%m-%d").date()
        except ValueError:
            return make_response(jsonify({"message": "Invalid date format for issued_on_et. Use YYYY-MM-DD."}), 400)

        new_instrument = Instrument(
            instrument_name=instrument_name,
            company_id=company_id,
            issuer_user_id=issuer_user_id,
            issued_on_et=issued_on_et_dt,
            instrument_type=instrument_type,
            instrument_class=instrument_class,
            updated_value=updated_value,
            updated_issued_quantity=updated_issued_quantity,
            updated_price=updated_price,
        )

        db.session.add(new_instrument)
        db.session.commit()

        response_body = {
            "id": new_instrument.id,
            "company_id":new_instrument.company_id,
            "instrument_name": new_instrument.instrument_name,
            "issuer_user_id": new_instrument.issuer_user_id,
            "issued_on_et": new_instrument.issued_on_et,
            "instrument_type": new_instrument.instrument_type,
            "instrument_class": new_instrument.instrument_class,
            "updated_value": new_instrument.updated_value,
            "updated_issued_quantity": new_instrument.updated_issued_quantity,
            "updated_price": new_instrument.updated_price,
        }

        return make_response(jsonify(response_body), 201)
    except Exception as e :
        # if there's error, rollback the database change
        db.session.rollback()
        return make_response(jsonify({"message": str(e)}), 500, {"Content-Type": "application/json"})
    


@instrument_routes.route("/<int:instrumentId>", methods=["GET"])
@login_required
def get_an_instrument(instrumentId):
    try:
        instrument = (
            db.session.query(Instrument, Company)
            .join(Company, Instrument.company_id == Company.id)
            .filter(Instrument.id == instrumentId)
            .first()
        )

        if not instrument:
            return make_response(jsonify({"message": "Instrument couldn't be found"}), 404)

        instrument_data, company_data = instrument

        # Get highest bid price from offers
        highest_bid_price = db.session.query(db.func.max(Offer.offered_price)).filter(
            Offer.instrument_id == instrumentId,
            Offer.status != "Filled"
        ).scalar()

        # Get lowest ask price from listings
        lowest_ask_price = db.session.query(db.func.min(Listing.listed_price)).filter(
            Listing.instrument_id == instrumentId,
            Listing.status != "Filled"
        ).scalar()

        # Get last transaction price from transactions with status "Settled"
        last_transaction_price = (
            db.session.query(Transaction.transaction_price)
            .filter(Transaction.instrument_id == instrumentId, Transaction.status == "Completed")
            .order_by(Transaction.settled_on_et.desc())
            .first()
        )

        # Set prices to None if no record found
        highest_bid_price = highest_bid_price if highest_bid_price is not None else None
        lowest_ask_price = lowest_ask_price if lowest_ask_price is not None else None
        last_transaction_price = last_transaction_price[0] if last_transaction_price else None

        # Prepare instrument response body
        response_body = {
            "id": instrument_data.id,
            "instrument_name": instrument_data.instrument_name,
            "issuer_user_id": instrument_data.issuer_user_id,
            "issued_on_et": instrument_data.issued_on_et,
            "instrument_type": instrument_data.instrument_type,
            "instrument_class": instrument_data.instrument_class,
            "updated_value": instrument_data.updated_value,
            "updated_issued_quantity": instrument_data.updated_issued_quantity,
            "updated_price": instrument_data.updated_price,
            "highest_bid_price": highest_bid_price,
            "lowest_ask_price": lowest_ask_price,
            "last_transaction_price": last_transaction_price,
            "company": {
                "company_id": company_data.id,
                "company_name": company_data.company_name,
                "short_description": company_data.short_description,
                "ai_prompt": company_data.ai_prompt,
                "founded_year": company_data.founded_year,
                "api_identifier": company_data.api_identifier,
                "location_identifiers": company_data.location_identifiers,
                "categories": company_data.categories,
                "num_employees_enum": company_data.num_employees_enum,
                "revenue_range": company_data.revenue_range,
                "operating_status": company_data.operating_status,
                "website_url": company_data.website_url,
                "logo_url": company_data.logo_url,
                "investors": company_data.investors,
            },
        }
        return make_response(jsonify(response_body), 200)
    except Exception as e :
        return make_response(jsonify({"message": str(e)}), 500, {"Content-Type": "application/json"})



@instrument_routes.route("/<int:instrumentId>", methods=["PATCH"])
@login_required
def update_an_instrument(instrumentId):
    try:
        data = request.get_json()
        instrument = Instrument.query.filter_by(id=instrumentId).first()
        if not instrument:
            return make_response(jsonify({"message": "Instrument couldn't be found"}), 404)
        # if some of the items are not provided in the request body, default as the original
        instrument.instrument_name = data.get("instrument_name", instrument.instrument_name)
        issued_on_et = data.get("issued_on_et")
        if issued_on_et:
            try:
                instrument.issued_on_et = datetime.strptime(issued_on_et, "%Y-%m-%d").date()
            except ValueError:
                return make_response(jsonify({"message": "Invalid date format for issued_on_et. Use YYYY-MM-DD."}), 400)
        instrument.instrument_type = data.get("instrument_type", instrument.instrument_type)
        instrument.instrument_class = data.get("instrument_class", instrument.instrument_class)
        instrument.updated_value = data.get("updated_value", instrument.updated_value)
        instrument.updated_issued_quantity = data.get("updated_issued_quantity", instrument.updated_issued_quantity)
        instrument.updated_price = data.get("updated_price", instrument.updated_price)

        db.session.commit()

        response_body = {
            "id": instrument.id,
            "instrument_name": instrument.instrument_name,
            "issuer_user_id": instrument.issuer_user_id,
            "issued_on_et": instrument.issued_on_et,
            "instrument_type": instrument.instrument_type,
            "instrument_class": instrument.instrument_class,
            "updated_value": instrument.updated_value,
            "updated_issued_quantity": instrument.updated_issued_quantity,
            "updated_price": instrument.updated_price,
        }

        return make_response(jsonify(response_body), 201)
    except Exception as e :
        # if there's error, rollback the database change
        db.session.rollback()
        return make_response(jsonify({"message": str(e)}), 500, {"Content-Type": "application/json"})


@instrument_routes.route("/<int:instrumentId>", methods=["DELETE"])
@login_required
def delete_an_instrument(instrumentId):
    try:
        data = request.get_json()
        instrument = Instrument.query.filter_by(id=instrumentId).first()
        
        if not instrument:
            return make_response(jsonify({"message": "Instrument couldn't be found"}), 404)
        
        db.session.delete(instrument)
        db.session.commit()
        return make_response(jsonify({"message": "successfully deleted"}), 200, {"Content-Type": "application/json"})
    except Exception as e :
        # if there's error, rollback the database change
        db.session.rollback()
        return make_response(jsonify({"message": str(e)}), 500, {"Content-Type": "application/json"})