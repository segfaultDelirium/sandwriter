import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SERVER_URL } from '../../consts';
import { Observable } from 'rxjs';
import { Article, ArticleWithoutTextAndComments, Comment } from './types';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  constructor(private httpClient: HttpClient) {}

  getArticle(slug: string) {
    return this.httpClient.get(`${SERVER_URL}articles/${slug}`, {
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

  getArticlesWithoutTextAndComments() {
    return this.httpClient.get(
      `${SERVER_URL}articles/without-text-and-comments/all`,
      {
        withCredentials: true,
      },
    ) as Observable<ArticleWithoutTextAndComments[]>;
  }

  postArticle(title: string, text: string) {
    const body = {
      title,
      text,
    };
    return this.httpClient.post(`${SERVER_URL}articles/create/`, body, {
      withCredentials: true,
    }) as Observable<any>;
  }

  // should receive back image uuid
  uploadImage(title: string, formData: FormData) {
    const queryString = new URLSearchParams({
      title: title,
    });
    const body = formData;
    return this.httpClient.post(`${SERVER_URL}images?${queryString}"}`, body, {
      withCredentials: true,
    }) as Observable<any>;
  }
}
