import pytest
from db.db import get_database


@pytest.mark.asyncio
async def test_database_connection_works():
    database = get_database()
    await database.connect()

    result = await database.fetch_one("SELECT 1")
    await database.disconnect()

    assert result[0] == 1
