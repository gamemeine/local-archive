from testcontainers.postgres import PostgresContainer
from db.models import Base
import sqlalchemy


def test_check_if_all_tables_are_present_in_DB():
    with PostgresContainer("postgres:13", driver=None) as postgres:
        psql_url = postgres.get_connection_url()
        engine = sqlalchemy.create_engine(psql_url)
        Base.metadata.create_all(engine)
        expected_tables = {
            "users",
            "material",
            "photo",
            "comment",
            "comment_photo",
            "reaction",
            "access_request",
            "audit_log",
            "report",
            "report_photo",
            "revision",
            "material_search_index",
            "user_metadata",
            "predefined_metadata",
            "locations",
            "creation_dates",
            "photo_contents",
        }
        inspector = sqlalchemy.inspect(engine)
        all_table_names_in_db = inspector.get_table_names()
        assert expected_tables.issubset(all_table_names_in_db)
