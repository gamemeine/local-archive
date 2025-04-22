import { Component } from '@angular/core';
import { EntryInstanceComponent } from '../entry-instance/entry-instance.component';
import { MockPhotos } from '../../mocks/mockPhotos';
import { CommonModule } from '@angular/common';
import { DataInstance } from '../../interfaces/dataInstance';
import { SearchbarComponent } from "../searchbar/searchbar.component";

@Component({
  selector: 'app-content-display',
  standalone: true,
  imports: [CommonModule, EntryInstanceComponent, SearchbarComponent],
  templateUrl: './content-display.component.html',
  styleUrl: './content-display.component.scss'
})
export class ContentDisplayComponent {


  photos : DataInstance[] = MockPhotos
}
