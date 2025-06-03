import { Component } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { FiltersPopupComponent } from '../filters-popup/filters-popup.component';
import { MapPopupComponent } from '../map-popup/map-popup.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MediaServiceService } from '../../services/media.service';

@Component({
  selector: 'app-searchbar',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './searchbar.component.html',
  styleUrl: './searchbar.component.scss',
})
export class SearchbarComponent {
  constructor(
    private dialog: Dialog,
    private mediaService: MediaServiceService
  ) {}

  searchString = '';

  filters: { [key: string]: string } = {};
  keywords: string[] = [];

  faultyFilters = false;

  allowedKeys: { [key: string]: string } = {
    od: 'from_year',
    do: 'to_year',
    od_roku: 'from_year',
    do_roku: 'to_year',
    miasto: 'city',
    kraj: 'country',
    kod_pocztowy: 'postal_code',
    wojewodztwo: 'state',
  };

  parseSearchString() {
    this.filters = Object.values(this.allowedKeys)
      .reduce((acc, mapped) => ({ ...acc, [mapped]: '' }), {});
    this.keywords = [];
    this.faultyFilters = false;

    const text = this.searchString;
    const kvPattern = /([^:\s|]+)\s*:\s*([^|\s]+)/g;
    let m: RegExpExecArray | null;

    while ((m = kvPattern.exec(text)) !== null) {
      const rawKey = m[1];
      const value  = m[2];
      if (this.allowedKeys[rawKey]) {
        const mapped = this.allowedKeys[rawKey];
        this.filters[mapped] = value;
      } else {
        this.faultyFilters = true;
      }
    }

    const leftover = text.replace(/([^:\s|]+)\s*:\s*([^|\s]+)/g, '').trim();
    if (leftover) {
      this.keywords = leftover.split(/\s+/);
    }
  }

  openDialog(type: string) {
    if (type === 'filters') {
      this.dialog.open(FiltersPopupComponent);
    } else if (type === 'range') {
      this.dialog.open(MapPopupComponent);
    }
  }

  search() {
    this.mediaService.searchFilters(this.keywords, this.filters);
  }
}
