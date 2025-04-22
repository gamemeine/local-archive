import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltersPopupComponent } from './filters-popup.component';
import { DialogRef } from '@angular/cdk/dialog';
import { MarkerService } from '../../services/marker.service';

describe('FiltersPopupComponent', () => {
  let component: FiltersPopupComponent;
  let fixture: ComponentFixture<FiltersPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FiltersPopupComponent],
      providers: [
        { provide: DialogRef, useValue: {} }, // Mock DialogRef
        { provide: MarkerService, useValue: { radius: 100 } }, // Mock MarkerService
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(FiltersPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
