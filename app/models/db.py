from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import pytz

import os

environment = os.getenv("FLASK_ENV")
SCHEMA = os.environ.get("SCHEMA")

db = SQLAlchemy()


# helper function for adding prefix to foreign key column references in production
def add_prefix_for_prod(attr):
    if environment == "production":
        return f"{SCHEMA}.{attr}"
    else:
        return attr


# helper function to get the current time stamp based on New York ( Eastern ) Timezone
def current_eastern_time():
    tz = pytz.timezone("America/New_York")
    return datetime.now(tz)
