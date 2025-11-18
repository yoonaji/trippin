type PhotoCardData = {
  type: 'photo';
  photoId: number;
  authorName: string;
  authorProfileImage: string | null;
  createdAt: string;
  imageUrl: string;
  location: string;
  content: string;
  likeCount: number;
  commentCount: number;
};

type PostCardData = {
  type: 'post';
  postId: number;
  title: string;
  period: string;
  authorName: string;
  authorProfileImage: string | null;
  thumbnailUrl: string | null;
};

export type BottomListItem = PhotoCardData | PostCardData;
