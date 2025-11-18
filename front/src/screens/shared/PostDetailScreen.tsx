import { useEffect, useState } from 'react';
import { Container } from '../../styles/GlobalStyles';
import { ScrollView, View } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import api from '../../../axiosConfig';
import { showError } from '../../utils/toast';
import PostDetailView from '../../components/ui/PostDetailView';

type Comment = {
  commentId: number;
  comment: string;
  createdAt: string;
  authorName: string;
  authorProfileImage: string | null;
};

type PhotoDetail = {
  type: 'photo';
  photoId: number;
  content: string;
  imageUrl: string;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  authorName: string;
  authorProfileImage: string | null;
  comments: Comment[];
};

type PostDetail = {
  type: 'post';
  postId: number;
  title: string;
  period: string;
  authorName: string;
  authorProfileImage: string | null;
  photos: PhotoDetail[];
};

type ScreenParams = {
  PostDetailScreen: {
    postId: number;
  };
};

const PostDetailScreen = () => {
  const route = useRoute<RouteProp<ScreenParams, 'PostDetailScreen'>>();
  const { postId } = route.params;

  const [data, setData] = useState<PostDetail | null>(null);

  useEffect(() => {
    fetchPostDetail();
  }, [postId]);

  const fetchPostDetail = async () => {
    try {
      const res = await api.get(`/api/posts/${postId}`);
      const d = res.data.data;

      setData({
        ...d,
        photos: d.photos ?? [],
      });
    } catch (error: any) {
      showError('게시글 상세 조회 실패', error.response?.data?.message);
    }
  };

  if (!data) return null;

  return (
    <Container>
      <ScrollView showsVerticalScrollIndicator={false}>
        <PostDetailView data={data} />
      </ScrollView>
    </Container>
  );
};

export default PostDetailScreen;
