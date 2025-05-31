import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Media } from '../interfaces/media';
import { UsersService } from './users.service';
import { Observable, firstValueFrom, BehaviorSubject } from 'rxjs';

interface UploadMediaRequest {
  title: string;
  description: string;
  privacy: string;
  content: string;
  latitude: number;
  longitude: number;
  creation_date: string;
  images: File[];
}

@Injectable({
  providedIn: 'root',
})
export class MediaServiceService {
  constructor(private http: HttpClient, private userService: UsersService) {}

  private currentMediaSubject = new BehaviorSubject<Media[]>([]);
  public currentMedia$ = this.currentMediaSubject.asObservable();

  private radiousMediaSubject = new BehaviorSubject<Media[]>([]);
  public radiousMedia$ = this.radiousMediaSubject.asObservable();

  search(
    tl_tuple: any = { lon: 0, lat: 90 },
    br_tuple: any = { lon: 90, lat: 0 }
  ): Observable<Media[]> {
    console.log("Searching media with bounds:", tl_tuple, br_tuple);

    const body = {
      location: { top_left: tl_tuple, bottom_right: br_tuple },
      phrase: null,
      creation_date: { year_from: 2010, year_to: 2025 },
      page: 0,
      size: 10,
    };

    const request = this.http.post<Media[]>(
      `${environment.apiUrl}/search`,
      body
    );

    request.subscribe((media) => {
      // persist the fetched result, then update current display
      this.radiousMediaSubject.next(media);
      this.currentMediaSubject.next(media);
    });
    return request;
  }

  public filterMediaByCircle(center: [number, number], radiusMeters: number): void {
    console.log('Filtering media by circle:', center, radiusMeters);
    // always filter from the persisted full list
    const source = this.currentMediaSubject.value;
    const filtered = source.filter((media) => {
      const coords: [number, number] = [
        media.location.coordinates.lon,
        media.location.coordinates.lat,
      ];
      const distanceKm = this.getDistanceInKm(center, coords);
      return distanceKm * 1000 <= radiusMeters;
    });
    this.radiousMediaSubject.next(filtered);
  }

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
    const h = sinDlat * sinDlat + sinDlon * sinDlon * Math.cos(rLat1) * Math.cos(rLat2);
    return 2 * R * Math.asin(Math.sqrt(h));
  }

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

    const currentUser = await this.userService.getCurrentUser();
    formData.append('user_id', currentUser!.id);

    return await firstValueFrom(
      this.http.post(`${environment.apiUrl}/media/upload`, formData)
    );
  }

  async getMyPhotos(): Promise<Media[]> {
    const currentUser = await this.userService.getCurrentUser();
    console.log('Current User ID:', currentUser!.id);
    return firstValueFrom(
      this.http.get<Media[]>(`${environment.apiUrl}/search/my-photos`, {
        params: { user_id: currentUser!.id },
      })
    );
  }

  async deletePhoto(id: string): Promise<any> {
    return await firstValueFrom(
      this.http.delete(`${environment.apiUrl}/media/delete/${id}`)
    );
  }

  async changePhotoPrivacy(id: string, privacy: string): Promise<any> {
    return await firstValueFrom(
      this.http.patch(`${environment.apiUrl}/media/privacy/${id}`, { privacy })
    );
  }

  filterMediaByIds(ids: string[]): void {
    const filtered = this.currentMediaSubject.value.filter((media: Media) =>
      ids.includes(media.id.toString())
    );
    this.currentMediaSubject.next(filtered);
  }
}