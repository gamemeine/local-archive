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

  newAuthor = '';
  newText = '';

  constructor(private route: ActivatedRoute, private commentService : CommentService) {}

  ngOnInit(): void {
    this.photoId = Number(this.route.snapshot.paramMap.get('id'));
    console.log('Załadowano zdjęcie ID:', this.photoId);
  }

  loadComments() {
    this.commentService.getComments(this.photoId).subscribe((data) => {
      this.comments = data;
    });
  }

  addComment() {
    if (!this.newAuthor || !this.newText) return;

    const newComment = { author: this.newAuthor, text: this.newText };

    this.commentService.addComment(this.photoId, newComment).subscribe(() => {
      this.newAuthor = '';
      this.newText = '';
      this.loadComments();
    });
  }
}
