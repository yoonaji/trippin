export type BottomListItem =
  | {
      type: 'photo';
      photoId: number;
      postId: number;
      authorName: string;
      authorProfileImage: string | null;
      createdAt: string;
      imageUrl: string;
      location: string;
      content: string;
      likeCount: number;
      commentCount: number;
      liked?: boolean;
    }
  | {
      type: 'post';
      postId: number;
      title: string;
      period: string;
      authorName: string;
      authorProfileImage: string | null;
      thumbnailUrl: string | null;
    };
