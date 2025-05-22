import { OnInit, Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommentService } from '../../services/comment.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Comment } from '../../interfaces/comment';
import { environment } from '../../../../environments/environment';
@Component({
  selector: 'app-photo-detail-view',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './photo-detail-view.component.html',
  styleUrl: './photo-detail-view.component.scss',
})
export class PhotoDetailViewComponent implements OnInit {
  photoId!: number;
  comments: Comment[] = [];
  picture: string = '';
  newText = '';
  photoData: any;
  constructor(
    private route: ActivatedRoute,
    private commentService: CommentService
  ) {}

  ngOnInit(): void {
    this.photoId = Number(this.route.snapshot.paramMap.get('id'));
    console.log('Załadowano zdjęcie ID:', this.photoId);
    this.loadComments();
    this.loadPicture();
  }

  loadComments() {
    this.commentService.getComments(this.photoId).subscribe((data) => {
      this.comments = data;
    });
  }

  loadPicture() {
    this.commentService.getPicture(this.photoId).subscribe((data) => {
      this.photoData = data;
      this.picture = environment.apiUrl + data.photo.file_url;
      console.log('Załadowano zdjęcie:', this.picture);
      console.log('Załadowano dane zdjęcia:', this.photoData);
    });
  }

  async addComment() {
    if (!this.newText) return;

    (
      await this.commentService.addComment(this.photoId, this.newText)
    ).subscribe(() => {
      this.newText = '';
      this.loadComments();
    });
  }
}
