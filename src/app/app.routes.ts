import { Routes } from '@angular/router';
import { AccountComponent } from './views/account/account.component';
import { HomeComponent } from './views/home/home.component';
import { ArticleListComponent } from './views/article-list/article-list.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'account',
    component: AccountComponent,
  },
  {
    path: 'articles',
    component: ArticleListComponent,
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
