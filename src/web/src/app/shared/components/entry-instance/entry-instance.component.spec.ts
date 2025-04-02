import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntryInstanceComponent } from './entry-instance.component';

describe('EntryInstanceComponent', () => {
  let component: EntryInstanceComponent;
  let fixture: ComponentFixture<EntryInstanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntryInstanceComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EntryInstanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });

  // TODO: fix tests
});


