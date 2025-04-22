from .models import SearchLocation, YearRange


def get_query(
    location: SearchLocation,
    phrase: str | None = None,
    creation_date: YearRange | None = None,
    page: int = 0,
    size: int = 10,
) -> dict:
    assert location, "Location must be provided"

    filters = [
        {
            "geo_bounding_box": {
                "location.coordinates": {
                    "top_left": {"lat": location.top_left.lat, "lon": location.top_left.lon},
                    "bottom_right": {"lat": location.bottom_right.lat, "lon": location.bottom_right.lon}
                }
            }
        }
    ]

    if creation_date:
        range_intersect_with_range = {
            "bool": {
                "filter": [
                    {"range": {"creation_date.year_range.year_from": {"lte": creation_date.year_to}}},
                    {"range": {"creation_date.year_range.year_to": {"gte": creation_date.year_from}}}
                ]
            }
        }

        year_within_range = {
            "range": {"creation_date.year": {"gte": creation_date.year_from, "lte": creation_date.year_to}}
        }

        filters.append({
            "bool": {
                "should": [range_intersect_with_range, year_within_range],
                "minimum_should_match": 1
            }
        })

    musts = []
    if phrase:
        musts.append({"match": {"title": phrase}})
    else:
        musts.append({"match_all": {}})

    return {
        "query": {
            "bool": {
                "must": musts,
                "filter": filters
            }
        },
        "from": page * size,
        "size": size,
        "sort": [
            {"_score": {"order": "desc"}}
        ]
    }
