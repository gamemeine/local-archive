import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  Output,
  EventEmitter
} from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { environment } from '../../../../environments/environment'
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-map-picker',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './map-picker.component.html',
  styleUrl: './map-picker.component.scss'
})
export class MapPickerComponent implements AfterViewInit, OnDestroy {
  @Output() coordinatesSelected = new EventEmitter<{ lat: number; lng: number }>();
  map!: mapboxgl.Map;
  marker?: mapboxgl.Marker;


  ngAfterViewInit() {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v12',
      accessToken: environment.mapbox.accessToken,
      center: [20.985742, 52.230170],
      zoom: 17,
    });

    this.map.on('click', (event) => {
      const { lng, lat } = event.lngLat;

      // Emit selected coordinates
      this.coordinatesSelected.emit({ lat, lng });
      console.log('Selected coordinates:', { lat, lng });
      // Add or move marker
      if (this.marker) {
        this.marker.setLngLat([lng, lat]);
      } else {
        this.marker = new mapboxgl.Marker()
          .setLngLat([lng, lat])
          .addTo(this.map);
      }
    });
  }

  ngOnDestroy() {
    this.map.remove();
  }
}
