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

  ngOnInit(): void {
    this.map = new mapboxgl.Map({
      accessToken: environment.mapbox.accessToken,
      container: 'map',
      style: this.style,
      zoom: 17,
      center: [this.lng, this.lat],
    });

    this.map.getCanvas().style.cursor = 'crosshair';
    this.subscriptions.add(
      this.mediaService.search().subscribe((result) => {
        this.media = result;
        console.log('Media:', this.media);
        this.map.on('load', () => {
          this.addMarkersToMap();
          this.emitSearchBasedOnBounds();

          // Re-run search when map is moved or zoomed
          this.map.on('moveend', () => {
            this.emitSearchBasedOnBounds();
          });

          this.map.on('click', (e) => {
            const point = e.lngLat;
            this.handlePointSelection(point);
          });
        });
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe(); // Clean up
  }

  addMarkersToMap() {
    this.media.forEach((media) => {
      new mapboxgl.Marker()
        .setLngLat([
          media.location.coordinates.lon,
          media.location.coordinates.lat,
        ])
        .setPopup(
          new mapboxgl.Popup().setHTML(
            `<h4>${media.content}</h4><p>${media.content}</p>`
          )
        )
        .addTo(this.map);
    });
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

      // Fill layer (light blue transparent)
      this.map.addLayer({
        id: 'radius-circle-layer',
        type: 'fill',
        source: 'radius-circle',
        paint: {
          'fill-color': '#00BFFF',
          'fill-opacity': 0.3,
        },
      });

      // Border layer (green dashed)
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

    // Remove previous marker if it exists
    if (this.clickedMarker) {
      this.clickedMarker.remove();
    }

    // Add a new green marker
    this.clickedMarker = new mapboxgl.Marker({ color: 'green' })
      .setLngLat([point.lng, point.lat])
      .addTo(this.map);

    this.findNearbyMarkers(center);
  }

  findNearbyMarkers(center: [number, number]) {
    const nearbyMarkers = this.markers.filter((marker) => {
      const distance = turf.distance(
        center,
        [marker.location.coordinates.lon, marker.location.coordinates.lat],
        {
          units: 'kilometers',
        }
      );
      return distance <= this.mapService.radius / 1000;
    });

    this.displayMarkerInfo(nearbyMarkers);
  }

  displayMarkerInfo(markers: Media[]) {
    let markerIds: string[] = [];
    markers.forEach((marker) => {
      console.log(marker.title, marker.created_at);
      markerIds.push(marker.id.toString());
      //   new mapboxgl.Popup()
      //     .setLngLat([marker.lng, marker.lat])
      //     .setHTML(`<strong>${marker.title}</strong><p>${marker.date}</p>`)
      //     .addTo(this.map);
      // });
    });
    this.photoService.getPhotosByIds(markerIds);
  }

  emitSearchBasedOnBounds() {
    const bounds = this.map?.getBounds();
    if (!bounds) {
      console.warn('Map bounds are not available yet.');
      return;
    }
    const upperLeft = bounds.getNorthWest(); // Top-left
    const bottomRight = bounds.getSouthEast(); // Bottom-right

    console.log('Bounds:', {
      upperLeft: { lat: upperLeft.lat, lon: upperLeft.lng },
      bottomRight: { lat: bottomRight.lat, lon: bottomRight.lng },
    });

    // Assuming your service supports bounding box search
    this.subscriptions.add(
      this.mediaService
        .search(
          { lon: upperLeft.lng, lat: upperLeft.lat },
          { lon: bottomRight.lng, lat: bottomRight.lat }
        )
        .subscribe((result: any) => {
          this.media = result;
          console.log('Search result:', this.media);
          this.addMarkersToMap();
        })
    );
  }
}
