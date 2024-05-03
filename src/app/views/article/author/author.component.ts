import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ISOdateStringToLocaleDate } from '../../../helpers';
import { ArticleService } from '../article.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../material.module';
import { User } from '../../../services/authentication.service';

export type ArticleHeader = {
  articleId: string | null;
  author: User;
  likes: number;
  dislikes: number;
  isLikedByCurrentUser: boolean;
  isDislikedByCurrentUser: boolean;
  insertedAt: string;
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
  isLikedByCurrentUser: boolean = false;
  isDislikedByCurrentUser: boolean = false;
  likes: number = 0;
  dislikes: number = 0;

  readonly ISOdateStringToLocaleDate = ISOdateStringToLocaleDate;

  constructor(private articleService: ArticleService) {}

  ngOnChanges(changes: SimpleChanges) {
    const articleHeaderChanges = changes['articleHeader'];
    if (articleHeaderChanges && articleHeaderChanges.firstChange) {
      const x = articleHeaderChanges.currentValue as ArticleHeader;
      if (x !== null) {
        this.isLikedByCurrentUser = x.isLikedByCurrentUser;
        this.isDislikedByCurrentUser = x.isDislikedByCurrentUser;
        this.likes = x.likes;
        this.dislikes = x.dislikes;
      }
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

    const newIsLikedByCurrentUser = !this.isLikedByCurrentUser;

    const newLikes = this.likes + (newIsLikedByCurrentUser ? 1 : -1);

    const newIsDislikedByCurrentUser =
      newIsLikedByCurrentUser && this.isDislikedByCurrentUser
        ? false
        : this.isDislikedByCurrentUser;

    const newDislikes =
      this.dislikes +
      (newIsLikedByCurrentUser && this.isDislikedByCurrentUser ? -1 : 0);

    this.isLikedByCurrentUser = newIsLikedByCurrentUser;
    this.isDislikedByCurrentUser = newIsDislikedByCurrentUser;
    this.likes = newLikes;
    this.dislikes = newDislikes;

    if (this.articleHeader.articleId !== null) {
      this.articleService
        .likeArticle(this.articleHeader.articleId)
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

    const newIsDislikedByCurrentUser = !this.isDislikedByCurrentUser;

    const newDislikes = this.dislikes + (newIsDislikedByCurrentUser ? 1 : -1);

    const newIsLikedByCurrentUser =
      newIsDislikedByCurrentUser && this.isLikedByCurrentUser
        ? false
        : this.isLikedByCurrentUser;

    const newLikes =
      this.likes +
      (newIsDislikedByCurrentUser && this.isLikedByCurrentUser ? -1 : 0);

    if (this.articleHeader.articleId !== null) {
      this.articleService
        .dislikeArticle(this.articleHeader.articleId)
        .subscribe((x) => {
          // console.log(x);
        });
    }

    this.isLikedByCurrentUser = newIsLikedByCurrentUser;
    this.isDislikedByCurrentUser = newIsDislikedByCurrentUser;
    this.likes = newLikes;
    this.dislikes = newDislikes;
  }
}
