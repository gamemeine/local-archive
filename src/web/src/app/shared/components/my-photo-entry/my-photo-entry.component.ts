import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Media } from '../../interfaces/media';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-my-photo-entry',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-photo-entry.component.html',
  styleUrl: './my-photo-entry.component.scss'
})
export class MyPhotoEntryComponent {
  @Input() data!: Media;
  @Output() deleted = new EventEmitter<string>();
  @Output() privacyChanged = new EventEmitter<{id: string, privacy: string}>();

  getImageUrl(): string {
    return (
      this.data?.photos?.[0]?.thumbnail_url
        ? environment.apiUrl + this.data.photos[0].thumbnail_url
        : ''
    );
  }

    onDelete() {
    this.deleted.emit(this.data.id.toString());
    }

    onPrivacyChange(newPrivacy: string) {
    this.privacyChanged.emit({ id: this.data.id.toString(), privacy: newPrivacy });
    }
}