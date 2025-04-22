import { Component } from '@angular/core';
import { EntryInstanceComponent } from '../entry-instance/entry-instance.component';
import { MockPhotos } from '../../mocks/mockPhotos';
import { CommonModule } from '@angular/common';
import { DataInstance } from '../../interfaces/dataInstance';
import { MediaServiceService } from '../../services/media-service.service';
import { Media } from '../../interfaces/media';

@Component({
  selector: 'app-content-display',
  standalone: true,
  imports: [CommonModule, EntryInstanceComponent],
  templateUrl: './content-display.component.html',
  styleUrl: './content-display.component.scss',
})
export class ContentDisplayComponent {
  media: Media[] = [];

  constructor(private mediaService: MediaServiceService) {}

  ngOnInit(): void {
    this.mediaService.search().subscribe((result) => {
      console.log(result);
      this.media = result;
    });
  }

  photos: DataInstance[] = MockPhotos;
}
