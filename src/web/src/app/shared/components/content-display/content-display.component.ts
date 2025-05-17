import { Component } from '@angular/core';
import { EntryInstanceComponent } from '../entry-instance/entry-instance.component';
import { MockPhotos } from '../../mocks/mockPhotos';
import { CommonModule } from '@angular/common';
import { DataInstance } from '../../interfaces/dataInstance';
import { SearchbarComponent } from '../searchbar/searchbar.component';
import { MediaServiceService } from '../../services/media-service.service';
import { Media } from '../../interfaces/media';
import { PhotoServiceService } from '../../services/photo-service.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-content-display',
  standalone: true,
  imports: [CommonModule, EntryInstanceComponent, SearchbarComponent],
  templateUrl: './content-display.component.html',
  styleUrl: './content-display.component.scss',
})
export class ContentDisplayComponent {
  media: Media[] = [];
  photos: DataInstance[] = [];

  private subscriptions = new Subscription();

  constructor(
    private mediaService: MediaServiceService,
    private photoService: PhotoServiceService
  ) {}

  ngOnInit(): void {
    // Subscribe to media
    this.subscriptions.add(
      this.mediaService.search().subscribe((result) => {
        this.media = result;
      })
    );

    // Subscribe to photo updates
    this.subscriptions.add(
      this.photoService.filteredPhotos$.subscribe((photos) => {
        this.photos = photos;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe(); // Clean up
  }
}
