import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import { Container } from '../../styles/GlobalStyles';
import CustomText from '../../components/ui/CustomText';
import heart from '../../assets/images/icon/heart.png';
import api from '../../../axiosConfig';
import { colors } from '../../styles/colors';
import { showError } from '../../utils/toast';
import { useNavigation } from '@react-navigation/native';
import { MyPageStackParam } from './MyPageStack';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import PostCard from '../../components/ui/PostCard';

interface LikedPostType {
  photoId: number;
  postId: number;
  content: string;
  imageUrl: string;
  createdAt: string;
  authorName: string;
  authorProfileImage: string | null;
  likeCount: number;
  commentCount: number;
  placeName: string;
  latitude: number;
  longitude: number;
}

const LikedScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<MyPageStackParam>>();

  const [posts, setPosts] = useState<LikedPostType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavoritePosts = async () => {
      try {
        const res = await api.get('/api/users/me/favorites');
        const data = res.data?.data ?? [];
        if (!Array.isArray(data)) throw new Error('INVALID_RESPONSE');

        setPosts(data);
      } catch (e: any) {
        showError('좋아요 목록 조회 실패', e.response?.data?.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoritePosts();
  }, []);

  return (
    <Container>
      <Scroll
        style={{ width: '100%' }}
        contentContainerStyle={{
          flexGrow: 1,
        }}
      >
        <HeaderRow>
          <IconCircle>
            <HeartIcon source={heart} />
          </IconCircle>
        </HeaderRow>
        <Line />

        {loading && (
          <CenteredContainer>
            <CustomText style={{ fontSize: 15, marginBottom: 10 }}>
              불러오는 중...
            </CustomText>
            <Loader />
          </CenteredContainer>
        )}

        {!loading && posts.length === 0 && (
          <CenteredContainer>
            <CustomText style={{ marginTop: 20 }}>
              좋아요한 게시물이 없습니다.
            </CustomText>
          </CenteredContainer>
        )}

        {!loading &&
          posts.length > 0 &&
          posts.map(post => (
            <PostTouchable
              key={post.photoId}
              onPress={() =>
                navigation.navigate('PostDetailScreen', {
                  postId: post.postId,
                })
              }
            >
              <PostCard
                data={{
                  type: 'photo',
                  photoId: post.photoId,
                  authorName: post.authorName,
                  authorProfileImage: post.authorProfileImage,
                  createdAt: post.createdAt,
                  imageUrl: post.imageUrl,
                  location: post.placeName,
                  content: post.content,
                  likeCount: post.likeCount,
                  commentCount: post.commentCount,
                }}
              />
            </PostTouchable>
          ))}
      </Scroll>
    </Container>
  );
};

export default LikedScreen;

const Scroll = styled.ScrollView`
  flex: 1;
`;

const CenteredContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const Loader = styled.ActivityIndicator.attrs({
  size: 'large',
  color: colors.blue,
})``;

const HeaderRow = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  margin-top: 20px;
`;

const IconCircle = styled.View`
  width: 40px;
  height: 40px;
  background-color: ${colors.blue};
  border-radius: 40px;
  justify-content: center;
  align-items: center;
`;

const HeartIcon = styled.Image`
  width: 25px;
  height: 25px;
  tint-color: ${colors.white};
`;

const Line = styled.View`
  width: 100%;
  height: 1px;
  background-color: ${colors.gray3};
  margin-vertical: 8px;
`;

const PostTouchable = styled.TouchableOpacity`
  width: 100%;
`;
