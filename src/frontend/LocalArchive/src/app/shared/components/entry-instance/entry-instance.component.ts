import { Component, Input } from '@angular/core';
import { DataInstance } from '../../interfaces/dataInstance';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-entry-instance',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './entry-instance.component.html',
  styleUrl: './entry-instance.component.scss'
})
export class EntryInstanceComponent{

  @Input() data!: DataInstance;


  getImageUrl(photo: string): string {
    return `assets/mockPhotos/${photo}`;
  }

}
