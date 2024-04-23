import { UserViewableData } from '../../services/authentication.service';

export type Comment = {
  id: string;
  author: UserViewableData;
  replies: Comment[];
  // replies_to: string | null; // comment id if is reply to another comment or null.
  text: string;

  upvotes: number;
  downvotes: number;
  is_upvoted_by_current_user: boolean;
  is_downvoted_by_current_user: boolean;

  inserted_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export interface Article extends ArticleWithoutTextAndComments {
  comments: Comment[];
  text: string;
}

export interface ArticleWithoutTextAndComments {
  id: string;
  author: UserViewableData;
  title: string;
  slug: string;

  upvotes: number;
  downvotes: number;
  is_upvoted_by_current_user: boolean;
  is_downvoted_by_current_user: boolean;

  inserted_at: string;
  updated_at: string;
  deleted_at: string | null;
}
