import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MapPickerComponent } from '../../components/map-picker/map-picker.component';
import { AddressService } from '../../services/address.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-photo',
  standalone: true,
  imports: [CommonModule, MapPickerComponent, HttpClientModule, FormsModule],
  templateUrl: './add-photo.component.html',
  styleUrl: './add-photo.component.scss'
})
export class AddPhotoComponent implements OnInit{

  constructor(private mapboxService: AddressService) {}

  preciseDate : boolean = true;
  preciseLocation : boolean = true;

  ngOnInit(): void {
      console.log(HttpClientModule)
  }

  url: any;
  imagePath: any = [];
  message: string = '';
  reader = new FileReader();
  currentPhoto : number = 0;
  address: string = '';

  selectedCoords?: { lat: number; lng: number };

  onCoordsPicked(coords: { lat: number; lng: number }) {
    this.selectedCoords = coords;
    this.mapboxService.reverseGeocode(coords.lat, coords.lng).subscribe((res) => {
      if (res.features.length > 0) {
        this.address = res.features[0].place_name;
      } else {
        this.address = 'Address not found';
      }
    });
  }


  onFileChanged(event : any) {
    const files = event.target.files;
    if (files.length === 0)
        return;

    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
        this.message = "Only images are supported.";
        return;
    }

    this.imagePath = files;
    this.reader.readAsDataURL(files[0]);
    this.reader.onload = (_event) => {
        this.url = this.reader.result;
    }
}

changePhoto(direction: string){
  if (direction === 'left') {
    if(this.currentPhoto !== 0) {
      this.currentPhoto--;
    this.reader.readAsDataURL(this.imagePath[this.currentPhoto]);
    this.reader.onload = (_event) => {
        this.url = this.reader.result;
    }
  }
}
  else if (direction === 'right') {
    if(this.currentPhoto !== this.imagePath.length - 1) {
      this.currentPhoto++;
      this.reader.readAsDataURL(this.imagePath[this.currentPhoto]);
      this.reader.onload = (_event) => {
          this.url = this.reader.result;
      }
  }
}
}




}
