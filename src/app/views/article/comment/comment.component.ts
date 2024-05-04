import { Component, Input } from '@angular/core';
import { ISOdateStringToLocaleDate } from '../../../helpers';
import { FormsModule } from '@angular/forms';
import { Article, Comment } from '../types';
import { firstValueFrom } from 'rxjs';
import { ArticleService } from '../article.service';
import { User } from '../../../services/authentication.service';
import { MaterialModule } from '../../../material.module';
import { CommonModule } from '@angular/common';
import { AuthorComponent } from '../author/author.component';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [MaterialModule, CommonModule, FormsModule, AuthorComponent],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss',
})
export class CommentComponent {
  @Input() comment: Comment | null = null;
  @Input() user: User | null = null;
  @Input() article: Article | null = null;
  protected readonly ISOdateStringToLocaleDate = ISOdateStringToLocaleDate;

  constructor(private articleService: ArticleService) {}

  isUserLoggedIn() {
    return this.user !== null;
  }

  toggleOpenReplyBoxBelow(comment: Comment) {
    comment.hasOpenReplyBox = !comment.hasOpenReplyBox;
  }

  async toggleLikeComment(comment: Comment) {
    if (!this.isUserLoggedIn()) return;

    const newIsLikedByCurrentUser = !comment.isLikedByCurrentUser;
    const newLikes = comment.likes + (newIsLikedByCurrentUser ? 1 : -1);
    const newIsDislikedByCurrentUser = false;
    const newDislikes =
      comment.dislikes +
      (newIsLikedByCurrentUser && comment.isDislikedByCurrentUser ? -1 : 0);
    comment.isLikedByCurrentUser = newIsLikedByCurrentUser;
    comment.likes = newLikes;
    comment.isDislikedByCurrentUser = newIsDislikedByCurrentUser;
    comment.dislikes = newDislikes;

    await firstValueFrom(this.articleService.likeComment(comment.id));
  }

  async toggleDislikeComment(comment: Comment) {
    if (!this.isUserLoggedIn()) return;

    const newIsDislikedByCurrentUser = !comment.isDislikedByCurrentUser;
    const newDislikes =
      comment.dislikes + (newIsDislikedByCurrentUser ? 1 : -1);
    const newIsLikedByCurrentUser = false;
    const newLikes =
      comment.likes +
      (newIsDislikedByCurrentUser && comment.isLikedByCurrentUser ? -1 : 0);
    comment.isLikedByCurrentUser = newIsLikedByCurrentUser;
    comment.likes = newLikes;
    comment.isDislikedByCurrentUser = newIsDislikedByCurrentUser;
    comment.dislikes = newDislikes;

    await firstValueFrom(this.articleService.dislikeComment(comment.id));
  }

  async sendReply(comment: Comment) {
    if (this.article === null) return;
    const newComment: Comment = await firstValueFrom(
      this.articleService.sendReplyToComment(
        this.article.id,
        comment.id,
        comment.replyText,
      ),
    );
    comment.replies = [...comment.replies, newComment];
    comment.hasOpenReplyBox = false;
    comment.replyText = '';
    comment.areRepliesVisible = true;
  }

  getShortenedCommentText(commentText: string) {
    return `${commentText.slice(0, 200)}...`;
  }

  toggleShortenedTextView(comment: Comment) {
    comment.isShortenedTextVisible = !comment.isShortenedTextVisible;
  }

  toggleRepliesVisibility(comment: Comment) {
    comment.areRepliesVisible = !comment.areRepliesVisible;
  }
}
