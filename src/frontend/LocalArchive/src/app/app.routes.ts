import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './shared/views/page-not-found/page-not-found.component';
import { LoginViewComponent } from './shared/views/login-view/login-view.component';
import { MainViewComponent } from './shared/views/main-view/main-view.component';
import { Component } from '@angular/core';
import { BrowsingViewComponent } from './shared/views/browsing-view/browsing-view.component';

export const routes: Routes = [
  {path: '', component: LoginViewComponent, pathMatch: 'full'},
  {path: 'login', component: LoginViewComponent, pathMatch: 'full'},
  {path: 'main', component: MainViewComponent, pathMatch: 'full', children: [
    {
      path: '', component: BrowsingViewComponent, pathMatch: 'full'
    },
    {
    path: 'browsing', component: BrowsingViewComponent, pathMatch: 'full'
    },
    {
      path: 'myPhotos', component: BrowsingViewComponent, pathMatch: 'full'
    }]
  },
  {path: '*', component: PageNotFoundComponent, pathMatch: 'full'},
];
