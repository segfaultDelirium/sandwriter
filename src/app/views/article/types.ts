import { User } from '../../services/authentication.service';

export type Comment = {
  id: string;
  author: {
    displayName: string;
  };
  replies: Comment[];
  // replies_to: string | null; // comment id if is reply to another comment or null.
  text: string;

  likes: number;
  dislikes: number;
  isLikedByCurrentUser: boolean;
  isDislikedByCurrentUser: boolean;

  insertedAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type SectionType = 'TEXT' | 'IMAGE';

export type SectionSnakeCase = {
  section_index: number;
  section_type: SectionType;
  text: string | null;
  image_id: string | null;
  image_base_64: string | null;
  image_title: string | null;
};

export type Section = {
  sectionIndex: number;
  sectionType: SectionType;
  text: string | null;
  imageId: string | null;
  imageBase64: string | null;
  imageTitle: string | null;
};

export interface Article extends ArticleWithoutTextAndComments {
  comments: Comment[];
  sections: Section[];
}

export interface ArticleWithoutTextAndComments {
  id: string;
  author: User;
  title: string;
  slug: string;

  likes: number;
  dislikes: number;
  isLikedByCurrentUser: boolean;
  isDislikedByCurrentUser: boolean;
  commentCount: number;

  insertedAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
