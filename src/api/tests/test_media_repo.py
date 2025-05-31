from fastapi import UploadFile
import io
from app.repository.media_repository import save_file, delete_file


def test_save_file(tmp_path):
    content = b"some fake img content"
    fake_file = UploadFile(filename="test.jpg", file=io.BytesIO(content))

    destination_path = tmp_path / "test.jpg"

    save_file(fake_file, destination_path.as_posix())

    assert destination_path.exists()
    with open(destination_path, "rb") as f:
        saved_content = f.read()
        assert saved_content == content


def test_delete_file(tmp_path):
    content = b"some fake img content"
    fake_file = UploadFile(filename="test.jpg", file=io.BytesIO(content))

    destination_path = tmp_path / "test.jpg"

    save_file(fake_file, destination_path.as_posix())

    assert destination_path.exists()

    delete_file(destination_path)

    assert not destination_path.exists()
