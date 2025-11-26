export type PopularPostResponse = {
  photoId: number;
  postId: number;
  title: string;
  content: string;
  imageUrl: string;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  marker: {
    id: number;
    placeName: string;
    latitude: number;
    longitude: number;
  };
  author: {
    name: string;
    profileImage: string | null;
  };
};
