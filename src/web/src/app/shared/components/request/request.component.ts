import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
@Component({
  selector: 'app-request',
  standalone: true,
  imports: [],
  templateUrl: './request.component.html',
  styleUrl: './request.component.scss',
})
export class RequestComponent {
  @Input() data: any;

  constructor(private http: HttpClient) {}

  async acceptRequest() {
    // Logic to reject the request
    const body = {
      status: 'accepted',
    };

    await this.http
      .patch(`${environment.apiUrl}/media/access-request/${this.data.id}`, body)
      .subscribe({
        next: () => {
          alert('Zaakceptowano');
        },
        error: (err) => {
          alert('Błąd');
        },
      });
  }

  async rejectRequest() {
    // Logic to reject the request
    const body = {
      status: 'denied',
    };

    await this.http
      .patch(`${environment.apiUrl}/media/access-request/${this.data.id}`, body)
      .subscribe({
        next: () => {
          alert('Odrzucono');
        },
        error: (err) => {
          alert('Błąd');
        },
      });
  }
}
