import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment } from '../interfaces/comment';
import { environment } from '../../../environments/environment';
import { UsersService } from './users.service';

@Injectable({ providedIn: 'root' })
export class CommentService {
  constructor(private http: HttpClient, private usersService: UsersService) {}

  getComments(photoId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${environment.apiUrl}/media/${photoId}/comments`);
  }

  async addComment(photoId: number, comment_text: string): Promise<Observable<any>> {
    const body = new URLSearchParams();
    body.set('comment_txt', comment_text);

    const user = await this.usersService.getCurrentUser()
    const payload = {
      text: comment_text,
      user_id: user!.id
    }

    return this.http.post(`${environment.apiUrl}/media/${photoId}/comments`, payload);
  }
}
