# /src/api/tests/test_db_model.py
# Test to check if all expected tables are present in the database.

from testcontainers.postgres import PostgresContainer
from app.services.db import Base
import sqlalchemy

def test_check_if_all_tables_are_present_in_DB():
    with PostgresContainer("postgres:13", driver=None) as postgres:
        psql_url = postgres.get_connection_url()
        engine = sqlalchemy.create_engine(psql_url)
        Base.metadata.create_all(engine)
        expected_tables = {
            "users",
            "media",
            "photo",
            "comment",
            "comment_photo",
            "reaction",
            "access_request",
            "audit_log",
            "report",
            "report_photo",
            "revision",
            "user_metadata",
            "predefined_metadata",
            "locations",
            "creation_dates",
            "photo_contents",
        }
        inspector = sqlalchemy.inspect(engine)
        all_table_names_in_db = inspector.get_table_names()
        assert expected_tables.issubset(all_table_names_in_db)