import { Component } from '@angular/core';
import { RequestComponent } from '../../components/request/request.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-my-requests',
  standalone: true,
  imports: [RequestComponent, CommonModule, FormsModule],
  templateUrl: './my-requests.component.html',
  styleUrl: './my-requests.component.scss',
})
export class MyRequestsComponent {
  requests: any[] = [
    {
      id: 1,
      title: 'Request 1',
      description: 'Description for request 1',
      status: 'Pending',
      createdAt: new Date(),
    },
    {
      id: 2,
      title: 'Request 2',
      description: 'Description for request 2',
      status: 'Approved',
      createdAt: new Date(),
    },
    {
      id: 3,
      title: 'Request 3',
      description: 'Description for request 3',
      status: 'Rejected',
      createdAt: new Date(),
    },
  ]; // Replace 'any' with the appropriate type for your requests
}
