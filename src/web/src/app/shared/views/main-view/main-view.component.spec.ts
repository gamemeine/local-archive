import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainViewComponent } from './main-view.component';
import { AuthService } from '@auth0/auth0-angular';
import { of } from 'rxjs';
import { ActivatedRoute, convertToParamMap } from '@angular/router';

describe('MainViewComponent', () => {
  let component: MainViewComponent;
  let fixture: ComponentFixture<MainViewComponent>;

  const fakeAuthService = {
    loginWithRedirect: jasmine.createSpy('loginWithRedirect'),
    logout: jasmine.createSpy('logout'),
    isAuthenticated$: of(false),
    isLoading$: of(false),
  };

  const fakeActivatedRoute = {
    snapshot: {
      paramMap: convertToParamMap({}),
    },
    params: of({}),
    queryParams: of({}),
  };


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainViewComponent],
      providers: [{ provide: AuthService, useValue: fakeAuthService },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MainViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
