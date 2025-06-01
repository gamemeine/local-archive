// /src/web/src/app/shared/services/users.service.ts
// Service for user-related API calls and Auth0 integration.

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '@auth0/auth0-angular';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

interface User {
  id: string;
  email: string;
  display_name: string;
  role: string;
  auth_provider: string;
}

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private http: HttpClient, private auth: AuthService) {}

  // Get the current authenticated user from Auth0 and map to backend User shape
  async getCurrentUser(): Promise<User | null> {
    const user = await firstValueFrom(this.auth.user$);
    if (!user) {
      throw new Error('No Auth0 user available');
    }

    const [provider, realUserId] = user.sub!.split('|');
    return {
      id: realUserId,
      email: user.email!,
      display_name: user.nickname || "",
      role: 'user',
      auth_provider: provider,
    };
  }

  // Ensure the user exists in the backend by calling the API
  async ensureUserExists(): Promise<any> {
    const user = await this.getCurrentUser();
    if (!user) {
      throw new Error('No Auth0 user available');
    }

    const payload = {
      id: user.id,
      email: user.email,
      display_name: user.display_name,
      role: user.role,
      auth_provider: user.auth_provider,
    };

    return await firstValueFrom(
      this.http.post(`${environment.apiUrl}/users/ensure_exists`, payload)
    );
  }
}