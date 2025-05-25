import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyPhotoEntryComponent } from './my-photo-entry.component';

describe('MyPhotoEntryComponent', () => {
  let component: MyPhotoEntryComponent;
  let fixture: ComponentFixture<MyPhotoEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyPhotoEntryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyPhotoEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
