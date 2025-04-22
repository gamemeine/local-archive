import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogRef } from '@angular/cdk/dialog';

@Component({
  selector: 'app-filters-popup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filters-popup.component.html',
  styleUrl: './filters-popup.component.scss'
})
export class FiltersPopupComponent {
    fromYear: number = 2025;
    toYear: number = 2025;
    fromMonth: number = 1;
    toMonth: number = 12;
    town: string = '';
    country: string = '';
    state: string = '';
    constructor(private dialogRef: DialogRef<FiltersPopupComponent>) {}

    onFiltersChange() {
        // Emit the filter change event with the selected values
        const filterValues = {
            fromYear: this.fromYear,
            toYear: this.toYear,
            fromMonth: this.fromMonth,
            toMonth: this.toMonth
        };
        console.log('Filter values changed:', filterValues);
    }

    closeDialog() {
      this.dialogRef.close(); // You can also pass data here
    }
}
