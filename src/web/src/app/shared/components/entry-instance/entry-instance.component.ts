import { Component, Input } from '@angular/core';
import { Media } from '../../interfaces/media';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';


@Component({
  selector: 'app-entry-instance',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './entry-instance.component.html',
  styleUrl: './entry-instance.component.scss'
})
export class EntryInstanceComponent{
  constructor(private router: Router) {}

  @Input() data!: Media;


  getImageUrl(): string {
    return (
    (this.data.photos?.[0]?.thumbnail_url
      ? environment.apiUrl + this.data.photos[0].thumbnail_url
      : '')
  );
  }

  goToPhoto(): void {
    this.router.navigate(['/home/photo', this.data.id]);
  }

}
