import { ArticleWithoutTextAndComments } from './views/article/types';
import { ArticleHeader } from './views/article/author/author.component';

export function ISOdateStringToLocaleDate(isoDateString: string) {
  const utcDate = new Date(`${isoDateString}Z`);
  const localTime = new Date(utcDate.getTime());
  const res = new Date(localTime).toLocaleString('sv');
  return res;
}

export function getCurrentISODateString() {
  const res = new Date().toISOString().slice(0, -1); // removing 'Z' from the end of date
  return res;
}

export function articleToArticleHeader(article: ArticleWithoutTextAndComments) {
  const articleHeader: ArticleHeader = {
    articleId: article.id,
    author: article.author,
    isLikedByCurrentUser: article.isLikedByCurrentUser,
    isDislikedByCurrentUser: article.isDislikedByCurrentUser,
    insertedAt: article.insertedAt,
    likes: article.likes,
    dislikes: article.dislikes,
  };
  return articleHeader;
}
