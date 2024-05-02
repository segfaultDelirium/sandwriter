import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleWriterComponent } from './article-writer.component';

describe('ArticleWriterComponent', () => {
  let component: ArticleWriterComponent;
  let fixture: ComponentFixture<ArticleWriterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleWriterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArticleWriterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
