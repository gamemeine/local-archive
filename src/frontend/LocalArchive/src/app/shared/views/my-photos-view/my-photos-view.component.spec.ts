import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyPhotosViewComponent } from './my-photos-view.component';

describe('MyPhotosViewComponent', () => {
  let component: MyPhotosViewComponent;
  let fixture: ComponentFixture<MyPhotosViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyPhotosViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MyPhotosViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
