import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment } from '../interfaces/comment';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CommentService {
  constructor(private http: HttpClient) {}

  getComments(photoId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`/api/media/${photoId}/comments`);
  }

  addComment(photoId: number, comment: { author: string; text: string }): Observable<any> {
    return this.http.post(`${environment.apiUrl}/api/media/${photoId}/comments`, comment);
  }
}
