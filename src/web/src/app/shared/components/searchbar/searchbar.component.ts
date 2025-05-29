import { Component } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { FiltersPopupComponent } from '../filters-popup/filters-popup.component';
import { MapPopupComponent } from '../map-popup/map-popup.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-searchbar',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './searchbar.component.html',
  styleUrl: './searchbar.component.scss',
})
export class SearchbarComponent {
  constructor(private dialog: Dialog) {}

  unclassifiedConditions: string[] = [];
  faultyFilters: boolean = false;

  searchString: string = '';

  allowedKeys: { [key: string]: string } = {
    od: 'from',
    do: 'to',
    od_roku: 'from_year',
    do_roku: 'to_year',
    miasto: 'city',
    kraj: 'country',
    kod_pocztowy: 'postal_code',
    wojewodztwo: 'state',
  };

  parseSearchString() {
    this.unclassifiedConditions = [];
    this.faultyFilters = false;
    let conditions: string[] = this.searchString.split('|');
    const dictionaries = conditions
      .map((condition) => {
        const [key, value] = condition.split(':').map((s) => s.trim());
        if (key && value) {
          if (this.allowedKeys[key as string]) {
            return { [this.allowedKeys[key as string]]: value };
          }
          this.faultyFilters = true;
          return { [key]: value };
        }
        this.unclassifiedConditions.push(condition);
        return null;
      })
      .filter(Boolean);
    // Convert array of objects to a single object
    const parsedConditions = dictionaries.reduce((acc, curr) => {
      return { ...acc, ...curr };
    }, {});
    console.log('Parsed conditions:', parsedConditions);
    // console.log('Parsed search conditions:', dictionaries);
    console.log('Unclassified conditions:', this.unclassifiedConditions);
  }

  openDialog(type: string) {
    if (type === 'filters') {
      this.dialog.open(FiltersPopupComponent);
    } else if (type === 'range') {
      this.dialog.open(MapPopupComponent);
    }
  }
}
