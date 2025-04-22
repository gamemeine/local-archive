import { Component } from '@angular/core';
import { DialogModule, DialogRef } from '@angular/cdk/dialog';
import { FormsModule } from '@angular/forms';
import { MarkerService } from '../../services/marker.service';

@Component({
  selector: 'app-map-popup',
  standalone: true,
  imports: [FormsModule, DialogModule],
  templateUrl: './map-popup.component.html',
  styleUrls: ['./map-popup.component.scss','../filters-popup/filters-popup.component.scss'],
})
export class MapPopupComponent {
  constructor(private dialogRef: DialogRef<MapPopupComponent>, private mapService: MarkerService) {}

  radius : number = this.mapService.radius;

  closeDialog() {
    this.mapService.radius = this.radius;
    this.dialogRef.close(); // You can also pass data here
  }
  onMapSettingsChange() {
    this.mapService.radius = this.radius;
}
}
