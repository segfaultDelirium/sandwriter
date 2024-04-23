import { Component, Input } from '@angular/core';
import { ISOdateStringToLocaleDate } from '../../../helpers';
import { ArticleWithoutTextAndComments } from '../types';
import { ArticleService } from '../article.service';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-author',
  standalone: true,
  imports: [JsonPipe],
  templateUrl: './author.component.html',
  styleUrl: './author.component.scss',
})
export class AuthorComponent {
  @Input() article: ArticleWithoutTextAndComments | null = null;

  readonly ISOdateStringToLocaleDate = ISOdateStringToLocaleDate;

  constructor(private articleService: ArticleService) {}

  toggleLikeArticle() {
    if (this.article === null) {
      return;
    }
    this.article.is_upvoted_by_current_user =
      !this.article.is_upvoted_by_current_user;

    if (this.article.is_upvoted_by_current_user) {
      this.article.upvotes += 1;
    } else {
      this.article.upvotes -= 1;
    }

    if (
      this.article.is_upvoted_by_current_user &&
      this.article.is_downvoted_by_current_user
    ) {
      this.article.is_downvoted_by_current_user = false;
      this.article.downvotes -= 1;
    }

    this.articleService.likeArticle(this.article.id).subscribe((x) => {
      console.log(x);
    });
  }

  toggleDislikeArticle() {
    if (this.article === null) {
      return;
    }
    this.article.is_downvoted_by_current_user =
      !this.article.is_downvoted_by_current_user;

    if (this.article.is_downvoted_by_current_user) {
      this.article.downvotes += 1;
    } else {
      this.article.downvotes -= 1;
    }

    if (
      this.article.is_downvoted_by_current_user &&
      this.article.is_upvoted_by_current_user
    ) {
      this.article.is_upvoted_by_current_user = false;
      this.article.upvotes -= 1;
    }
    this.articleService.dislikeArticle(this.article.id).subscribe((x) => {
      console.log(x);
    });
  }
}
