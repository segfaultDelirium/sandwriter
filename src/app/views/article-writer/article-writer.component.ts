import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material.module';
import { ArticleService } from '../article/article.service';
import { AuthorComponent } from '../article/author/author.component';

@Component({
  selector: 'app-article-writer',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MaterialModule, AuthorComponent],
  templateUrl: './article-writer.component.html',
  styleUrl: './article-writer.component.scss',
})
export class ArticleWriterComponent {
  articleText: string = '';
  articleTitle: string = '';

  constructor(private articleService: ArticleService) {}

  postArticle() {
    this.articleService
      .postArticle(this.articleTitle, this.articleText)
      .subscribe((x) => {
        console.log(x);
      });
  }

  canPostArticle() {
    return this.articleText !== '' && this.articleTitle !== '';
  }

  // getDummyArticle() {
  //   const article: ArticleWithoutTextAndComments = {};
  //
  //   return article;
  // }
}
