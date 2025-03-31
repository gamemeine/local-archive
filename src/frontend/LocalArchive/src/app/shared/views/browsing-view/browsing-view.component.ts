import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FilterManagerComponent } from '../../components/filter-manager/filter-manager.component';
import { ContentDisplayComponent } from '../../components/content-display/content-display.component';

@Component({
  selector: 'app-browsing-view',
  standalone: true,
  imports: [CommonModule, FilterManagerComponent, ContentDisplayComponent],
  templateUrl: './browsing-view.component.html',
  styleUrl: './browsing-view.component.scss'
})
export class BrowsingViewComponent {

}
