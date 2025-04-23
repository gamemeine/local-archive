import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LoginButtonComponent } from '../login-button/login-button.component';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-login-form',
  standalone: true,

  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss'
})
export class LoginFormComponent {

  username : string = '';
  password : string = '';
  constructor(public auth: AuthService, private router: Router) {}

  login(): void {
    this.auth.loginWithRedirect({
      appState: { target: '/home' },
    });
  }


  navigateTo(route: string) {
    this.router.navigate([route]);
    console.log(`Navigating to ${route}`);
  }
}
