// /src/web/src/app/shared/services/address.service.ts
// Service for address-related API calls, including reverse geocoding with Mapbox.

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  constructor(private http: HttpClient) {}

  // Reverse geocode coordinates to an address using Mapbox API
  reverseGeocode(lat: number, lng: number) {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${environment.mapbox.accessToken}`;
    return this.http.get<any>(url);
  }

  getCoordsFromAddress(address: string) {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      address
    )}.json?access_token=${environment.mapbox.accessToken}`;
    return this.http.get<any>(url);
  }
}
