import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-logout-button',
  standalone: true,
  template: '<button (click)="auth.logout()">Log out</button>',
})
export class LogoutButtonComponent {
  constructor(public auth: AuthService) {}
}
