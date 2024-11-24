from sqlalchemy.sql import text
from app.models import SCHEMA, Document, db, environment
from .seeding_data import documents
from datetime import datetime

def seed_documents():
    for document in documents:
        new_document = Document(
            listing_id=document['listing_id'],
            offer_id=document['offer_id'],
            user_id=document['user_id'],
            doc_url =document['dpc_url'],
        )
        db.session.add(new_document)
    db.session.commit()

def undo_documents():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.documents RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM documents"))

    db.session.commit()
