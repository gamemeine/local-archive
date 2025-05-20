import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Media } from '../interfaces/media';

@Injectable({
  providedIn: 'root',
})
export class MediaServiceService {
  constructor(private http: HttpClient) {}

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
        year_to: 2020,
      },
      page: 0,
      size: 10,
    };

    return this.http.post<Media[]>(`${environment.apiUrl}/search`, body);
  }

  uploadMedia(formData: FormData) {
    return this.http.post(`${environment.apiUrl}/media/upload`, formData);
  }
}
