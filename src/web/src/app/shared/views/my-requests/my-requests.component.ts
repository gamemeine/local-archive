import { Component } from '@angular/core';
import { RequestComponent } from '../../components/request/request.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UsersService } from '../../services/users.service';
import { MediaServiceService } from '../../services/media.service';
import { User } from '@auth0/auth0-angular';
import { OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-my-requests',
  standalone: true,
  imports: [RequestComponent, CommonModule, FormsModule],
  templateUrl: './my-requests.component.html',
  styleUrl: './my-requests.component.scss',
})
export class MyRequestsComponent implements OnInit {
  constructor(
    private router: Router,
    private http: HttpClient,
    private usersService: UsersService,
    private mediaService: MediaServiceService
  ) {}

  requests: any = [];

  user: User | null = null;

  async ngOnInit(): Promise<void> {
    this.user = await this.usersService.getCurrentUser();
    await this.loadRequests();
  }

  async loadRequests(): Promise<void> {
    if (!this.user?.['id']) {
      alert('Nie można wysłać prośby – brak użytkownika');
      return;
    }
    const body = {};

    this.http
      .get(
        `${environment.apiUrl}/media/user-access-requests/${this.user?.['id']}`
      )
      .subscribe({
        next: (response) => {
          this.requests = response;
          console.log('Requests loaded:', this.requests);
        },
        error: (err) => {
          console.log('Error loading requests:', err);
        },
      });
  }
}
