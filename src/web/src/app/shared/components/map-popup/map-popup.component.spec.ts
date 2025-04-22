import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapPopupComponent } from './map-popup.component';
import { DialogRef } from '@angular/cdk/dialog';
import { MarkerService } from '../../services/marker.service';

describe('MapPopupComponent', () => {
  let component: MapPopupComponent;
  let fixture: ComponentFixture<MapPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapPopupComponent],
      providers: [
        { provide: DialogRef, useValue: {} }, // Mock DialogRef
        { provide: MarkerService, useValue: { radius: 100 } }, // Mock MarkerService
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
