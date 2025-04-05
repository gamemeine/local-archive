from sqlalchemy import create_engine, inspect, text
import os

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost:5432/mydatabase")


def test_database_connection():
    engine = create_engine(DATABASE_URL)
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1;"))
        assert result.scalar() == 1


def test_tables_exist():
    expected_tables = {
        "users", "material", "photo", "comment", "comment_photo",
        "reaction", "access_request", "audit_log", "report",
        "report_photo", "revision", "material_search_index",
        "user_metadata", "predefined_metadata", "locations",
        "creation_dates", "photo_contents"
    }

    engine = create_engine(DATABASE_URL)
    inspector = inspect(engine)
    actual_tables = set(inspector.get_table_names())

    missing = expected_tables - actual_tables
    assert not missing, f"Brakuje tabel: {missing}"
