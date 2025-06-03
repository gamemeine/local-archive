import { Component } from '@angular/core';
import { Input } from '@angular/core';

@Component({
  selector: 'app-request',
  standalone: true,
  imports: [],
  templateUrl: './request.component.html',
  styleUrl: './request.component.scss',
})
export class RequestComponent {
  @Input() data: any;
}
