import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './shared/views/page-not-found/page-not-found.component';
// import { LoginViewComponent } from './shared/views/login-view/login-view.component';
import { MainViewComponent } from './shared/views/main-view/main-view.component';
import { BrowsingViewComponent } from './shared/views/browsing-view/browsing-view.component';
import { HomeScreenComponent } from './shared/views/home-screen/home-screen.component';
import { AuthGuard } from '@auth0/auth0-angular';


export const routes: Routes = [
  // {path: '', component: LoginViewComponent, pathMatch: 'full'},
  // {path: 'login', component: LoginViewComponent, pathMatch: 'full'},
  { path: '', component: HomeScreenComponent },
  {
    path: 'home',
    component: MainViewComponent,
    pathMatch: 'full',
    children: [
      {
        path: '',
        component: BrowsingViewComponent,
        pathMatch: 'full',
      },
      {
        path: 'browsing',
        component: BrowsingViewComponent,
        pathMatch: 'full',
      },
      {
        path: 'myPhotos',
        component: BrowsingViewComponent,
        pathMatch: 'full',
      },
    ],
    canActivate: [AuthGuard],
  },
  { path: '*', component: PageNotFoundComponent, pathMatch: 'full' },
];
