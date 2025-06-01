// /src/web/src/app/shared/services/comment.service.ts
// Service for comment-related API calls and logic.

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment } from '../interfaces/comment';
import { environment } from '../../../environments/environment';
import { UsersService } from './users.service';

@Injectable({ providedIn: 'root' })
export class CommentService {
  constructor(private http: HttpClient, private usersService: UsersService) {}

  // Get all comments for a photo by its ID
  getComments(photoId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(
      `${environment.apiUrl}/media/${photoId}/comments`
    );
  }

  // Get picture details by photo ID
  getPicture(photoId: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/media/${photoId}`);
  }

  // Add a comment to a photo (returns Observable for chaining)
  async addComment(
    photoId: number,
    comment_text: string
  ): Promise<Observable<any>> {
    const user = await this.usersService.getCurrentUser();
    const payload = {
      text: comment_text,
      user_id: user!.id,
    };

    return this.http.post(
      `${environment.apiUrl}/media/${photoId}/comments`,
      payload
    );
  }
}