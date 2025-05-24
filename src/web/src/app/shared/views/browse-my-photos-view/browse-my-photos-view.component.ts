import { Component, OnInit } from '@angular/core';
import { MediaServiceService } from '../../services/media.service';
import { Media } from '../../interfaces/media';
import { CommonModule } from '@angular/common';
import { EntryInstanceComponent } from '../../components/entry-instance/entry-instance.component';

@Component({
  selector: 'app-browse-my-photos-view',
  standalone: true,
  imports: [CommonModule, EntryInstanceComponent],
  templateUrl: './browse-my-photos-view.component.html',
  styleUrl: './browse-my-photos-view.component.scss'
})
export class BrowseMyPhotosViewComponent implements OnInit {
  myPhotos: Media[] = [];

  constructor(private mediaService: MediaServiceService) {}

  ngOnInit(): void {
    this.mediaService.getMyPhotos().then((photos) => {
      this.myPhotos = photos;
    });
  }
}