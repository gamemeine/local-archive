import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TopBarComponent } from './top-bar.component';
import { AuthService } from '@auth0/auth0-angular';
import { of } from 'rxjs';
import { ActivatedRoute, convertToParamMap } from '@angular/router';

describe('TopBarComponent', () => {
  let component: TopBarComponent;
  let fixture: ComponentFixture<TopBarComponent>;

  const fakeAuthService = {
    loginWithRedirect: jasmine.createSpy('loginWithRedirect'),
    logout: jasmine.createSpy('logout'),
    isAuthenticated$: of(false),
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
      imports: [TopBarComponent],
      providers: [{ provide: AuthService, useValue: fakeAuthService },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TopBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
