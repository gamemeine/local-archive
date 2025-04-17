import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LogoutButtonComponent } from "../logout-button/logout-button.component";

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [CommonModule, LogoutButtonComponent],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.scss'
})
export class TopBarComponent {

  navEntries = [
    { name: 'Przeglądaj', route: '/main' },
    { name: 'Moje zdjęcia', route: '/about' },
    { name: 'Kontakt', route: '/contact' },
    { name: 'Ustawienia', route: '/settings' }
  ];

}
