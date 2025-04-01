import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

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

  constructor(private router: Router) {}

  navigateTo(route: string) {
    this.router.navigate([route]);
    console.log(`Navigating to ${route}`);
  }
}
