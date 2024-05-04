import { Component, OnInit } from '@angular/core';
import { ArticleService } from '../article/article.service';
import { ArticleWithoutTextAndComments } from '../article/types';
import { AuthorComponent } from '../article/author/author.component';
import { MaterialModule } from '../../material.module';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-article-list',
  standalone: true,
  imports: [AuthorComponent, MaterialModule, RouterLink],
  templateUrl: './article-list.component.html',
  styleUrl: './article-list.component.scss',
})
export class ArticleListComponent implements OnInit {
  articles: ArticleWithoutTextAndComments[] = [];

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
