from flask import Blueprint, request, make_response, jsonify
from flask_login import login_required
from app.models import Transaction, Listing, User, Offer, Instrument, Company, db
from datetime import datetime
import pytz

transaction_routes = Blueprint("transactions", __name__)


@transaction_routes.route("/companies/<int:company_id>", methods=["GET"])
@login_required
def get_company_transactions(company_id):
    try:
        transactions = (
            db.session.query(Transaction, Offer, Listing, Instrument, Company)
            .join(Offer, Offer.id == Transaction.offer_id)
            .join(Listing, Listing.id == Transaction.listing_id)
            .join(Instrument, Instrument.id == Transaction.instrument_id)
            .join(Company, Company.id == Instrument.company_id)
            .filter(Instrument.company_id == company_id)
            .order_by(Transaction.created_at_et.desc())
            .all()
        )

        if not transactions:
            return make_response(
                jsonify(
                    {
                        "pending_transactions": [],
                        "non_pending_transactions": [],
                    }
                ),
                200,
                {"Content-Type": "application/json"},
            )

        pending_transactions = []
        non_pending_transactions = []
        for transaction, offer, listing, instrument, company in transactions:
            offer_user = User.query.get(offer.offer_user_id)
            listing_user = User.query.get(listing.listing_user_id)

            transaction_data = {
                "id": transaction.id,
                "instrument_id": transaction.instrument_id,
                "offer_id": transaction.offer_id,
                "listing_id": transaction.listing_id,
                "status": transaction.status,
                "transaction_price": transaction.transaction_price,
                "transaction_quantity": transaction.transaction_quantity,
                "settled_on_et": transaction.settled_on_et,
                "transaction_fee": transaction.transaction_fee,
                "created_at_et": transaction.created_at_et,
                "updated_at_et": transaction.updated_at_et,
                "offer_user_id": offer.offer_user_id,
                "offer_user_first_name": offer_user.first_name,
                "offer_user_last_name": offer_user.last_name,
                "offer_user_email": offer_user.email,
                "listing_user_id": listing.listing_user_id,
                "listing_user_first_name": listing_user.first_name,
                "listing_user_last_name": listing_user.last_name,
                "listing_user_email": listing_user.email,
                "instrument_name": instrument.instrument_name,
                "company_name": company.company_name,
            }

            if transaction.status.lower() == "pending":
                pending_transactions.append(transaction_data)
            else:
                non_pending_transactions.append(transaction_data)

        return make_response(
            jsonify(
                {
                    "pending_transactions": pending_transactions,
                    "non_pending_transactions": non_pending_transactions,
                }
            ),
            200,
            {"Content-Type": "application/json"},
        )

    except Exception as e:
        return make_response(
            jsonify({"message": str(e)}), 500, {"Content-Type": "application/json"}
        )


@transaction_routes.route("/users/<int:user_id>", methods=["GET"])
@login_required
def get_user_transactions(user_id):
    try:
        transactions = (
            db.session.query(Transaction, Instrument, Company, Offer, Listing)
            .join(Offer, Offer.id == Transaction.offer_id)
            .join(Listing, Listing.id == Transaction.listing_id)
            .join(Instrument, Instrument.id == Transaction.instrument_id)
            .join(Company, Company.id == Instrument.company_id)
            .filter(
                (Offer.offer_user_id == user_id) | (Listing.listing_user_id == user_id)
            )
            .order_by(Transaction.created_at_et.desc())
            .all()
        )

        if not transactions:
            return make_response(
                jsonify({"transactions": []}),
                200,
                {"Content-Type": "application/json"},
            )

        transaction_list = []
        for transaction, instrument, company, offer, listing in transactions:
            position = "Buy" if offer.offer_user_id == user_id else "Sell"
            transaction_data = {
                "id": transaction.id,
                "instrument_id": transaction.instrument_id,
                "offer_id": transaction.offer_id,
                "listing_id": transaction.listing_id,
                "status": transaction.status,
                "transaction_price": transaction.transaction_price,
                "transaction_quantity": transaction.transaction_quantity,
                "settled_on_et": transaction.settled_on_et,
                "transaction_fee": transaction.transaction_fee,
                "created_at_et": transaction.created_at_et,
                "updated_at_et": transaction.updated_at_et,
                "instrument_name": instrument.instrument_name,
                "company_name": company.company_name,
                "position": position,
            }
            transaction_list.append(transaction_data)

        return make_response(
            jsonify({"transactions": transaction_list}),
            200,
            {"Content-Type": "application/json"},
        )

    except Exception as e:
        return make_response(
            jsonify({"message": str(e)}), 500, {"Content-Type": "application/json"}
        )


@transaction_routes.route("/listings/<int:listing_id>", methods=["GET"])
@login_required
def check_pending_transactions_by_listing(listing_id):
    try:
        pending_transaction_exists = (
            db.session.query(Transaction)
            .filter(
                Transaction.listing_id == listing_id, Transaction.status == "Pending"
            )
            .first()
            is not None
        )

        return make_response(
            jsonify({"Message": pending_transaction_exists}),
            200,
            {"Content-Type": "application/json"},
        )

    except Exception as e:
        return make_response(
            jsonify({"message": str(e)}), 500, {"Content-Type": "application/json"}
        )


@transaction_routes.route("/offers/<int:offer_id>", methods=["GET"])
@login_required
def check_pending_transactions_by_offer(offer_id):
    try:
        pending_transaction_exists = (
            db.session.query(Transaction)
            .filter(Transaction.offer_id == offer_id, Transaction.status == "Pending")
            .first()
            is not None
        )

        return make_response(
            jsonify({"Message": pending_transaction_exists}),
            200,
            {"Content-Type": "application/json"},
        )

    except Exception as e:
        return make_response(
            jsonify({"message": str(e)}), 500, {"Content-Type": "application/json"}
        )


@transaction_routes.route("/<int:transaction_id>", methods=["GET"])
@login_required
def get_transaction_by_id(transaction_id):
    try:
        transaction = (
            db.session.query(Transaction, Instrument, Company, Offer, Listing)
            .join(Offer, Offer.id == Transaction.offer_id)
            .join(Listing, Listing.id == Transaction.listing_id)
            .join(Instrument, Instrument.id == Transaction.instrument_id)
            .join(Company, Company.id == Instrument.company_id)
            .filter(Transaction.id == transaction_id)
            .first()
        )

        if not transaction:
            return make_response(
                jsonify({"message": "Transaction couldn't be found"}),
                404,
                {"Content-Type": "application/json"},
            )

        transaction, instrument, company, offer, listing = transaction

        offer_user = User.query.get(offer.offer_user_id)
        listing_user = User.query.get(listing.listing_user_id)

        transaction_data = {
            "id": transaction.id,
            "instrument_id": transaction.instrument_id,
            "instrument_name": instrument.instrument_name,
            "company_name": company.company_name,
            "offer_id": transaction.offer_id,
            "listing_id": transaction.listing_id,
            "status": transaction.status,
            "transaction_price": transaction.transaction_price,
            "transaction_quantity": transaction.transaction_quantity,
            "settled_on_et": transaction.settled_on_et,
            "transaction_fee": transaction.transaction_fee,
            "created_at_et": transaction.created_at_et,
            "updated_at_et": transaction.updated_at_et,
            "offer_user_id": offer.offer_user_id,
            "offer_user_first_name": offer_user.first_name,
            "offer_user_last_name": offer_user.last_name,
            "offer_user_email": offer_user.email,
            "listing_user_id": listing.listing_user_id,
            "listing_user_first_name": listing_user.first_name,
            "listing_user_last_name": listing_user.last_name,
            "listing_user_email": listing_user.email,
        }

        return make_response(
            jsonify(transaction_data), 200, {"Content-Type": "application/json"}
        )

    except Exception as e:
        return make_response(
            jsonify({"message": str(e)}), 500, {"Content-Type": "application/json"}
        )


@transaction_routes.route("/", methods=["POST"])
@login_required
def add_transaction():
    try:
        data = request.get_json()
        instrument_id = data.get("instrument_id")
        offer_id = data.get("offer_id")
        listing_id = data.get("listing_id")
        transaction_price = data.get("transaction_price")
        transaction_quantity = data.get("transaction_quantity")

        transaction_fee = transaction_price * transaction_quantity * 0.05
        total_value_offer_side = transaction_price * transaction_quantity * 1.025
        total_value_listing_side = transaction_price * transaction_quantity * 0.025

        offer_record = Offer.query.filter_by(id=offer_id).first()
        listing_record = Listing.query.filter_by(id=listing_id).first()
        offer_user = User.query.filter_by(id=offer_record.offer_user_id).first()
        listing_user = User.query.filter_by(id=listing_record.listing_user_id).first()

        if (
            not offer_user.user_available_balance
        ) or offer_user.user_available_balance < total_value_offer_side:
            return make_response(
                jsonify(
                    {
                        "message": "Failed to process: Owner of this offer record doesn't have sufficient fund in account"
                    }
                ),
                403,
            )

        if (
            not listing_user.user_available_balance
        ) or listing_user.user_available_balance < total_value_listing_side:
            return make_response(
                jsonify(
                    {
                        "message": "Failed to process: Owner of this listing record doesn't have sufficient fund in account"
                    }
                ),
                403,
            )
        # 1. create transaction record
        new_transaction = Transaction(
            instrument_id=instrument_id,
            offer_id=offer_id,
            listing_id=listing_id,
            transaction_price=transaction_price,
            transaction_quantity=transaction_quantity,
            status="Pending",
            transaction_fee=transaction_fee,
            created_at_et=datetime.utcnow(),
            updated_at_et=datetime.utcnow(),
        )

        db.session.add(new_transaction)

        # 2. update user balance
        offer_user.amount_to_be_debited = (
            offer_user.amount_to_be_debited + total_value_offer_side
        )
        offer_user.user_available_balance = (
            offer_user.user_cash_balance
            - offer_user.amount_to_be_debited
            + offer_user.amount_to_be_credited
        )
        listing_user.amount_to_be_debited = (
            listing_user.amount_to_be_debited + total_value_listing_side
        )
        listing_user.amount_to_be_credited = (
            listing_user.amount_to_be_credited
            + transaction_price * transaction_quantity
        )
        listing_user.user_available_balance = (
            listing_user.user_cash_balance
            - listing_user.amount_to_be_debited
            + listing_user.amount_to_be_credited
        )

        # 3. update remaining quantity in Offer and Listing
        offer_record.remaining_quantity = (
            offer_record.remaining_quantity - transaction_quantity
        )
        if offer_record.remaining_quantity == 0:
            offer_record.status = "Filled"
        else:
            offer_record = "Partially Filled"
        listing_record.remaining_quantity = (
            listing_record.remaining_quantity - transaction_quantity
        )
        if listing_record.remaining_quantity == 0:
            listing_record.status = "Filled"
        else:
            listing_record.status = "Partially Filled"

        db.session.commit()

        transaction_data = {
            "id": new_transaction.id,
            "instrument_id": new_transaction.instrument_id,
            "offer_id": new_transaction.offer_id,
            "listing_id": new_transaction.listing_id,
            "status": new_transaction.status,
            "transaction_price": new_transaction.transaction_price,
            "transaction_quantity": new_transaction.transaction_quantity,
            "settled_on_et": new_transaction.settled_on_et,
            "transaction_fee": new_transaction.transaction_fee,
            "created_at_et": new_transaction.created_at_et,
            "updated_at_et": new_transaction.updated_at_et,
        }

        return make_response(
            jsonify(transaction_data), 201, {"Content-Type": "application/json"}
        )

    except Exception as e:
        db.session.rollback()
        return make_response(
            jsonify({"message": str(e)}), 500, {"Content-Type": "application/json"}
        )


@transaction_routes.route("/<int:transaction_id>", methods=["PATCH"])
@login_required
def update_transaction(transaction_id):
    try:
        transaction = Transaction.query.filter_by(id=transaction_id).first()
        offer_record = Offer.query.filter_by(id=transaction.offer_id).first()
        listing_record = Listing.query.filter_by(id=transaction.listing_id).first()
        offer_user = User.query.filter_by(id=offer_record.offer_user_id).first()
        listing_user = User.query.filter_by(id=listing_record.listing_user_id).first()

        if not transaction:
            return make_response(
                jsonify({"message": "Transaction couldn't be found"}),
                404,
                {"Content-Type": "application/json"},
            )

        data = request.get_json()
        is_approved = data.get("approve")
        print("===============")
        print(is_approved)
        print(type(is_approved))
        if is_approved:
            new_status = "Completed"
        else:
            new_status = "Rejected"

        # 1. update transaction status
        eastern = pytz.timezone("America/New_York")
        current_time_et = datetime.now(eastern)
        transaction.status = new_status
        transaction.updated_at_et = current_time_et
        transaction.settled_on_et = current_time_et.date()

        # 2. update user cash balances
        offer_debit = (
            transaction.transaction_price * transaction.transaction_quantity * 1.025
        )
        listing_debit = (
            transaction.transaction_price * transaction.transaction_quantity * 0.025
        )
        listing_credit = (
            transaction.transaction_price * transaction.transaction_quantity
        )
        if is_approved:
            offer_user.user_cash_balance = offer_user.user_cash_balance - offer_debit
            listing_user.user_cash_balance = (
                listing_user.user_cash_balance + listing_credit - listing_credit
            )
        # for both scenarios, rebalance is needed
        offer_user.amount_to_be_debited = offer_user.amount_to_be_debited - offer_debit
        offer_user.user_available_balance = (
            offer_user.user_cash_balance
            + offer_user.amount_to_be_credited
            - offer_user.amount_to_be_debited
        )
        listing_user.amount_to_be_credited = (
            listing_user.amount_to_be_credited - listing_credit
        )
        listing_user.amount_to_be_debited = (
            listing_user.amount_to_be_debited - listing_debit
        )
        listing_user.user_available_balance = (
            listing_user.user_cash_balance
            + listing_user.amount_to_be_credited
            - listing_user.amount_to_be_debited
        )

        # 3. update remaining quantity and status in the offer and listing record when rejected
        if not is_approved:
            offer_record.remaining_quantity = (
                offer_record.remaining_quantity + transaction.transaction_quantity
            )
            if offer_record.remaining_quantity == offer_record.initial_quantity:
                offer_record.status = "Not Filled"
            else:
                offer_record.status = "Partially Filled"
            listing_record.remaining_quantity = (
                listing_record.remaining_quantity + transaction.transaction_quantity
            )
            if listing_record.remaining_quantity == listing_record.initial_quantity:
                listing_record.status = "Not Filled"
            else:
                listing_record.status = "Partially Filled"

        db.session.commit()

        transaction_data = {
            "id": transaction.id,
            "instrument_id": transaction.instrument_id,
            "offer_id": transaction.offer_id,
            "listing_id": transaction.listing_id,
            "status": transaction.status,
            "transaction_price": transaction.transaction_price,
            "transaction_quantity": transaction.transaction_quantity,
            "settled_on_et": transaction.settled_on_et.strftime("%Y-%m-%d")
            if transaction.settled_on_et
            else None,
            "transaction_fee": transaction.transaction_fee,
            "created_at_et": transaction.created_at_et,
            "updated_at_et": transaction.updated_at_et,
        }

        return make_response(
            jsonify(transaction_data), 201, {"Content-Type": "application/json"}
        )

    except Exception as e:
        db.session.rollback()
        return make_response(
            jsonify({"message": str(e)}), 500, {"Content-Type": "application/json"}
        )


@transaction_routes.route("/<int:transactionId>", methods=["DELETE"])
@login_required
def delete_a_transaction(transactionId):
    try:
        transaction = Transaction.query.filter_by(id=transactionId).first()
        offer_record = Offer.query.filter_by(id=transaction.offer_id).first()
        listing_record = Listing.query.filter_by(id=transaction.listing_id).first()
        offer_user = User.query.filter_by(id=offer_record.offer_user_id).first()
        listing_user = User.query.filter_by(id=listing_record.listing_user_id).first()

        if not transaction:
            return make_response(
                jsonify({"message": "Transaction couldn't be found"}), 404
            )

        # 1. update transaction status
        transaction.status = "Cancelled"

        # 2. update offer & listing remaining quantity and status
        offer_record.remaining_quantity = (
            offer_record.remaining_quantity + transaction.transaction_quantity
        )
        if offer_record.remaining_quantity == offer_record.initial_quantity:
            offer_record.status = "Not Filled"
        else:
            offer_record.status = "Partially Filled"
        listing_record.remaining_quantity = (
            listing_record.remaining_quantity + transaction.transaction_quantity
        )
        if listing_record.remaining_quantity == listing_record.initial_quantity:
            listing_record.status = "Not Filled"
        else:
            listing_record.status = "Partially Filled"

        # 3. update user available balances
        offer_user.amount_to_be_debited = (
            offer_user.amount_to_be_debited
            - transaction.transaction_price * transaction.transaction_quantity
            - transaction.transaction_fee / 2
        )
        offer_user.user_available_balance = (
            offer_user.user_cash_balance
            - offer_user.amount_to_be_debited
            + offer_user.amount_to_be_credited
        )
        listing_user.amount_to_be_debited = (
            listing_user.amount_to_be_debited - transaction.transaction_fee / 2
        )
        listing_user.amount_to_be_credited = (
            listing_user.amount_to_be_credited
            - transaction.transaction_price * transaction.transaction_quantity
        )
        listing_user.user_available_balance = (
            listing_user.user_cash_balance
            - listing_user.amount_to_be_debited
            + listing_user.amount_to_be_credited
        )

        db.session.commit()
        return make_response(
            jsonify({"success": "successfully cancelled"}),
            200,
            {"Content-Type": "application/json"},
        )
    except Exception as e:
        # if there's error, rollback the database change
        db.session.rollback()
        return make_response(
            jsonify({"message": str(e)}), 500, {"Content-Type": "application/json"}
        )
