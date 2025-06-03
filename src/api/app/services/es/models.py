# /src/api/app/services/es/models.py
# Pydantic models for Elasticsearch queries and documents.

from pydantic import BaseModel, model_validator


class Coordinates(BaseModel):
    lon: float
    lat: float


class Location(BaseModel):
    coordinates: Coordinates


class YearRange(BaseModel):
    year_from: int
    year_to: int

    @model_validator(mode='after')
    def check_year_range(self):
        if not (self.year_from and self.year_to):
            raise ValueError("Both year_from and year_to must be provided")
        if int(self.year_from) > int(self.year_to):
            raise ValueError("year_from must be less than or equal to year_to")
        return self


class CreationDate(BaseModel):
    year_range: YearRange | None = None
    year: int | None = None
    month: int | None = None
    day: int | None = None

    @model_validator(mode='after')
    def check_date(self):
        if not (self.year_range or self.year):
            raise ValueError("Either year_range or year must be provided")

        if self.year_range and (self.year or self.month or self.day):
            raise ValueError("Cannot provide both year_range and exact date")

        if self.month and (self.month < 1 or self.month > 12):
            raise ValueError("Month must be between 1 and 12")

        if self.day and (self.day < 1 or self.day > 31):
            raise ValueError("Day must be between 1 and 31")

        return self


class Photo(BaseModel):
    id: str
    thumbnail_url: str


class SearchLocation(BaseModel):
    top_left: Coordinates
    bottom_right: Coordinates

    @model_validator(mode='after')
    def check_bounding_box(self):
        if self.top_left.lon > self.bottom_right.lon or self.top_left.lat < self.bottom_right.lat:
            raise ValueError("Invalid bounding box coordinates")
        return self
