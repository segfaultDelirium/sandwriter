import { Injectable } from '@angular/core';
import { SERVER_URL } from '../../consts';
import { map, Observable } from 'rxjs';
import { Article, ArticleWithoutTextAndComments, Comment } from './types';
import { Section } from '../article-writer/article-writer.component';
import { HttpService } from '../../services/http.service';

function addHasOpenReplyBoxProperty(comment: Comment): Comment {
  return {
    ...comment,
    hasOpenReplyBox: false,
    replyText: '',
  };
}

function addHasOpenReplyBoxPropertyToAllCommentsInArticle(
  article: Article,
): Article {
  return {
    ...article,
    comments: article.comments.map(addHasOpenReplyBoxProperty),
  };
}

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  constructor(private httpService: HttpService) {}

  getArticle(slug: string) {
    return (
      this.httpService.get(
        `${SERVER_URL}articles/${slug}`,
      ) as Observable<Article>
    ).pipe(map(addHasOpenReplyBoxPropertyToAllCommentsInArticle));
  }

  sendComment(articleId: string, commentText: string) {
    return this.httpService.post(`${SERVER_URL}comments/${articleId}`, {
      comment: commentText,
    }) as Observable<Comment>;
  }

  sendReplyToComment(
    articleId: string,
    commentId: string,
    commentText: string,
  ) {
    return this.httpService.post(
      `${SERVER_URL}comments/${articleId}/reply-to/${commentId}`,
      {
        comment: commentText,
      },
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

  likeComment(commentId: string) {
    return this.httpService.post(`${SERVER_URL}comments/like/${commentId}`, {});
  }

  dislikeComment(commentId: string) {
    return this.httpService.post(
      `${SERVER_URL}comments/dislike/${commentId}`,
      {},
    );
  }
}
