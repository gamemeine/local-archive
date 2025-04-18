import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { MyPhotosViewComponent } from './my-photos-view.component';
import { of } from 'rxjs';
describe('MyPhotosViewComponent', () => {
  let component: MyPhotosViewComponent;
  let fixture: ComponentFixture<MyPhotosViewComponent>;


  const fakeActivatedRoute = {
    snapshot: {
      paramMap: convertToParamMap({}),
    },
    params: of({}),
    queryParams: of({}),
  };


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyPhotosViewComponent],
      providers: [
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }
      ]
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
