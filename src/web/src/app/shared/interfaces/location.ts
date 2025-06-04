// /src/web/src/app/shared/intefaces/location.ts

import { Coordinates } from './coordinates';

export interface Location {
  coordinates: Coordinates;
  city: string;
  country: string;
  postal_code: string;
  region: string;
  street: string;
}
