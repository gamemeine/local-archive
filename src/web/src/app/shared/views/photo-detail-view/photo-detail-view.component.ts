import { OnInit, Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommentService } from '../../services/comment.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Comment } from '../../interfaces/comment'

@Component({
  selector: 'app-photo-detail-view',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './photo-detail-view.component.html',
})
export class PhotoDetailViewComponent implements OnInit {
  photoId!: number;
  comments: Comment[] = [];

  newText = '';

  constructor(private route: ActivatedRoute, private commentService : CommentService) {}

  ngOnInit(): void {
    this.photoId = Number(this.route.snapshot.paramMap.get('id'));
    console.log('Załadowano zdjęcie ID:', this.photoId);
    this.loadComments()
  }

  loadComments() {
    this.commentService.getComments(this.photoId).subscribe((data) => {
      this.comments = data;
    });
  }

  addComment() {
    if (!this.newText) return;

    this.commentService.addComment(this.photoId, this.newText).subscribe(() => {
      this.newText = '';
      this.loadComments();
    });
  }
}
