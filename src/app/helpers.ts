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
    article_id: article.id,
    display_name: article.author.display_name ?? '',
    is_upvoted_by_current_user: article.is_upvoted_by_current_user,
    is_downvoted_by_current_user: article.is_downvoted_by_current_user,
    inserted_at: article.inserted_at,
    upvotes: article.upvotes,
    downvotes: article.downvotes,
  };
  return articleHeader;
}
