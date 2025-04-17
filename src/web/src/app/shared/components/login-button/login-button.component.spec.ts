import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginButtonComponent } from './login-button.component';
import { AuthService } from '@auth0/auth0-angular';

describe('LoginButtonComponent', () => {
  let component: LoginButtonComponent;
  let fixture: ComponentFixture<LoginButtonComponent>;
  let authServiceMock: Partial<AuthService>;

  beforeEach(async () => {
    authServiceMock = {
      loginWithRedirect: jasmine.createSpy('loginWithRedirect'),
    };

    await TestBed.configureTestingModule({
      imports: [LoginButtonComponent],
      providers: [{ provide: AuthService, useValue: authServiceMock }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call loginWithRedirect when login button is clicked', () => {
    component.login();
    expect(authServiceMock.loginWithRedirect).toHaveBeenCalledWith({
      appState: { target: '/home' },
    });
  });
});
