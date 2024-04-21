import { Routes } from '@angular/router';
import {AccountComponent} from "./views/account/account.component";
import {HomeComponent} from "./views/home/home.component";

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'account',
    component: AccountComponent
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
