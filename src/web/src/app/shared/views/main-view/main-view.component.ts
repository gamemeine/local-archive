import { Component } from '@angular/core';
import { TopBarComponent } from '../../components/top-bar/top-bar.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
@Component({
  selector: 'app-main-view',
  standalone: true,
  providers: [
    { provide: ActivatedRoute, useValue: { snapshot: {}, params: of({}) } }
  ],
  imports: [CommonModule, TopBarComponent, RouterModule],
  templateUrl: './main-view.component.html',
  styleUrl: './main-view.component.scss'
})
export class MainViewComponent {

}
