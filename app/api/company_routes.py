from flask import Blueprint, request, make_response, jsonify
from flask_login import login_required, current_user
# from app.api.aws import get_unique_filename, upload_file_to_s3
from app.models import Company, Instrument, db
from datetime import datetime

company_routes = Blueprint("companies", __name__)

@company_routes.route("/<int:companyId>", methods=["GET"] )
@login_required
def get_an_company(companyId):
    try:
        company = Company.query.get(companyId)
        if not company:
            return make_response(jsonify({"message": "Company couldn't be found"}), 404)

        instruments = Instrument.query.filter_by(company_id=companyId).all()
        instruments_list = [
            {
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
            }
            for instrument in instruments
        ]

        response_body = {
            "id": company.id,
            "company_name": company.company_name,
            "short_description": company.short_description,
            "ai_prompt": company.ai_prompt,
            "founded_year": company.founded_year,
            "api_identifier": company.api_identifier,
            "location_identifiers": company.location_identifiers,
            "categories": company.categories,
            "num_employees_enum": company.num_employees_enum,
            "revenue_range": company.revenue_range,
            "operating_status": company.operating_status,
            "website_url": company.website_url,
            "logo_url": company.logo_url,
            "investors": company.investors,
            "created_at_et": company.created_at_et,
            "updated_at_et": company.updated_at_et,
            "instruments": instruments_list,
        }

        return make_response(jsonify(response_body), 200)
    except Exception as e :
        return make_response(jsonify({"message": str(e)}), 500, {"Content-Type": "application/json"})
    
    
@company_routes.route("/", methods=["POST"])
@login_required
def add_an_company():
    try:
        data = request.get_json()
        print(data.get("company_name"))
        # Extract data from request body
        company_name = data.get("company_name")
        short_description = data.get("short_description", "")
        ai_prompt = data.get("ai_prompt", "")
        founded_year = data.get("founded_year",None)
        api_identifier = data.get("api_identifier", "")
        location_identifiers = data.get("location_identifiers", "")
        categories = data.get("categories", "")
        num_employees_enum = data.get("num_employees_enum", "")
        revenue_range = data.get("revenue_range", "")
        operating_status = data.get("operating_status", "")
        website_url = data.get("website_url", "")
        logo_url = data.get("logo_url", "")
        investors = data.get("investors", "")

        # Validate required fields
        if company_name is None:
            return make_response(jsonify({"message": "Company name is required."}), 400)

        # Create new company instance
        new_company = Company(
            company_name=company_name,
            short_description=short_description,
            ai_prompt=ai_prompt,
            founded_year=founded_year,
            api_identifier=api_identifier,
            location_identifiers=location_identifiers,
            categories=categories,
            num_employees_enum=num_employees_enum,
            revenue_range=revenue_range,
            operating_status=operating_status,
            website_url=website_url,
            logo_url=logo_url,
            investors=investors,
            created_at_et=datetime.utcnow(),
            updated_at_et=datetime.utcnow()
        )

        # Add and commit to the database
        db.session.add(new_company)
        db.session.commit()

        # Prepare response body
        response_body = {
            "id": new_company.id,
            "company_name": new_company.company_name,
            "short_description": new_company.short_description,
            "ai_prompt": new_company.ai_prompt,
            "founded_year": new_company.founded_year,
            "api_identifier": new_company.api_identifier,
            "location_identifiers": new_company.location_identifiers,
            "categories": new_company.categories,
            "num_employees_enum": new_company.num_employees_enum,
            "revenue_range": new_company.revenue_range,
            "operating_status": new_company.operating_status,
            "website_url": new_company.website_url,
            "logo_url": new_company.logo_url,
            "investors": new_company.investors,
            "created_at_et": new_company.created_at_et,
            "updated_at_et": new_company.updated_at_et
        }

        return make_response(jsonify(response_body), 201)
    except Exception as e :
        # if there's error, rollback the database change
        db.session.rollback()
        return make_response(jsonify({"message": str(e)}), 500, {"Content-Type": "application/json"})
    


@company_routes.route("/<int:companyId>", methods=["PATCH"])
@login_required
def update_an_company(companyId):
    try:
        data = request.get_json()

        # Find the company by ID
        company = Company.query.filter_by(id=companyId).first()

        # Return an error if the company does not exist
        if not company:
            return make_response(jsonify({"message": "Company couldn't be found"}), 404)

        # Update company fields if provided in the request body
        company.company_name = data.get("company_name", company.company_name)
        company.short_description = data.get("short_description", company.short_description)
        company.ai_prompt = data.get("ai_prompt", company.ai_prompt)
        company.founded_year = data.get("founded_year", company.founded_year)
        company.api_identifier = data.get("api_identifier", company.api_identifier)
        company.location_identifiers = data.get("location_identifiers", company.location_identifiers)
        company.categories = data.get("categories", company.categories)
        company.num_employees_enum = data.get("num_employees_enum", company.num_employees_enum)
        company.revenue_range = data.get("revenue_range", company.revenue_range)
        company.operating_status = data.get("operating_status", company.operating_status)
        company.website_url = data.get("website_url", company.website_url)
        company.logo_url = data.get("logo_url", company.logo_url)
        company.investors = data.get("investors", company.investors)

        # Update the updated_at_et timestamp
        company.updated_at_et = datetime.utcnow()

        # Commit changes to the database
        db.session.commit()

        # Prepare response body
        response_body = {
            "company_id": company.id,
            "company_name": company.company_name,
            "short_description": company.short_description,
            "ai_prompt": company.ai_prompt,
            "founded_year": company.founded_year,
            "api_identifier": company.api_identifier,
            "location_identifiers": company.location_identifiers,
            "categories": company.categories,
            "num_employees_enum": company.num_employees_enum,
            "revenue_range": company.revenue_range,
            "operating_status": company.operating_status,
            "website_url": company.website_url,
            "logo_url": company.logo_url,
            "investors": company.investors,
        }

        return make_response(jsonify(response_body), 201)
    except Exception as e :
        # if there's error, rollback the database change
        db.session.rollback()
        return make_response(jsonify({"message": str(e)}), 500, {"Content-Type": "application/json"})
    
@company_routes.route("/<int:companyId>", methods=["DELETE"])
@login_required
def delete_an_company(companyId):
    try:
        data = request.get_json()
        company = Company.query.filter_by(id=companyId).first()
        
        if not company:
            return make_response(jsonify({"message": "Company couldn't be found"}), 404)
        
        db.session.delete(company)
        db.session.commit()
        return make_response(jsonify({"message": "successfully deleted"}), 200, {"Content-Type": "application/json"})
    except Exception as e :
        # if there's error, rollback the database change
        db.session.rollback()
        return make_response(jsonify({"message": str(e)}), 500, {"Content-Type": "application/json"})