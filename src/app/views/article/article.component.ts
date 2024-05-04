import { Component, OnDestroy, OnInit } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';
import { ArticleService } from './article.service';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { AuthorComponent } from './author/author.component';
import { Article } from './types';
import { ActivatedRoute } from '@angular/router';
import {
  AuthenticationService,
  User,
} from '../../services/authentication.service';
import { CommentComponent } from './comment/comment.component';

@Component({
  selector: 'app-article',
  standalone: true,
  imports: [
    MaterialModule,
    CommonModule,
    FormsModule,
    AuthorComponent,
    CommentComponent,
  ],
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
        this.commentInput = '';
      });
  }
}
