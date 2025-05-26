import { Component, OnInit } from '@angular/core';
import { MediaServiceService } from '../../services/media.service';
import { Media, Privacy } from '../../interfaces/media';
import { CommonModule } from '@angular/common';
import { MyPhotoEntryComponent } from '../../components/my-photo-entry/my-photo-entry.component';

@Component({
  selector: 'app-browse-my-photos-view',
  standalone: true,
  imports: [CommonModule, MyPhotoEntryComponent],
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

async onDeletePhoto(id: string) {
  await this.mediaService.deletePhoto(id);
  this.myPhotos = this.myPhotos.filter(photo => String(photo.id) !== id);
}

async onPrivacyChanged(event: {id: string, privacy: string}) {
  await this.mediaService.changePhotoPrivacy(event.id, event.privacy);
  const photo = this.myPhotos.find(p => String(p.id) === event.id);
  if (photo && (event.privacy === 'public' || event.privacy === 'private')) {
    photo.privacy = event.privacy as Privacy;
  }
}
}