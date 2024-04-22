import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SERVER_URL } from '../../consts';
import { Observable } from 'rxjs';
import { Article, Comment } from './article.component';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  constructor(private httpClient: HttpClient) {}

  getArticle() {
    const articleSlug = 'sample-slug-3242';
    return this.httpClient.get(`${SERVER_URL}articles/${articleSlug}`, {
      withCredentials: true,
    }) as Observable<Article>;
  }

  sendComment(articleId: string, comment: string) {
    return this.httpClient.post(
      `${SERVER_URL}comments/to-article/${articleId}`,
      { comment },
      {
        withCredentials: true,
      },
    ) as Observable<Comment>;
  }

  likeArticle(articleId: string) {
    return this.httpClient.post(
      `${SERVER_URL}articles/like/${articleId}`,
      {},
      {
        withCredentials: true,
      },
    ) as Observable<any>;
  }

  dislikeArticle(articleId: string) {
    return this.httpClient.post(
      `${SERVER_URL}articles/dislike/${articleId}`,
      {},
      {
        withCredentials: true,
      },
    ) as Observable<any>;
  }
}
