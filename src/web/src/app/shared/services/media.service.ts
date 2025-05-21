import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Media } from '../interfaces/media';
import { firstValueFrom, Observable } from 'rxjs';
import { UsersService } from './users.service';

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

  search() {
    let body = {
      location: {
        top_left: {
          lon: 0,
          lat: 90,
        },
        bottom_right: {
          lon: 90,
          lat: 0,
        },
      },
      phrase: null,
      creation_date: {
        year_from: 2010,
        year_to: 2025,
      },
      page: 0,
      size: 10,
    };

    return this.http.post<Media[]>(`${environment.apiUrl}/search`, body);
  }

  async uploadMedia(request: UploadMediaRequest,): Promise<any> {
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
}
