import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment } from '../interfaces/comment';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CommentService {
  constructor(private http: HttpClient) {}

  getComments(photoId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${environment.apiUrl}/media/${photoId}/comments`);
  }

  addComment(photoId: number, comment_text: string): Observable<any> {
    const body = new URLSearchParams();
    body.set('comment_txt', comment_text);
    return this.http.post(
      `${environment.apiUrl}/media/${photoId}/comments`,
      body.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
  }
}
