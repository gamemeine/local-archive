import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [CommonModule],
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
