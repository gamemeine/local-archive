import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LogoutButtonComponent } from "../logout-button/logout-button.component";
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs'
@Component({
  selector: 'app-top-bar',
  standalone: true,
  providers: [
    { provide: ActivatedRoute, useValue: { snapshot: {}, params: of({}) } }
  ],
  imports: [CommonModule, LogoutButtonComponent, RouterModule],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.scss'
})
export class TopBarComponent {

  navEntries = [
    { name: 'Przeglądaj', route: '/home' },
    { name: 'Moje zdjęcia', route: './photos' },
    { name: 'Kontakt', route: 'contact' },
    { name: 'Ustawienia', route: 'settings' }
  ];

}
