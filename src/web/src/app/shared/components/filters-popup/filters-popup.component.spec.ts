import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltersPopupComponent } from './filters-popup.component';

describe('FiltersPopupComponent', () => {
  let component: FiltersPopupComponent;
  let fixture: ComponentFixture<FiltersPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FiltersPopupComponent]
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
