import { Routes } from '@angular/router';
import { AccountComponent } from './views/account/account.component';
import { ArticleListComponent } from './views/article-list/article-list.component';
import { ArticleComponent } from './views/article/article.component';
import { ArticleWriterComponent } from './views/article-writer/article-writer.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  // {
  //   path: '',
  //   // component: HomeComponent,
  //   // redirectTo: 'articles',
  // },
  {
    path: 'account',
    component: AccountComponent,
    canActivate: [authGuard],
  },
  {
    path: 'articles/by-slug/:slug',
    component: ArticleComponent,
  },
  {
    path: 'articles/write',
    component: ArticleWriterComponent,
    canActivate: [authGuard],
  },
  {
    path: 'articles',
    component: ArticleListComponent,
  },
  {
    path: '**',
    redirectTo: 'articles',
    pathMatch: 'full',
  },
];
