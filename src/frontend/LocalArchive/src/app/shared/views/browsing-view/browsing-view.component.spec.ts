import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowsingViewComponent } from './browsing-view.component';

describe('BrowsingViewComponent', () => {
  let component: BrowsingViewComponent;
  let fixture: ComponentFixture<BrowsingViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowsingViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BrowsingViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
