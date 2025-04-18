import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
@Component({
  selector: 'app-my-photos-view',
  standalone: true,
  providers: [
      { provide: ActivatedRoute, useValue: { snapshot: {}, params: of({}) } }
    ],
  imports: [RouterModule],
  templateUrl: './my-photos-view.component.html',
  styleUrl: './my-photos-view.component.scss'
})
export class MyPhotosViewComponent {

}
