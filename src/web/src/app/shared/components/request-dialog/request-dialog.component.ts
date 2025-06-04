import { DialogModule } from '@angular/cdk/dialog';
import { Component, Input, OnInit } from '@angular/core';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Router, RouterModule } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { User } from '@auth0/auth0-angular';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-request-dialog',
  standalone: true,
  imports: [DialogModule, RouterModule, FormsModule],
  templateUrl: './request-dialog.component.html',
  styleUrl: './request-dialog.component.scss',
})
export class RequestDialogComponent implements OnInit {
  constructor(
    private dialogRef: DialogRef<RequestDialogComponent>,
    private http: HttpClient,
    private router: Router,
    private userService: UsersService,
    @Inject(DIALOG_DATA) public data: { mediaID: any }
  ) {}

  async ngOnInit(): Promise<void> {
    this.user = await this.userService.getCurrentUser();
  }

  @Input() mediaID: any;

  body = {
    justification: '',
  };

  user: User | null = null;

  closeDialog() {
    this.dialogRef.close(); // You can also pass data here
  }

  sendRequest() {
    if (!this.user?.['id']) {
      alert('Nie można wysłać prośby – brak użytkownika');
      return;
    }
    const body = {
      user_id: this.user?.['id'],
      justification:
        this.body.justification ||
        'Brak uzasadnienia podanego przez użytkownika',
    };
    console.log('Wysyłane PATCH body:', body);

    this.http
      .post(
        `${environment.apiUrl}/media/access-request/${this.data.mediaID}`,
        body
      )
      .subscribe({
        next: () => {
          alert('Wysłano prośbę o dostęp');
        },
        error: (err) => {
          alert('Nie udało się wysłać prośby: ' + err.message);
        },
      });
  }
}
