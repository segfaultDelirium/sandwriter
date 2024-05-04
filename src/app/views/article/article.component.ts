import { Component, OnDestroy, OnInit } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';
import { ArticleService } from './article.service';
import { firstValueFrom, Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { AuthorComponent } from './author/author.component';
import { ISOdateStringToLocaleDate } from '../../helpers';
import { Article, Comment } from './types';
import { ActivatedRoute } from '@angular/router';
import {
  AuthenticationService,
  User,
} from '../../services/authentication.service';

@Component({
  selector: 'app-article',
  standalone: true,
  imports: [MaterialModule, CommonModule, FormsModule, AuthorComponent],
  templateUrl: './article.component.html',
  styleUrl: './article.component.scss',
})
export class ArticleComponent implements OnInit, OnDestroy {
  articleSlug: string = '';
  article: Article | null = null;
  articleSubscription?: Subscription;
  areCommentsVisible: boolean = false;

  commentInput: string = '';
  user: User | null = null;
  userSubscription?: Subscription;

  readonly ISOdateStringToLocaleDate = ISOdateStringToLocaleDate;

  constructor(
    private articleService: ArticleService,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
  ) {
    this.route.params.subscribe((params) => {
      this.articleSlug = params['slug'];
    });
  }

  ngOnInit() {
    this.getArticle(this.articleSlug);
    this.userSubscription =
      this.authenticationService.userDataMessage$.subscribe(
        (user) => (this.user = user),
      );
  }

  ngOnDestroy() {
    this.userSubscription?.unsubscribe();
  }

  getArticle(articleSlug: string) {
    this.articleSubscription = this.articleService
      .getArticle(articleSlug)
      .subscribe((article) => {
        this.article = article;
        console.log(article);
      });
  }

  toggleComments() {
    this.areCommentsVisible = !this.areCommentsVisible;
  }

  sendComment() {
    if (this.article === null) {
      return;
    }
    this.areCommentsVisible = true;
    this.articleService
      .sendComment(this.article.id, this.commentInput)
      .subscribe((comment) => {
        if (this.article === null) {
          return;
        }
        this.article.comments = [comment, ...this.article.comments];
      });
  }

  isUserLoggedIn() {
    return this.user !== null;
  }

  toggleOpenReplyBoxBelow(comment: Comment) {
    comment.hasOpenReplyBox = !comment.hasOpenReplyBox;
  }

  async toggleLikeComment(comment: Comment) {
    if (!this.isUserLoggedIn()) return;

    const newIsLikedByCurrentUser = !comment.isLikedByCurrentUser;
    const newLikes = comment.likes + (newIsLikedByCurrentUser ? 1 : -1);
    const newIsDislikedByCurrentUser = false;
    const newDislikes =
      comment.dislikes +
      (newIsLikedByCurrentUser && comment.isDislikedByCurrentUser ? -1 : 0);
    comment.isLikedByCurrentUser = newIsLikedByCurrentUser;
    comment.likes = newLikes;
    comment.isDislikedByCurrentUser = newIsDislikedByCurrentUser;
    comment.dislikes = newDislikes;

    await firstValueFrom(this.articleService.likeComment(comment.id));
  }

  async toggleDislikeComment(comment: Comment) {
    if (!this.isUserLoggedIn()) return;

    const newIsDislikedByCurrentUser = !comment.isDislikedByCurrentUser;
    const newDislikes =
      comment.dislikes + (newIsDislikedByCurrentUser ? 1 : -1);
    const newIsLikedByCurrentUser = false;
    const newLikes =
      comment.likes +
      (newIsDislikedByCurrentUser && comment.isLikedByCurrentUser ? -1 : 0);
    comment.isLikedByCurrentUser = newIsLikedByCurrentUser;
    comment.likes = newLikes;
    comment.isDislikedByCurrentUser = newIsDislikedByCurrentUser;
    comment.dislikes = newDislikes;

    await firstValueFrom(this.articleService.dislikeComment(comment.id));
  }

  async sendReply(comment: Comment) {
    if (this.article === null) return;
    await firstValueFrom(
      this.articleService.sendReplyToComment(
        this.article.id,
        comment.id,
        comment.replyText,
      ),
    );
  }
}
