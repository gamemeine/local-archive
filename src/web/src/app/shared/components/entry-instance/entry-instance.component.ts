import { Component, Input } from '@angular/core';
import { Media } from '../../interfaces/media';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UsersService } from '../../services/users.service';
import { OnInit } from '@angular/core';
import { MediaServiceService } from '../../services/media.service';
import { map } from 'rxjs';
import { Privacy } from '../../interfaces/media';
import { User } from '../../services/users.service';

@Component({
  selector: 'app-entry-instance',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './entry-instance.component.html',
  styleUrl: './entry-instance.component.scss',
})
export class EntryInstanceComponent {
  constructor(
    private router: Router,
    private http: HttpClient,
    private usersService: UsersService,
    private mediaService: MediaServiceService
  ) {}

  @Input() data!: Media;

  showPrivateBanner: boolean = true;
  user: User | null = null;

  async ngOnInit(): Promise<void> {
    if (this.data.privacy === Privacy.Private) {
      const accessRequests = this.mediaService.getMediaAccessRequests(
        this.data.id
      );
      this.user = await this.usersService.getCurrentUser();
      accessRequests
        .pipe(
          map((accessRequests) =>
            accessRequests.find(
              (accessRequest) =>
                accessRequest.requester_id.toString() === this.user?.id
            )
          )
        )
        .subscribe((request) => {
          this.showPrivateBanner =
            !request ||
            request.status === 'pending' ||
            request.status === 'denied';
        });
    } else {
      this.showPrivateBanner = false;
    }
  }

  getImageUrl(): string {
    return this.data.photos?.[0]?.thumbnail_url
      ? environment.apiUrl + this.data.photos[0].thumbnail_url
      : '';
  }

  goToPhoto(): void {
    this.router.navigate(['/home/photo', this.data.id]);
  }

  async sendRequestAccess(): Promise<void> {
    if (!this.user?.id) {
      alert('Nie można wysłać prośby – brak użytkownika');
      return;
    }
    const body = {
      user_id: this.user.id,
      justification:
        'Proszę o dostęp do tej prywatnej fotografii, ponieważ jest ona dla mnie ważna.',
    };
    console.log('Wysyłane PATCH body:', body);

    this.http
      .post(`${environment.apiUrl}/media/access-request/${this.data.id}`, body)
      .subscribe({
        next: () => {
          alert('Wysłano prośbę o dostęp');
        },
        error: (err) => {
          alert('Nie udało się wysłać prośby: ' + err.message);
        },
      });
  }
}
