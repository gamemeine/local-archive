// /src/web/src/app/shared/services/media.service.ts
// Service for media-related API calls, search, upload, and filtering logic.

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Media } from '../interfaces/media';
import { UsersService } from './users.service';
import { Observable, firstValueFrom, BehaviorSubject, Subject } from 'rxjs';
import { AccessRequest } from '../interfaces/accessRequest';
import { catchError, of } from 'rxjs';

interface UploadMediaRequest {
  title: string;
  description: string;
  privacy: string;
  content: string;
  latitude: number;
  longitude: number;
  creation_date: string;
  images: File[];
  city: string;
  country: string;
  postalCode: string;
  state: string;
  street: string;
}

@Injectable({
  providedIn: 'root',
})
export class MediaServiceService {
  constructor(private http: HttpClient, private userService: UsersService) {}

  // State subjects for search bounds, keywords, filters, and media results
  private currentBoundsSubject = new BehaviorSubject<{
    top_left: { lon: number; lat: number };
    bottom_right: { lon: number; lat: number };
  }>({ top_left: { lon: 0, lat: 90 }, bottom_right: { lon: 90, lat: 0 } });

  private currentKeywordsSubject = new BehaviorSubject<string[]>([]);
  private currentFiltersSubject = new BehaviorSubject<{
    [key: string]: string;
  }>({});

  private currentMediaSubject = new BehaviorSubject<Media[]>([]);
  public currentMedia$ = this.currentMediaSubject.asObservable();

  private radiousMediaSubject = new BehaviorSubject<Media[]>([]);
  public radiousMedia$ = this.radiousMediaSubject.asObservable();

  private searchedCoords = new BehaviorSubject<any>(null);
  public moveToCoords$ = this.searchedCoords.asObservable();

  private currentRadiusSubject = new BehaviorSubject<{
    center: [number, number];
    radious: number;
  } | null>(null);

  public photoUploaded$ = new Subject<void>();

  // Update search bounds and trigger search
  searchBounds(tl_tuple: any, br_tuple: any): Observable<Media[]> {
    console.log('Setting bounds:', tl_tuple, br_tuple);
    this.currentBoundsSubject.next({
      top_left: { lon: tl_tuple.lon, lat: tl_tuple.lat },
      bottom_right: { lon: br_tuple.lon, lat: br_tuple.lat },
    });

    return this.search();
  }

  // Update search filters and trigger search
  searchFilters(
    keywords: string[],
    filters: { [key: string]: string }
  ): Observable<Media[]> {
    this.currentKeywordsSubject.next(keywords);
    this.currentFiltersSubject.next(filters);

    return this.search();
  }

  // Perform search with current state and update observables
  search(): Observable<Media[]> {
    const { top_left, bottom_right } = this.currentBoundsSubject.value;
    const keywords = this.currentKeywordsSubject.value;
    const filters = this.currentFiltersSubject.value;

    const year_from = Math.min(
      Number(filters['from_year']) || 1,
      new Date().getFullYear()
    );
    const year_to = Math.max(
      Number(filters['to_year']) || 1,
      new Date().getFullYear()
    );
    const city = filters['city'];

    // Build request body for backend search
    const body = {
      location: { top_left: top_left, bottom_right: bottom_right },
      phrase: keywords.join(' '),
      creation_date: {
        year_from: year_from,
        year_to: year_to,
      },
      page: 0,
      size: 10,
    };

    console.log('Sending search request with body:', body);

    const request = this.http.post<Media[]>(
      `${environment.apiUrl}/search`,
      body
    );

    request.subscribe((media) => {
      this.currentMediaSubject.next(media);
      console.log('Search results:', media);
      const currentRadius = this.currentRadiusSubject.value;
      if (currentRadius !== null) {
        const { center, radious } = currentRadius;
        this.radiousMediaSubject.next(
          this.getMediaInCircle(media, center, radious)
        );
      } else {
        this.radiousMediaSubject.next(media);
      }
    });
    return request;
  }

  // Filter current media by a circular radius
  filterByRadious(center: [number, number], radiusMeters: number): void {
    this.currentRadiusSubject.next({ center: center, radious: radiusMeters });
    this.radiousMediaSubject.next(
      this.getMediaInCircle(
        this.currentMediaSubject.value,
        center,
        radiusMeters
      )
    );
  }

  // Helper: filter media within a circle
  private getMediaInCircle(
    source: Media[],
    center: [number, number],
    radiusMeters: number
  ): Media[] {
    return source.filter((media) => {
      const coords: [number, number] = [
        media.location.coordinates.lon,
        media.location.coordinates.lat,
      ];
      const distanceKm = this.getDistanceInKm(center, coords);
      return distanceKm * 1000 <= radiusMeters;
    });
  }

  // Helper: calculate distance between two coordinates in km
  private getDistanceInKm(a: [number, number], b: [number, number]): number {
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const [lon1, lat1] = a;
    const [lon2, lat2] = b;
    const R = 6371; // Earth radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const rLat1 = toRad(lat1);
    const rLat2 = toRad(lat2);
    const sinDlat = Math.sin(dLat / 2);
    const sinDlon = Math.sin(dLon / 2);
    const h =
      sinDlat * sinDlat + sinDlon * sinDlon * Math.cos(rLat1) * Math.cos(rLat2);
    return 2 * R * Math.asin(Math.sqrt(h));
  }

  // Upload media with images and metadata
  async uploadMedia(request: UploadMediaRequest): Promise<any> {
    const formData = new FormData();
    request.images.forEach((file) => formData.append('images', file));
    formData.append('title', request.title);
    formData.append('description', request.description);
    formData.append('privacy', request.privacy);
    formData.append('content', request.content);
    formData.append('latitude', request.latitude.toString());
    formData.append('longitude', request.longitude.toString());
    formData.append('creation_date', request.creation_date);
    formData.append('city', request.city);
    formData.append('country', request.country);
    formData.append('postalCode', request.postalCode);
    formData.append('state', request.state);
    formData.append('street', request.street);

    const currentUser = await this.userService.getCurrentUser();
    formData.append('user_id', currentUser!.id);

    const result = await firstValueFrom(
      this.http.post(`${environment.apiUrl}/media/upload`, formData)
    );
    this.photoUploaded$.next();
    return result;
  }

  // Get photos belonging to the current user
  async getMyPhotos(): Promise<Media[]> {
    const currentUser = await this.userService.getCurrentUser();
    console.log('Current User ID:', currentUser!.id);
    return firstValueFrom(
      this.http.get<Media[]>(`${environment.apiUrl}/search/my-photos`, {
        params: { user_id: currentUser!.id },
      })
    );
  }

  // Delete a photo by ID
  async deletePhoto(id: string): Promise<any> {
    return await firstValueFrom(
      this.http.delete(`${environment.apiUrl}/media/delete/${id}`)
    );
  }

  // Change privacy of a photo by ID
  async changePhotoPrivacy(id: string, privacy: string): Promise<any> {
    return await firstValueFrom(
      this.http.patch(`${environment.apiUrl}/media/privacy/${id}`, { privacy })
    );
  }

  // Filter current media by a list of IDs
  filterMediaByIds(ids: string[]): void {
    const filtered = this.currentMediaSubject.value.filter((media: Media) =>
      ids.includes(media.id.toString())
    );
    this.currentMediaSubject.next(filtered);
  }

  getMediaAccessRequests(id: number): Observable<AccessRequest[]> {
    return this.http
      .get<AccessRequest[]>(`${environment.apiUrl}/media/access-request/${id}`)
      .pipe(
        catchError((error) => {
          console.error('Błąd pobierania access requests', error);
          return of([]);
        })
      );
  }

  notifyPhotoUploaded() {
    this.photoUploaded$.next();
  }
} // end class
