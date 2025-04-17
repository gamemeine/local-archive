import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './shared/views/page-not-found/page-not-found.component';
import { LoginViewComponent } from './shared/views/login-view/login-view.component';
import { MainViewComponent } from './shared/views/main-view/main-view.component';
import { BrowsingViewComponent } from './shared/views/browsing-view/browsing-view.component';
// Removed unused imports for HomeScreenComponent and AuthGuard
import { AuthGuard } from '@auth0/auth0-angular';
import { MyPhotosViewComponent } from './shared/views/my-photos-view/my-photos-view.component';


export const routes: Routes = [
  {path: '', component: LoginViewComponent, pathMatch: 'full'},
  // {path: 'login', component: LoginViewComponent, pathMatch: 'full'},
  // { path: '', component: HomeScreenComponent },
  {
    path: 'home',
    component: MainViewComponent,
    // component: BrowsingViewComponent,
    children: [
      {
        path: '',
        component: BrowsingViewComponent,
      },
      {
        path: 'browsing',
        component: BrowsingViewComponent,
      },
      {
        path: 'photos',
        component: MyPhotosViewComponent,
      },
      { path: '**',
        component: PageNotFoundComponent,
      },
    ],
    canActivate: [AuthGuard],
  },

  { path: '**', component: PageNotFoundComponent, pathMatch: 'full' }
]


