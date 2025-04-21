from sqlalchemy import (Column, Integer, String, Text,
                        DateTime, Boolean, ForeignKey, Float, DECIMAL)
from sqlalchemy.orm import declarative_base, relationship
from datetime import datetime

Base = declarative_base()


class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    email = Column(String(255), nullable=False)
    first_name = Column(String(100))
    last_name = Column(String(100))
    display_name = Column(String(150))
    role = Column(String(50), nullable=False)
    status = Column(String(50), default='active')
    auth_provider = Column(String(100))
    profile_picture_url = Column(String(255))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow,
                        onupdate=datetime.utcnow)


class Media(Base):
    __tablename__ = 'media'

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    title = Column(String(255))
    description = Column(Text)
    privacy = Column(String(50), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow,
                        onupdate=datetime.utcnow)

    photo = relationship("Photo", back_populates="media", uselist=False)


class Photo(Base):
    __tablename__ = 'photo'

    id = Column(Integer, primary_key=True, autoincrement=True)
    media_id = Column(Integer, ForeignKey('media.id'))
    file_url = Column(String(255), nullable=False)
    thumbnail_url = Column(String(255), nullable=False)
    storage_provider = Column(String(100))
    file_size = Column(Integer)
    uploaded_at = Column(DateTime, default=datetime.utcnow)

    media = relationship("Media", back_populates="photo")


class Comment(Base):
    __tablename__ = 'comment'

    id = Column(Integer, primary_key=True, autoincrement=True)
    media_id = Column(Integer, ForeignKey('media.id'))
    user_id = Column(Integer, ForeignKey('users.id'))
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class CommentPhoto(Base):
    __tablename__ = 'comment_photo'

    comment_id = Column(Integer, ForeignKey('comment.id'), primary_key=True)
    photo_id = Column(Integer, ForeignKey('photo.id'), primary_key=True)


class Reaction(Base):
    __tablename__ = 'reaction'

    id = Column(Integer, primary_key=True, autoincrement=True)
    media_id = Column(Integer, ForeignKey('media.id'))
    user_id = Column(Integer, ForeignKey('users.id'))
    type = Column(String(20))
    created_at = Column(DateTime, default=datetime.utcnow)


class AccessRequest(Base):
    __tablename__ = 'access_request'

    id = Column(Integer, primary_key=True, autoincrement=True)
    media_id = Column(Integer, ForeignKey('media.id'))
    requester_id = Column(Integer, ForeignKey('users.id'))
    justification = Column(Text)
    status = Column(String(50))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow,
                        onupdate=datetime.utcnow)


class AuditLog(Base):
    __tablename__ = 'audit_log'

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=True)
    action_type = Column(String(100))
    entity = Column(String(100))
    entity_id = Column(Integer)
    description = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)


class Report(Base):
    __tablename__ = 'report'

    id = Column(Integer, primary_key=True, autoincrement=True)
    reporter_id = Column(Integer, ForeignKey('users.id'))
    media_id = Column(Integer, ForeignKey('media.id'))
    description = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    resolved = Column(Boolean, default=False)
    resolution = Column(Text)
    resolved_at = Column(DateTime)


class ReportPhoto(Base):
    __tablename__ = 'report_photo'

    report_id = Column(Integer, ForeignKey('report.id'), primary_key=True)
    photo_id = Column(Integer, ForeignKey('photo.id'), primary_key=True)


class Revision(Base):
    __tablename__ = 'revision'

    id = Column(Integer, primary_key=True, autoincrement=True)
    media_id = Column(Integer, ForeignKey('media.id'))
    changed_by = Column(Integer, ForeignKey('users.id'))
    change_type = Column(String(50))
    change_date = Column(DateTime, default=datetime.utcnow)
    change_details = Column(Text)


class UserMetadata(Base):
    __tablename__ = 'user_metadata'

    id = Column(Integer, primary_key=True, autoincrement=True)
    media_id = Column(Integer, ForeignKey('media.id'))
    key = Column(String(100))
    value = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)


class PredefinedMetadata(Base):
    __tablename__ = 'predefined_metadata'

    id = Column(Integer, primary_key=True, autoincrement=True)
    media_id = Column(Integer, ForeignKey('media.id'))
    metadata_type = Column(String(50))
    created_at = Column(DateTime, default=datetime.utcnow)


class Location(Base):
    __tablename__ = 'locations'

    metadata_id = Column(Integer, ForeignKey(
        'predefined_metadata.id'), primary_key=True)
    street = Column(String(255))
    city = Column(String(100))
    region = Column(String(100))
    postal_code = Column(String(20))
    country = Column(String(100))
    latitude = Column(DECIMAL(10, 7))
    longitude = Column(DECIMAL(10, 7))
    radius = Column(Float)
    orientation = Column(String(50))


class CreationDate(Base):
    __tablename__ = 'creation_dates'

    metadata_id = Column(Integer, ForeignKey(
        'predefined_metadata.id'), primary_key=True)
    date_from = Column(DateTime)
    date_to = Column(DateTime)


class PhotoContent(Base):
    __tablename__ = 'photo_contents'

    id = Column(Integer, primary_key=True, autoincrement=True)
    metadata_id = Column(Integer, ForeignKey('predefined_metadata.id'))
    value = Column(Text)
