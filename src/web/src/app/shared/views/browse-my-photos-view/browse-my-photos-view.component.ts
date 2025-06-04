import { Component, OnInit } from '@angular/core';
import { MediaServiceService } from '../../services/media.service';
import { Media, Privacy } from '../../interfaces/media';
import { CommonModule } from '@angular/common';
import { MyPhotoEntryComponent } from '../../components/my-photo-entry/my-photo-entry.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-browse-my-photos-view',
  standalone: true,
  imports: [CommonModule, MyPhotoEntryComponent],
  templateUrl: './browse-my-photos-view.component.html',
  styleUrl: './browse-my-photos-view.component.scss'
})
export class BrowseMyPhotosViewComponent implements OnInit {
  myPhotos: Media[] = [];
  private subscriptions = new Subscription();

  constructor(private mediaService: MediaServiceService) {}

  ngOnInit(): void {
    this.mediaService.getMyPhotos().then((photos) => {
      this.myPhotos = photos;
    });
    this.subscriptions.add(
      this.mediaService.photoUploaded$.subscribe(() => {
        this.mediaService.getMyPhotos().then((photos) => {
          this.myPhotos = photos;
        });
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  async onDeletePhoto(id: string) {
    await this.mediaService.deletePhoto(id);
    // Always reload the list from backend to ensure up-to-date state
    this.myPhotos = await this.mediaService.getMyPhotos();
  }

  async onPrivacyChanged(event: {id: string, privacy: string}) {
    await this.mediaService.changePhotoPrivacy(event.id, event.privacy);
    // Always reload the list from backend to ensure up-to-date state
    this.myPhotos = await this.mediaService.getMyPhotos();
  }
}