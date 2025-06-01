// /src/web/src/app/app.routes.ts
// Angular application routes configuration.

import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './shared/views/page-not-found/page-not-found.component';
import { LoginViewComponent } from './shared/views/login-view/login-view.component';
import { MainViewComponent } from './shared/views/main-view/main-view.component';
import { BrowsingViewComponent } from './shared/views/browsing-view/browsing-view.component';
import { AuthGuard } from '@auth0/auth0-angular';
import { MyPhotosViewComponent } from './shared/views/my-photos-view/my-photos-view.component';
import { AddPhotoComponent } from './shared/views/add-photo/add-photo.component';
import { PhotoDetailViewComponent } from './shared/views/photo-detail-view/photo-detail-view.component';
import { BrowseMyPhotosViewComponent } from './shared/views/browse-my-photos-view/browse-my-photos-view.component';

export const routes: Routes = [
  { path: '', component: LoginViewComponent, pathMatch: 'full' },
  {
    path: 'home',
    component: MainViewComponent,
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
      {
        path: 'photo/:id',
        component: PhotoDetailViewComponent,
      },
      {
        path: 'add-photos',
        component: AddPhotoComponent
      },
      {
        path: 'browse-my-photos',
        component: BrowseMyPhotosViewComponent,
      },
      {
        path: '**',
        component: PageNotFoundComponent,
      },
    ],
    canActivate: [AuthGuard],
  },
  { path: '**', component: PageNotFoundComponent, pathMatch: 'full' }
];