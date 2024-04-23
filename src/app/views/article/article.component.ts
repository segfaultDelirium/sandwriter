import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';
import { ArticleService } from './article.service';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { AuthorComponent } from './author/author.component';
import { ISOdateStringToLocaleDate } from '../../helpers';
import { Article } from './types';

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
  article: Article | null = null;
  articleSubscription?: Subscription;
  areCommentsVisible: boolean = false;

  commentInput: string = '';
  isCommentInputVisible = false;
  readonly ISOdateStringToLocaleDate = ISOdateStringToLocaleDate;

  constructor(private articleService: ArticleService) {}

  ngOnInit() {
    this.getArticle();
  }

  getArticle() {
    this.articleSubscription = this.articleService
      .getArticle()
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
