import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material.module';
import { ArticleService } from '../article/article.service';
import {
  ArticleHeader,
  AuthorComponent,
} from '../article/author/author.component';
import { Subscription } from 'rxjs';
import {
  AuthenticationService,
  User,
} from '../../services/authentication.service';
import { getCurrentISODateString } from '../../helpers';
import { SectionType } from '../article/types';
import { Router } from '@angular/router';

const emptyTextSection: Section = {
  sectionType: 'TEXT',
  text: '',
  imageId: null,
  imageTitle: null,
  imageBase64: null,
};

export type Section = {
  sectionType: SectionType;
  text: string | null; // if sectionType is TEXT, then this is not null
  imageId: string | null; // if sectionType is IMAGE than this is not null
  imageBase64: string | null; // if sectionType is IMAGE than this is not null
  imageTitle: string | null; // if sectionType is IMAGE than this is not null
};

@Component({
  selector: 'app-article-writer',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MaterialModule, AuthorComponent],
  templateUrl: './article-writer.component.html',
  styleUrl: './article-writer.component.scss',
})
export class ArticleWriterComponent implements OnInit {
  // articleText: string = '';
  articleTitle: string = '';
  userData: User | null = null;
  userDataSubscription?: Subscription;

  sections: Section[] = [{ ...emptyTextSection }];

  uploadImageSubscription?: Subscription;

  constructor(
    private articleService: ArticleService,
    private authService: AuthenticationService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.userDataSubscription = this.authService.userDataMessage$.subscribe(
      (userData) => {
        this.userData = userData;
      },
    );
  }

  postArticle() {
    this.articleService
      .postArticle(this.articleTitle, this.sections)
      .subscribe((x) => {
        const slug = x.slug;
        this.router.navigate(['/articles/by-slug/' + slug]);
      });
  }

  canPostArticle() {
    return this.sections.length !== 0 && this.articleTitle !== '';
  }

  uploadImage(event: any, index: number | undefined = undefined) {
    const file: File = event.target.files[0];
    if (file && file.type.startsWith('image')) {
      const formData = new FormData();
      formData.append('uploaded_image', file);
      this.uploadImageSubscription = this.articleService
        .uploadImage('sample_title', formData)
        .subscribe((x) => {
          this.addImageSection(x.id, x.data, x.title, index);
        });
    }
  }

  addImageSection(
    imageId: string,
    imageBase64: string,
    imageTitle: string,
    index: number | undefined,
  ) {
    const newSection: Section = {
      sectionType: 'IMAGE',
      text: null,
      imageId: imageId,
      imageBase64: imageBase64,
      imageTitle: imageTitle,
    };
    const i = index === undefined ? this.sections.length : index + 1;
    const sectionsBefore = this.sections.slice(0, i);
    const sectionsAfter = this.sections.slice(i, this.sections.length);
    this.sections = [...sectionsBefore, newSection, ...sectionsAfter];
  }

  addTextSection(index: number | undefined = undefined) {
    const newSection = { ...emptyTextSection };
    const i = index === undefined ? this.sections.length : index + 1;
    const sectionsBefore = this.sections.slice(0, i);
    const sectionsAfter = this.sections.slice(i, this.sections.length);
    this.sections = [...sectionsBefore, newSection, ...sectionsAfter];
  }

  moveSectionUp(sectionIndex: number) {
    const sectionAbove = this.sections[sectionIndex - 1];
    const sectionsAbove = this.sections.slice(0, sectionIndex - 1);
    const sectionsBelow = this.sections.slice(
      sectionIndex + 1,
      this.sections.length,
    );

    const currentSection = this.sections[sectionIndex];
    const newSections = [
      ...sectionsAbove,
      currentSection,
      sectionAbove,
      ...sectionsBelow,
    ];
    this.sections = newSections;
  }

  moveSectionDown(sectionIndex: number) {
    const sectionBelow = this.sections[sectionIndex + 1];
    const sectionsAbove = this.sections.slice(0, sectionIndex);
    const sectionsBelow = this.sections.slice(
      sectionIndex + 2,
      this.sections.length,
    );

    const currentSection = this.sections[sectionIndex];
    const newSections = [
      ...sectionsAbove,
      sectionBelow,
      currentSection,
      ...sectionsBelow,
    ];
    this.sections = newSections;
  }

  deleteSection(sectionIndex: number) {
    this.sections = this.sections.filter(
      (_section, index) => index !== sectionIndex,
    );
  }

  getArticleHeader() {
    if (this.userData === null) {
      return null;
    }
    // const display_name = this.userData ? this.userData!.displayName ?? '' : '';
    const articleHeader: ArticleHeader = {
      articleId: null,
      author: this.userData,
      isLikedByCurrentUser: false,
      isDislikedByCurrentUser: false,
      insertedAt: getCurrentISODateString(),
      likes: 0,
      dislikes: 0,
    };
    return articleHeader;
  }
}
