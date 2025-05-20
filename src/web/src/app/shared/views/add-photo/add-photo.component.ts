import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MapPickerComponent } from '../../components/map-picker/map-picker.component';
import { AddressService } from '../../services/address.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ApprovalPopupComponent } from '../../components/approval-popup/approval-popup.component';
import { Dialog } from '@angular/cdk/dialog';
import { MediaServiceService } from '../../services/media.service';

@Component({
  selector: 'app-add-photo',
  standalone: true,
  imports: [
    CommonModule,
    MapPickerComponent,
    HttpClientModule,
    FormsModule,
    ApprovalPopupComponent,
  ],
  templateUrl: './add-photo.component.html',
  styleUrl: './add-photo.component.scss',
})
export class AddPhotoComponent implements OnInit {
  preciseDate = true;
  preciseLocation = true;

  url: string | ArrayBuffer | null = null;
  imagePath: File[] = [];
  message = '';
  reader = new FileReader();
  currentPhoto = 0;
  address = '';
  selectedCoords?: { lat: number; lng: number };

  // TODO: replace with real user ID from your auth context
  currentUserId = 'user-123';

  constructor(
    private mapboxService: AddressService,
    private mediaService: MediaServiceService,
    private dialog: Dialog
  ) {}

  ngOnInit(): void {
    // debugging only
    console.log('AddPhotoComponent initialized');
  }

  onCoordsPicked(coords: { lat: number; lng: number }) {
    this.selectedCoords = coords;
    this.mapboxService
      .reverseGeocode(coords.lat, coords.lng)
      .subscribe((res) => {
        this.address =
          res.features.length > 0
            ? res.features[0].place_name
            : 'Address not found';
      });
  }

  onFileChanged(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }
    const file = input.files[0];
    if (!file.type.match(/image\/*/)) {
      this.message = 'Only images are supported.';
      return;
    }
    this.imagePath = Array.from(input.files);
    this.currentPhoto = 0;
    this.reader.readAsDataURL(this.imagePath[0]);
    this.reader.onload = () => {
      this.url = this.reader.result;
    };
  }

  changePhoto(direction: 'left' | 'right') {
    if (direction === 'left' && this.currentPhoto > 0) {
      this.currentPhoto--;
    } else if (
      direction === 'right' &&
      this.currentPhoto < this.imagePath.length - 1
    ) {
      this.currentPhoto++;
    } else {
      return;
    }
    const file = this.imagePath[this.currentPhoto];
    this.reader.readAsDataURL(file);
    this.reader.onload = () => {
      this.url = this.reader.result;
    };
  }

  async addPhoto() {
    if (this.imagePath.length === 0) {
      console.warn('No photo to upload.');
      return;
    }
    const images = this.imagePath;
    const title = 'Tytuł zdjęcia';
    const description = 'Opis zdjęcia';
    const privacy = 'public'; // or 'private'
    const content = this.address; // map address or other content
    const latitude = this.selectedCoords?.lat ?? 0;
    const longitude = this.selectedCoords?.lng ?? 0;
    const creationDate = '2024-05-17'; // or build dynamically

    try{
      const result = await this.mediaService.uploadMedia({
        title,
        description,
        privacy,
        content,
        latitude,
        longitude,
        creation_date: creationDate,
        images,
      })
      this.dialog.open(ApprovalPopupComponent);
      console.log('Upload result:', result);
    } catch (error) {
      console.error('Error uploading media:', error);
      this.message = 'Error uploading media. Please try again.';
    }
  }
}
