import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SERVER_URL } from '../../consts';
import { Observable } from 'rxjs';
import { Article, ArticleWithoutTextAndComments, Comment } from './types';
import { Section } from '../article-writer/article-writer.component';

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

  postArticle(title: string, sections: Section[]) {
    const sectionsWithoutBase64Images = sections.map((section, i) => {
      return {
        sectionType: section.sectionType,
        sectionIndex: i,
        text: section.text,
        imageId: section.imageId,
        imageTitle: section.imageTitle,
      };
    });
    const body = {
      title,
      sections: sectionsWithoutBase64Images,
    };
    return this.httpClient.post(`${SERVER_URL}articles/`, body, {
      withCredentials: true,
    }) as Observable<any>;
  }

  // should receive back image uuid
  uploadImage(title: string, formData: FormData) {
    const body = formData;
    return this.httpClient.post(`${SERVER_URL}images`, body, {
      withCredentials: true,
    }) as Observable<any>;
  }
}
