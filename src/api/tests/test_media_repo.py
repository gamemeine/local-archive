import pytest
from fastapi import UploadFile
import io
from app.repository.media_repository import save_file


@pytest.mark.asyncio
async def test_save_file(tmp_path):
    content = b"some fake img content"
    fake_file = UploadFile(filename="test.jpg", file=io.BytesIO(content))

    destination_path = tmp_path / "test.jpg"

    await save_file(fake_file, destination_path.as_posix())

    assert destination_path.exists()
    with open(destination_path, "rb") as f:
        saved_content = f.read()
        assert saved_content == content
