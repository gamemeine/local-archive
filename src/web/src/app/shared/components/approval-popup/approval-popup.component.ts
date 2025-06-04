import { DialogModule } from '@angular/cdk/dialog';
import { Component, OnInit } from '@angular/core';
import { DialogRef } from '@angular/cdk/dialog';
import { Router, RouterModule } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-approval-popup',
  standalone: true,
  imports: [DialogModule, RouterModule],
  templateUrl: './approval-popup.component.html',
  styleUrl: './approval-popup.component.scss',
})
export class ApprovalPopupComponent implements OnInit {
  constructor(
    private dialogRef: DialogRef<ApprovalPopupComponent>,
    private router: Router
  ) {}

  closeDialog() {
    this.dialogRef.close(); // You can also pass data here
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.router.navigate(['/home']);
      this.closeDialog();
    }, 3000);
  }
}
