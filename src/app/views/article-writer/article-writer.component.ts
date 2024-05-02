import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material.module';
import { ArticleService } from '../article/article.service';
import { AuthorComponent } from '../article/author/author.component';
import { Subscription } from 'rxjs';

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

  uploadImageSubscription?: Subscription;

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

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    debugger;
    if (file && file.type.startsWith('image')) {
      const formData = new FormData();
      formData.append('uploaded_image', file);
      this.uploadImageSubscription = this.articleService
        .uploadImage('sample_title', formData)
        .subscribe((x) => {
          console.log(x);
          this.articleText += `
            <canvas id="${x.id}"></canvas>
          `;
          this.drawImage(x.id, x.data);
        });
    }
  }

  drawImage(canvasId: string, imageBase64: string) {
    debugger;
    const img = new Image(); // Create a new Image
    img.onload = function () {
      console.log('hello from img.onload');
      const canvas = document.getElementById(
        'sample_canvas',
      )! as HTMLCanvasElement;
      debugger;
      const ctx = canvas.getContext('2d')!;
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0); // Draw the image on the canvas
    };
    img.src = `data:image/png;base64,${imageBase64}`;
  }
}
