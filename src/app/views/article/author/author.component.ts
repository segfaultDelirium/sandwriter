import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ISOdateStringToLocaleDate } from '../../../helpers';
import { ArticleService } from '../article.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../material.module';

export type ArticleHeader = {
  article_id: string | null;
  display_name: string;
  is_upvoted_by_current_user: boolean;
  is_downvoted_by_current_user: boolean;
  inserted_at: string;
  upvotes: number;
  downvotes: number;
};

@Component({
  selector: 'app-author',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MaterialModule, CommonModule],
  templateUrl: './author.component.html',
  styleUrl: './author.component.scss',
})
export class AuthorComponent implements OnChanges {
  @Input() articleHeader: ArticleHeader | null = null;
  @Input() isLikeDislikeDisabled: boolean = false;

  // it has to be this retarded because angular does not detect articleHeader changes either by modifying object or by reassignment
  is_upvoted_by_current_user: boolean = false;
  is_downvoted_by_current_user: boolean = false;
  upvotes: number = 0;
  downvotes: number = 0;

  readonly ISOdateStringToLocaleDate = ISOdateStringToLocaleDate;

  constructor(private articleService: ArticleService) {}

  ngOnChanges(changes: SimpleChanges) {
    const articleHeaderChanges = changes['articleHeader'];
    if (articleHeaderChanges && articleHeaderChanges.firstChange) {
      const x = articleHeaderChanges.currentValue;
      this.is_upvoted_by_current_user = x.is_upvoted_by_current_user;
      this.is_downvoted_by_current_user = x.is_downvoted_by_current_user;
      this.upvotes = x.upvotes;
      this.downvotes = x.downvotes;
    }
  }

  toggleLikeArticle() {
    console.log('hello from toggleLikeArticle');
    if (this.isLikeDislikeDisabled) {
      console.log('isLikeDislikeDisabled true');
      return;
    }
    if (this.articleHeader === null) {
      console.log('articleHeader is null');
      return;
    }

    const new_is_upvoted_by_current_user = !this.is_upvoted_by_current_user;

    const newUpvotes = this.upvotes + (new_is_upvoted_by_current_user ? 1 : -1);

    const new_is_downvoted_by_current_user =
      new_is_upvoted_by_current_user && this.is_downvoted_by_current_user
        ? false
        : this.is_downvoted_by_current_user;

    const newDownvotes =
      this.downvotes +
      (new_is_upvoted_by_current_user && this.is_downvoted_by_current_user
        ? -1
        : 0);

    this.is_upvoted_by_current_user = new_is_upvoted_by_current_user;
    this.is_downvoted_by_current_user = new_is_downvoted_by_current_user;
    this.upvotes = newUpvotes;
    this.downvotes = newDownvotes;

    if (this.articleHeader.article_id !== null) {
      this.articleService
        .likeArticle(this.articleHeader.article_id)
        .subscribe((x) => {
          // console.log(x);
        });
    }
  }

  toggleDislikeArticle() {
    console.log('hello from toggleDislikeArticle');
    if (this.isLikeDislikeDisabled) {
      console.log('isLikeDislikeDisabled true');
      return;
    }
    if (this.articleHeader === null) {
      console.log('articleHeader is null');
      return;
    }

    const new_is_downvoted_by_current_user = !this.is_downvoted_by_current_user;

    const newDownvotes =
      this.downvotes + (new_is_downvoted_by_current_user ? 1 : -1);

    const new_is_upvoted_by_current_user =
      new_is_downvoted_by_current_user && this.is_upvoted_by_current_user
        ? false
        : this.is_upvoted_by_current_user;

    const newUpvotes =
      this.upvotes +
      (new_is_downvoted_by_current_user && this.is_upvoted_by_current_user
        ? -1
        : 0);

    if (this.articleHeader.article_id !== null) {
      this.articleService
        .dislikeArticle(this.articleHeader.article_id)
        .subscribe((x) => {
          // console.log(x);
        });
    }

    this.is_upvoted_by_current_user = new_is_upvoted_by_current_user;
    this.is_downvoted_by_current_user = new_is_downvoted_by_current_user;
    this.upvotes = newUpvotes;
    this.downvotes = newDownvotes;
  }
}
