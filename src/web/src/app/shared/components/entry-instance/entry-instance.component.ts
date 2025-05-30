import { Component, Input } from '@angular/core';
import { Media } from '../../interfaces/media';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-entry-instance',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './entry-instance.component.html',
  styleUrl: './entry-instance.component.scss'
})
export class EntryInstanceComponent{
  constructor(private router: Router, private http: HttpClient, private usersService: UsersService) {}

  @Input() data!: Media;


  getImageUrl(): string {
    return (
    (this.data.photos?.[0]?.thumbnail_url
      ? environment.apiUrl + this.data.photos[0].thumbnail_url
      : '')
  );
  }

  goToPhoto(): void {
    this.router.navigate(['/home/photo', this.data.id]);
  }


  async sendRequestAccess(): Promise<void> {
    const user = await this.usersService.getCurrentUser()
    const body = {
      user_id: user?.id
    };
    console.log("Wysyłane PATCH body:", body);

    this.http.post(`${environment.apiUrl}/media/access-request/${this.data.id}`, body)
      .subscribe({
        next: () => {
          alert('Wysłano prośbę o dostęp');
        },
        error: (err) => {
          alert('Nie udało się wysłać prośby: ' + err.message);
        }
      });
  }
}
