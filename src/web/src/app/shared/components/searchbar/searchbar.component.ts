import { Component } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { FiltersPopupComponent } from '../filters-popup/filters-popup.component';
import { MapPopupComponent } from '../map-popup/map-popup.component';
@Component({
  selector: 'app-searchbar',
  standalone: true,
  imports: [],
  templateUrl: './searchbar.component.html',
  styleUrl: './searchbar.component.scss'
})
export class SearchbarComponent {

  constructor(private dialog: Dialog) {}


 openDialog(type: string) {
    if (type === 'filters') {
    this.dialog.open(FiltersPopupComponent);
  } else if (type === 'range') {
    this.dialog.open(MapPopupComponent);
  }
}

}
