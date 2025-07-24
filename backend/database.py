# backend/database.py
from pymongo import MongoClient

import os

from dotenv import load_dotenv, find_dotenv
load_dotenv(find_dotenv())   # ← this will locate the .env file anywhere above


MONGO_URI = os.getenv("MONGODB_URI")
DB_NAME   = os.getenv("MONGODB_DB")

if not MONGO_URI or not DB_NAME:
    raise RuntimeError(".env must define MONGODB_URI & MONGODB_DB")

_client = MongoClient(MONGO_URI)
db      = _client[DB_NAME]

users_col   = db["users"]
docs_col    = db["documents"]
queries_col = db["queries"]
feedback_col = db["feedback"]
