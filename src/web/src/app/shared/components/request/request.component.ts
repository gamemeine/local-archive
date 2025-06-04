import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { MediaServiceService } from '../../services/media.service';
@Component({
  selector: 'app-request',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './request.component.html',
  styleUrl: './request.component.scss',
})
export class RequestComponent {
  @Input() data: any;
  @Input() requests: any;

  // Add a reference to a hidden file input
  fileInput!: HTMLInputElement;

  constructor(private http: HttpClient, private mediaService: MediaServiceService) {}

  ngAfterViewInit() {
    // Create a hidden file input for photo upload
    this.fileInput = document.createElement('input');
    this.fileInput.type = 'file';
    this.fileInput.accept = 'image/*';
    this.fileInput.style.display = 'none';
    this.fileInput.addEventListener('change', (event: any) => {
      const file = event.target.files[0];
      if (file) {
        this.uploadPhoto(file);
      }
    });
    document.body.appendChild(this.fileInput);
  }

  async acceptRequest() {
    // Jeśli nie ma zdjęcia, zapytaj użytkownika czy chce dodać zdjęcie
    if (!this.data.photoUrl || this.data.photoUrl === '' || this.data.photoMissing) {
      if (confirm('Brak zdjęcia do tego zgłoszenia. Czy chcesz dodać zdjęcie teraz?')) {
        this.fileInput.click();
        // Akceptacja nastąpi po przesłaniu zdjęcia w uploadPhoto
        return;
      } else {
        // Użytkownik anulował, nie akceptuj prośby
        return;
      }
    }
    // Jeśli jest zdjęcie lub użytkownik już przesłał, akceptuj
    const body = {
      status: 'accepted',
    };
    await this.http
      .patch(`${environment.apiUrl}/media/access-request/${this.data.id}`, body)
      .subscribe({
        next: () => {
          alert('Zaakceptowano');
        },
        error: (err: any) => {
          alert('Błąd');
        },
      });
  }

  async uploadPhoto(file: File) {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('request_id', this.data.id);
    await this.http
      .post(`${environment.apiUrl}/media/upload-photo-for-request`, formData)
      .subscribe({
        next: () => {
          // Po przesłaniu zdjęcia automatycznie akceptuj prośbę
          this.mediaService.notifyPhotoUploaded();
          this.acceptRequestAfterPhoto();
        },
        error: () => {
          alert('Błąd podczas przesyłania zdjęcia.');
        },
      });
  }

  async acceptRequestAfterPhoto() {
    const body = {
      status: 'accepted',
    };
    await this.http
      .patch(`${environment.apiUrl}/media/access-request/${this.data.id}`, body)
      .subscribe({
        next: () => {
          alert('Zaakceptowano');
        },
        error: (err: any) => {
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
          console.log('Odrzucono');
        },
        error: (err: any) => {
          console.log('Błąd');
        },
      });
  }
}
