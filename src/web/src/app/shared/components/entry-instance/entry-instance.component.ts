import { Component, Input } from '@angular/core';
import { Media } from '../../interfaces/media';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-entry-instance',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './entry-instance.component.html',
  styleUrl: './entry-instance.component.scss'
})
export class EntryInstanceComponent{

  @Input() data!: Media;


  getImageUrl(): string {
    return this.data.photos?.[0]?.thumbnail_url ?? '';
  }

}
