import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';
import { ArticleService } from './article.service';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { AuthorComponent } from './author/author.component';
import { ISOdateStringToLocaleDate } from '../../helpers';
import { Article } from './types';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-article',
  standalone: true,
  imports: [MaterialModule, CommonModule, FormsModule, AuthorComponent],
  templateUrl: './article.component.html',
  styleUrl: './article.component.scss',
})
export class ArticleComponent implements OnInit {
  // sampleArticle
  // article: Article | null = sampleArticle;
  articleSlug: string = '';
  article: Article | null = null;
  articleSubscription?: Subscription;
  areCommentsVisible: boolean = false;

  commentInput: string = '';
  isCommentInputVisible = false;
  readonly ISOdateStringToLocaleDate = ISOdateStringToLocaleDate;

  constructor(
    private articleService: ArticleService,
    private route: ActivatedRoute,
  ) {
    this.route.params.subscribe((params) => {
      this.articleSlug = params['slug'];
    });
  }

  ngOnInit() {
    this.getArticle(this.articleSlug);
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

  showCommentInput() {
    this.isCommentInputVisible = true;
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
}
