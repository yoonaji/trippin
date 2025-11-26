export type FavoritePostResponse = {
  photoId: number;
  postId: number;
  content: string;
  imageUrl: string;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  authorName: string;
  authorProfileImage: string | null;
  placeName: string;
  latitude: number;
  longitude: number;
};
