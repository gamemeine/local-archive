import { Component } from '@angular/core';
import { LoginButtonComponent } from "../../components/login-button/login-button.component";

@Component({
  selector: 'app-home-screen',
  standalone: true,
  imports: [LoginButtonComponent],
  templateUrl: './home-screen.component.html',
  styleUrl: './home-screen.component.scss',
})
export class HomeScreenComponent {
}
