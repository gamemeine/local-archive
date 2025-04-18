import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { LoginViewComponent } from './login-view.component';
import { of } from 'rxjs';
import { AuthService } from '@auth0/auth0-angular';

describe('LoginViewComponent', () => {
  let component: LoginViewComponent;
  let fixture: ComponentFixture<LoginViewComponent>;


    const fakeActivatedRoute = {
      snapshot: {
        paramMap: convertToParamMap({}),
      },
      params: of({}),
      queryParams: of({}),
    };


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginViewComponent],
      providers: [
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        {
          provide: AuthService,
          useValue: {
            loginWithRedirect: jasmine.createSpy('loginWithRedirect'),
            logout: jasmine.createSpy('logout'),
            isAuthenticated$: of(true),
            user$: of({ name: 'Mock User' })
          }
        },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
