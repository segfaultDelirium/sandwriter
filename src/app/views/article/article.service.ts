import { Injectable } from '@angular/core';
import { SERVER_URL } from '../../consts';
import { Observable } from 'rxjs';
import { Article, ArticleWithoutTextAndComments, Comment } from './types';
import { Section } from '../article-writer/article-writer.component';
import { HttpService } from '../../services/http.service';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  constructor(private httpService: HttpService) {}

  getArticle(slug: string) {
    return this.httpService.get(
      `${SERVER_URL}articles/${slug}`,
    ) as Observable<Article>;
  }

  sendComment(articleId: string, comment: string) {
    return this.httpService.post(
      `${SERVER_URL}comments/to-article/${articleId}`,
      { comment },
    ) as Observable<Comment>;
  }

  likeArticle(articleId: string) {
    return this.httpService.post(
      `${SERVER_URL}articles/like/${articleId}`,
      {},
    ) as Observable<any>;
  }

  dislikeArticle(articleId: string) {
    return this.httpService.post(
      `${SERVER_URL}articles/dislike/${articleId}`,
      {},
    ) as Observable<any>;
  }

  getArticlesWithoutTextAndComments() {
    return this.httpService.get(
      `${SERVER_URL}articles/without-text-and-comments/all`,
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
    return this.httpService.post(
      `${SERVER_URL}articles/`,
      body,
    ) as Observable<any>;
  }

  // should receive back image uuid
  uploadImage(title: string, formData: FormData) {
    const body = formData;
    return this.httpService.post(
      `${SERVER_URL}images`,
      body,
    ) as Observable<any>;
  }
}
