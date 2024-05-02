import { Component, OnInit } from '@angular/core';
import { ArticleService } from '../article/article.service';
import { ArticleWithoutTextAndComments } from '../article/types';
import { AuthorComponent } from '../article/author/author.component';
import { MaterialModule } from '../../material.module';
import { Router } from '@angular/router';
import { articleToArticleHeader } from '../../helpers';

@Component({
  selector: 'app-article-list',
  standalone: true,
  imports: [AuthorComponent, MaterialModule],
  templateUrl: './article-list.component.html',
  styleUrl: './article-list.component.scss',
})
export class ArticleListComponent implements OnInit {
  articles: ArticleWithoutTextAndComments[] = [];
  protected readonly articleToArticleHeader = articleToArticleHeader;

  constructor(
    private articleService: ArticleService,
    public router: Router,
  ) {}

  ngOnInit() {
    this.articleService.getArticlesWithoutTextAndComments().subscribe((x) => {
      console.log(x);
      // debugger;
      this.articles = x;
    });
  }
}
