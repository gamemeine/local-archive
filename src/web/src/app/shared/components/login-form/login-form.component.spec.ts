import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { LoginFormComponent } from './login-form.component';
import { AuthService } from '@auth0/auth0-angular';
import { of } from 'rxjs';

describe('LoginFormComponent', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;


  const fakeActivatedRoute = {
    snapshot: {
      paramMap: convertToParamMap({}),
    },
    params: of({}),
    queryParams: of({}),
  };


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginFormComponent],
      providers: [
        {
          provide: AuthService,
          useValue: {
            loginWithRedirect: jasmine.createSpy('loginWithRedirect'),
            logout: jasmine.createSpy('logout'),
            isAuthenticated$: of(true),
            user$: of({ name: 'Mock User' })
          }
        },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
