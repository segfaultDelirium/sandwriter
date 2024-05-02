import { Component, OnInit } from '@angular/core';
import { ArticleComponent } from '../article/article.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ArticleComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  ngOnInit() {
    this.myFunction();
  }

  myFunction() {
    // console.log(prison(3, 3, [2], [2]));
  }
}
