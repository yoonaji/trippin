import React, { useState, useEffect } from 'react';
import { View, Image, ScrollView, ActivityIndicator } from 'react-native';
import { Container } from '../../styles/GlobalStyles';
import CustomText from '../../components/ui/CustomText';
import IconButton from '../../components/buttons/IconButton';
import plus from '../../assets/images/icon/plus.png';
import listIcon from '../../assets/images/icon/friend_list.png';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FriendStackParam } from './FriendStack';
import { useNavigation } from '@react-navigation/native';
import heartIcon from '../../assets/images/icon/heart.png';
import chatIcon from '../../assets/images/icon/chat.png';
import styled from 'styled-components/native';
import { colors } from '../../styles/colors';
import { TouchableOpacity } from 'react-native';
import api from '../../../axiosConfig';
import { showError } from '../../utils/toast';

type Navigation = NativeStackNavigationProp<FriendStackParam>;

type Post = {
  postId: number;
  title?: string | null;
  thumbnailUrl?: string | null;
  period?: string | null;
  authorName?: string | null;
  authorProfileImage?: string | null;
  liked?: boolean;
  likeCount?: number;
};

const FriendHomeScreen: React.FC = () => {
  const navigation = useNavigation<Navigation>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await api.get('/api/friends/feed');
        const data = res.data?.data;

        if (Array.isArray(data)) {
          setPosts(data);
        } else {
          setPosts([]);
        }
      } catch (error: any) {
        console.error('friends/feed error:', error);
        showError('피드 조회 실패', error.response?.data?.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleLike = async (photoId: number) => {
    try {
      const res = await api.post(`/api/photos/${photoId}/like`);
      const payload = res.data?.data;

      if (payload) {
        const { photoId: id, likeCount, liked } = payload;
        setPosts(prev =>
          prev.map(post =>
            post.postId === id ? { ...post, likeCount, liked } : post,
          ),
        );
      } else {
        setPosts(prev =>
          prev.map(post =>
            post.postId === photoId
              ? {
                  ...post,
                  liked: true,
                  likeCount: (post.likeCount ?? 0) + 1,
                }
              : post,
          ),
        );
      }
    } catch (error: any) {
      console.error('like error:', error);
      showError('좋아요 실패', error.response?.data?.message);
    }
  };

  const handleUnlike = async (photoId: number) => {
    try {
      const res = await api.delete(`/api/photos/${photoId}/like`);
      const payload = res.data?.data;

      if (payload) {
        const { photoId: id, likeCount, liked } = payload;
        setPosts(prev =>
          prev.map(post =>
            post.postId === id ? { ...post, likeCount, liked } : post,
          ),
        );
      } else {
        setPosts(prev =>
          prev.map(post =>
            post.postId === photoId
              ? {
                  ...post,
                  liked: false,
                  likeCount: (post.likeCount ?? 1) - 1,
                }
              : post,
          ),
        );
      }
    } catch (error: any) {
      console.error('unlike error:', error);
      showError('좋아요 취소 실패', error.response?.data?.message);
    }
  };

  return (
    <Container>
      {loading ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
          }}
        >
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {posts.map((post, idx) => (
            <TouchableOpacity
              key={post.postId ?? idx}
              onPress={() => navigation.navigate('PostDetailScreen', { post })}
              activeOpacity={0.8}
            >
              <Block key={post.postId ?? idx}>
                <Header>
                  <UserInfo>
                    {post.authorProfileImage ? (
                      <ProfileImage source={{ uri: post.authorProfileImage }} />
                    ) : (
                      <ProfileImage
                        source={require('../../assets/images/icon/author.png')}
                      />
                    )}
                    <UserName>{post.authorName}</UserName>
                  </UserInfo>
                </Header>

                <ContentRow style={{ marginTop: 16 }}>
                  {post.thumbnailUrl ? (
                    <LeftImage source={{ uri: post.thumbnailUrl }} />
                  ) : (
                    <LeftImage
                      source={require('../../assets/images/icon/author.png')}
                    />
                  )}

                  <InfoArea>
                    <CustomText style={{ marginBottom: 6, fontSize: 15 }}>
                      {post.title || '내용없음'}
                    </CustomText>
                  </InfoArea>
                </ContentRow>

                <IconGroup style={{ marginTop: 6 }}>
                  <TouchableOpacity
                    onPress={() =>
                      post.liked
                        ? handleUnlike(post.postId)
                        : handleLike(post.postId)
                    }
                  >
                    <IconImage
                      source={heartIcon}
                      style={{ tintColor: post.liked ? 'red' : 'gray' }}
                    />
                  </TouchableOpacity>

                  <IconImage source={chatIcon} />
                </IconGroup>
              </Block>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <FloatingButtonContainer>
        <FloatingButtonWrapper>
          <Image style={{ tintColor: 'white' }} />
          <IconButton
            icon={listIcon}
            size={25}
            onPress={() => navigation.navigate('FriendListScreen')}
          />
        </FloatingButtonWrapper>

        <FloatingButtonWrapper>
          <IconButton
            icon={plus}
            size={20}
            onPress={() => navigation.navigate('AddFriendScreen')}
          />
        </FloatingButtonWrapper>
      </FloatingButtonContainer>
    </Container>
  );
};

export default FriendHomeScreen;

const Block = styled.View`
  width: 100%;
  padding: 20px;
  margin: 5px 0;
  background-color: ${colors.sky};
  border-radius: 24px;
  elevation: 4;
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 5px;
`;

const UserInfo = styled.View`
  flex-direction: row;
  align-items: center;
  flex: 1;
`;

const ProfileImage = styled.Image`
  width: 30px;
  height: 30px;
  border-radius: 24px;
`;

const UserName = styled.Text`
  margin-left: 12px;
  font-weight: bold;
  font-size: 14px;
`;

const IconGroup = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  gap: 20px;
`;

const IconImage = styled.Image`
  width: 25px;
  height: 25px;
`;

const ItemContainer = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 12px 0;
  border-bottom-width: 0.5px;
  border-color: ${colors.gray2};
`;

const ContentRow = styled.View`
  flex-direction: row;
  align-items: flex-start;
`;

const LeftImage = styled.Image`
  width: 100px;
  height: 100px;
  border-radius: 8px;
  margin-right: 12px;
`;

const InfoArea = styled.View`
  flex: 1;
  justify-content: center;
`;

const FloatingButtonContainer = styled.View`
  position: absolute;
  bottom: 8px;
  right: 30px;
  flex-direction: column;
  align-items: center;
`;

const FloatingButtonWrapper = styled.View`
  background-color: ${colors.blue};
  width: 60px;
  height: 60px;
  border-radius: 30px;
  justify-content: center;
  align-items: center;
  margin-bottom: 8px;
`;
