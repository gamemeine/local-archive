import { environment } from '../../../../environments/environment'
import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { Dialog } from '@angular/cdk/dialog';
import { FiltersPopupComponent } from '../filters-popup/filters-popup.component';
@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent implements OnInit {
  map: mapboxgl.Map | undefined;
  style = 'mapbox://styles/mapbox/streets-v11';
  lat: number = 52.230170;
  lng: number = 20.985742;

  constructor(private dialog: Dialog) {}

  openDialog() {
    this.dialog.open(FiltersPopupComponent);
  }

  ngOnInit() {
    this.map = new mapboxgl.Map({
      accessToken: environment.mapbox.accessToken,
      container: 'map',
      style: this.style,
      zoom: 17,
      center: [this.lng, this.lat]
    });
  }
}
