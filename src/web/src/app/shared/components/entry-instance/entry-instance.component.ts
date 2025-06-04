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
import { RequestDialogComponent } from '../request-dialog/request-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog.d-Dvsbu-0E';
import { Dialog } from '@angular/cdk/dialog';

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
    private mediaService: MediaServiceService,
    private dialog: Dialog
  ) {}

  @Input() data!: Media;

  showPrivateBanner: boolean = true;
  requestStatus: string | null = null;
  user: User | null = null;

  async ngOnInit(): Promise<void> {
    if (this.data.privacy === Privacy.Private) {
      const accessRequests = this.mediaService.getMediaAccessRequests(
        this.data.id
      );
      this.user = await this.usersService.getCurrentUser();
      if (this.user && this.user.id == this.data.user_id.toString()) {
        // If the user is the owner of the media, they can see it regardless of privacy
        this.showPrivateBanner = false;
        this.requestStatus = null;
        return;
      }
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
          this.requestStatus = request?.status || null;
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
    this.dialog.open(RequestDialogComponent, {
      data: { mediaID: this.data.id },
    });
  }
}
