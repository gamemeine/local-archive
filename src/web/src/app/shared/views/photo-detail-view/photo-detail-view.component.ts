import { OnInit, Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-photo-detail-view',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './photo-detail-view.component.html',
//   styleUrl: './my-photos-view.component.scss' TODO add this later
})
export class PhotoDetailViewComponent implements OnInit {
  photoId!: number;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.photoId = Number(this.route.snapshot.paramMap.get('id'));
    console.log('Załadowano zdjęcie ID:', this.photoId);
  }
}
