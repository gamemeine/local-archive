import { Component } from '@angular/core';
import { EntryInstanceComponent } from '../entry-instance/entry-instance.component';
import { CommonModule } from '@angular/common';
import { SearchbarComponent } from '../searchbar/searchbar.component';
import { MediaServiceService } from '../../services/media.service';
import { Media } from '../../interfaces/media';
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

  private subscriptions = new Subscription();

  constructor(
    private mediaService: MediaServiceService,
  ) {}

  ngOnInit(): void {
    // Subscribe to media
    this.subscriptions.add(
      this.mediaService.radiousMedia$.subscribe((media) => {
        this.media = media;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe(); // Clean up
  }
}
