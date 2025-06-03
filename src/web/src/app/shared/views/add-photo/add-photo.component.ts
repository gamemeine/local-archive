import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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

  title: string = '';
  description: string = '';
  isPrivate: boolean = false; // checkbox model
  creationDate: string = ''; // model for date input

  // TODO: replace with real user ID from your auth context
  currentUserId = 'user-123';

  customAddress = {
    street: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
  };

  constructor(
    private mapboxService: AddressService,
    private mediaService: MediaServiceService,
    private dialog: Dialog
  ) {}

  ngOnInit(): void {
    // debugging only
    console.log('AddPhotoComponent initialized');
  }

  parseAddress(address: string) {
    address = address.trim();
    let addressComponents: string[] = address.split(',');
    if (addressComponents.length < 4) {
      console.warn('Address does not have enough components:', address);
      return;
    }
    let addressDict = {
      street: addressComponents[0],
      city: addressComponents[1].trim().split(' ')[1],
      state: addressComponents[2].trim(),
      country: addressComponents[3].trim(),
      postalCode: addressComponents[1].trim().split(' ')[0], // Assuming postal code is the first part of the city
    };
    console.log('Parsed address:', addressDict);
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
        this.parseAddress(this.address);
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
    const title = this.title || 'No title provided';
    const description = this.description || 'No description provided';
    const privacy = this.isPrivate ? 'private' : 'public';
    const content = this.address;
    const latitude = this.selectedCoords?.lat ?? 0;
    const longitude = this.selectedCoords?.lng ?? 0;
    const creationDate =
      this.creationDate || new Date().toISOString().slice(0, 10);

    try {
      const result = await this.mediaService.uploadMedia({
        title,
        description,
        privacy,
        content,
        latitude,
        longitude,
        creation_date: creationDate,
        images,
      });
      this.dialog.open(ApprovalPopupComponent);
      console.log('Upload result:', result);
    } catch (error) {
      console.error('Error uploading media:', error);
      this.message = 'Error uploading media. Please try again.';
    }
  }

  translateAddress() {
    let addressString = '';
    addressString += this.customAddress.city;
    addressString += this.customAddress.street
      ? `, ${this.customAddress.street}`
      : '';
    addressString += this.customAddress.state
      ? `, ${this.customAddress.state}`
      : '';
    this.mapboxService.getCoordsFromAddress(addressString).subscribe({
      next: (res) => {
        if (res.features.length > 0) {
          this.selectedCoords = {
            lat: res.features[0].center[1],
            lng: res.features[0].center[0],
          };
          console.log('Coordinates:', this.selectedCoords);
          this.address = res.features[0].place_name;
          this.parseAddress(this.address);
        } else {
          this.message = 'Address not found';
        }
      },
    });
  }
}
