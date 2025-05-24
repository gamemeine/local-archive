import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Media } from '../interfaces/media';
import { firstValueFrom, Observable } from 'rxjs';
import { UsersService } from './users.service';
import { BehaviorSubject } from 'rxjs';
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

  currentMedia: Observable<Media[]> | any;
  private currentMediaSubject = new BehaviorSubject<Media[]>([]);
  public currentMedia$ = this.currentMediaSubject.asObservable();

  search(
    tl_tuple: any = {
      lon: 0,
      lat: 90,
    },
    br_tuple: any = {
      lon: 90,
      lat: 0,
    }
  ): Observable<Media[]> {
    let body = {
      location: {
        top_left: tl_tuple,
        bottom_right: br_tuple,
      },
      phrase: null,
      creation_date: {
        year_from: 2010,
        year_to: 2025,
      },
      page: 0,
      size: 10,
    };

    const request = this.http.post<Media[]>(
      `${environment.apiUrl}/search`,
      body
    );

    request.subscribe((media) => this.currentMediaSubject.next(media));
    return request;
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
      params: { user_id: currentUser!.id }
    })
  );
}
}
