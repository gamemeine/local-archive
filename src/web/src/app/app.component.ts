import { HttpClientModule } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { filter, take } from 'rxjs/operators';
import { UsersService } from './shared/services/users.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrls: [
    './app.component.scss',
    '../../node_modules/mapbox-gl/dist/mapbox-gl.css',
  ],
})
export class AppComponent implements OnInit {
  title = 'LocalArchive';

  private auth = inject(AuthService);
  private userService = inject(UsersService);

  ngOnInit(): void {
    this.auth.isAuthenticated$
      .pipe(
        filter((isAuthenticated) => isAuthenticated),
        take(1)
      )
      .subscribe(async () => { 
        try {
          await this.userService.ensureUserExists();
        } catch (error) {
          console.error('Error ensuring user exists:', error);
        }
      });
  }
}
