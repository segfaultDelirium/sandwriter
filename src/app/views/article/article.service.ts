import { Injectable } from '@angular/core';
import { SERVER_URL } from '../../consts';
import { map, Observable } from 'rxjs';
import { Article, ArticleWithoutTextAndComments, Comment } from './types';
import { Section } from '../article-writer/article-writer.component';
import { HttpService } from '../../services/http.service';

function addCommentProperties(comment: Comment): Comment {
  return {
    ...comment,
    hasOpenReplyBox: false,
    replyText: '',
    isShortenedTextVisible: true,
    areRepliesVisible: false,
  };
}

function addCommentPropertiesToAllCommentsInArticle(article: Article): Article {
  return {
    ...article,
    comments: article.comments.map(addCommentProperties),
  };
}

function sortCommentsByDateDescending(article: Article): Article {
  return {
    ...article,
    comments: article.comments.sort((a, b) => {
      const aDate = new Date(a.insertedAt).getTime();
      const bDate = new Date(b.insertedAt).getTime();
      return aDate < bDate ? 1 : -1;
    }),
  };
}

function addRepliesRec(comment: Comment, replies: Comment[]): Comment {
  const repliesToThisComment = replies.filter(
    (reply) => reply.repliesTo === comment.id,
  );
  return {
    ...comment,
    replies: repliesToThisComment.map((reply) => addRepliesRec(reply, replies)),
  };
}

function makeCommentsHierarchical(article: Article) {
  const topComments = article.comments.filter(
    (comment) => comment.repliesTo === null,
  );
  const replies = article.comments.filter(
    (comment) => comment.repliesTo !== null,
  );

  const topCommentsWithReplies = topComments.map((comment) => {
    return addRepliesRec(comment, replies);
  });
  return {
    ...article,
    comments: topCommentsWithReplies,
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
    ).pipe(
      map(addCommentPropertiesToAllCommentsInArticle),
      map(sortCommentsByDateDescending),
      map(makeCommentsHierarchical),
    );
  }

  sendComment(articleId: string, commentText: string) {
    return (
      this.httpService.post(`${SERVER_URL}comments/${articleId}`, {
        comment: commentText,
      }) as Observable<Comment>
    ).pipe(map(addCommentProperties));
  }

  sendReplyToComment(
    articleId: string,
    commentId: string,
    commentText: string,
  ) {
    return (
      this.httpService.post(
        `${SERVER_URL}comments/${articleId}/reply-to/${commentId}`,
        {
          comment: commentText,
        },
      ) as Observable<Comment>
    ).pipe(map(addCommentProperties));
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
