import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import * as mapboxgl from 'mapbox-gl';
import * as turf from '@turf/turf';
import { Dialog } from '@angular/cdk/dialog';
import { FiltersPopupComponent } from '../filters-popup/filters-popup.component';
import { MarkerService } from '../../services/marker.service';
import { CustomMarker } from '../../interfaces/marker';
import { PhotoServiceService } from '../../services/photo-service.service';
import { MockMarkers } from '../../mocks/mockMarkers';
import { MediaServiceService } from '../../services/media.service';
import { Media } from '../../interfaces/media';
import { DataInstance } from '../../interfaces/dataInstance';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
})
export class MapComponent implements OnInit {
  constructor(
    private dialog: Dialog,
    private mapService: MarkerService,
    private photoService: PhotoServiceService,
    private mediaService: MediaServiceService
  ) {}

  map!: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v11';
  lat = 52.23017;
  lng = 20.985742;
  clickedMarker: mapboxgl.Marker | null = null;
  markers: Media[] = [];
  media: Media[] = [];
  photos: DataInstance[] = [];

  private subscriptions = new Subscription();

  // hold mapbox Marker instances for easy cleanup
  private mapMarkers: mapboxgl.Marker[] = [];

  ngOnInit(): void {
    this.map = new mapboxgl.Map({
      accessToken: environment.mapbox.accessToken,
      container: 'map',
      style: this.style,
      zoom: 17,
      center: [this.lng, this.lat],
    });

    this.map.getCanvas().style.cursor = 'crosshair';

    // 1) kick off initial search (will populate persisted + current lists)
    this.mediaService.search();
    // 2) on any new currentMedia update (search or filter), redraw markers
    this.subscriptions.add(
      this.mediaService.currentMedia$.subscribe((mediaItems) => {
        // remove old markers
        this.mapMarkers.forEach((m) => m.remove());
        this.mapMarkers = [];
        // add new set
        mediaItems.forEach((item) => {
          const marker = new mapboxgl.Marker()
            .setLngLat([
              item.location.coordinates.lon,
              item.location.coordinates.lat,
            ])
            .setPopup(
              new mapboxgl.Popup().setHTML(
                `<h4>${item.content}</h4><p>${item.content}</p>`
              )
            )
            .addTo(this.map);
          this.mapMarkers.push(marker);
        });
      })
    );
    // event hooks: always call search or filter; overlays remain intact
    this.map.on('moveend', () => this.emitSearchBasedOnBounds());
    this.map.on('click', (e) => this.handlePointSelection(e.lngLat));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe(); // Clean up
  }

  handlePointSelection(point: mapboxgl.LngLat) {
    const center: [number, number] = [point.lng, point.lat];
    const circle = turf.circle(center, this.mapService.radius, {
      steps: 64,
      units: 'meters',
    });

    // Update or add the circle fill
    if (this.map.getSource('radius-circle')) {
      (this.map.getSource('radius-circle') as mapboxgl.GeoJSONSource).setData(
        circle
      );
    } else {
      this.map.addSource('radius-circle', {
        type: 'geojson',
        data: circle,
      });

      if (!this.map.getLayer('radius-circle-layer')) {
        this.map.addLayer({
          id: 'radius-circle-layer',
          type: 'fill',
          source: 'radius-circle',
          paint: {
            'fill-color': '#00BFFF',
            'fill-opacity': 0.3,
          },
        });
      }

      // Border layer (green dashed)
      if (!this.map.getLayer('radius-circle-border')) {
        this.map.addLayer({
          id: 'radius-circle-border',
          type: 'line',
          source: 'radius-circle',
          paint: {
            'line-color': 'green',
            'line-width': 2,
            'line-dasharray': [2, 2],
          },
        });
      }
    }

    // Remove previous marker if it exists
    if (this.clickedMarker) {
      this.clickedMarker.remove();
    }

    // Add a new green marker
    this.clickedMarker = new mapboxgl.Marker({ color: 'green' })
      .setLngLat([point.lng, point.lat])
      .addTo(this.map);

    // use service to filter current media by circle
    this.mediaService.filterMediaByCircle(center, this.mapService.radius);
  }

  emitSearchBasedOnBounds() {
    const bounds = this.map?.getBounds();
    if (!bounds) {
      console.warn('Map bounds are not available yet.');
      return;
    }
    const upperLeft = bounds.getNorthWest();
    const bottomRight = bounds.getSouthEast();

    this.subscriptions.add(
      this.mediaService
        .search(
          { lon: upperLeft.lng, lat: upperLeft.lat },
          { lon: bottomRight.lng, lat: bottomRight.lat }
        ) // service.search triggers currentMedia update which redraws markers
        .subscribe()
    );
  }
}
