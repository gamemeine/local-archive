import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Media } from '../interfaces/media';

@Injectable({
  providedIn: 'root',
})
export class MediaServiceService {
  constructor(private http: HttpClient) {}

  search(params: any) {
    // params should be the object with all search fields from the form
    return this.http.post<Media[]>(`${environment.apiUrl}/search`, params);
  }

  uploadMedia(formData: FormData) {
    return this.http.post(`${environment.apiUrl}/media/upload`, formData);
  }
}
