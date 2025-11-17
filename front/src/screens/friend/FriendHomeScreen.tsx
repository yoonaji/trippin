import React, { useState, useEffect } from 'react';
import { View, ScrollView, ActivityIndicator } from 'react-native';
import { Container } from '../../styles/GlobalStyles';
import plusFriend from '../../assets/images/icon/plus_friend.png';
import listIcon from '../../assets/images/icon/friend_list.png';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FriendStackParam } from './FriendStack';
import { useNavigation } from '@react-navigation/native';
import friend from '../../assets/images/icon/friend.png';
import close from '../../assets/images/icon/x_icon.png';
import styled from 'styled-components/native';
import { colors } from '../../styles/colors';
import { TouchableOpacity } from 'react-native';
import api from '../../../axiosConfig';
import { showError } from '../../utils/toast';
import PostCard from '../../components/ui/PostCard';
import { useLoading } from '../../components/ui/LoadingContext';

type Navigation = NativeStackNavigationProp<FriendStackParam>;

type Post = {
  postId: number;
  title: string | null;
  thumbnailUrl: string | null;
  period: string | null;
  authorName: string | null;
  authorProfileImage: string | null;
};

const FriendHomeScreen: React.FC = () => {
  const navigation = useNavigation<Navigation>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [open, setOpen] = useState(false);
  const { setLoadingPromise } = useLoading();

  const fetchPosts = async () => {
    try {
      const res = await setLoadingPromise(
        api.get('/api/friends/feed'),
        '친구 피드를 불러오는 중...',
      );

      const data = res.data?.data;

      if (Array.isArray(data)) {
        setPosts(data);
      } else {
        setPosts([]);
      }
    } catch (error: any) {
      console.error('friends/feed error:', error);
      showError('피드 조회 실패', error.response?.data?.message);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchPosts();
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <Container>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ width: '100%', marginTop: 10 }}
      >
        {posts.map((post, idx) => (
          <TouchableOpacity
            key={post.postId ?? idx}
            onPress={() =>
              navigation.navigate('PostDetailScreen', { postId: post.postId })
            }
            activeOpacity={0.8}
          >
            <PostCard
              data={{
                type: 'post',
                postId: post.postId,
                title: post.title ?? '',
                thumbnailUrl: post.thumbnailUrl ?? null,
                period: post.period ?? null,
                authorName: post.authorName ?? '',
                authorProfileImage: post.authorProfileImage ?? null,
              }}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FloatingWrapper>
        {open && (
          <>
            <MiniButton
              style={{ bottom: 140 }}
              onPress={() => navigation.navigate('FriendListScreen')}
            >
              <MiniIconImage source={listIcon} />
            </MiniButton>

            <MiniButton
              style={{ bottom: 70 }}
              onPress={() => navigation.navigate('AddFriendScreen')}
            >
              <MiniIconImage source={plusFriend} />
            </MiniButton>
          </>
        )}
        <MainButton open={open} onPress={() => setOpen(!open)}>
          <MainButtonIcon>
            <MainIconImage source={open ? close : friend} />
          </MainButtonIcon>
        </MainButton>
      </FloatingWrapper>
    </Container>
  );
};

export default FriendHomeScreen;

const FloatingWrapper = styled.View`
  position: absolute;
  bottom: 25px;
  right: 25px;
  align-items: center;
`;

const MainButton = styled.TouchableOpacity<{ open: boolean }>`
  width: 60px;
  height: 60px;
  border-radius: 60px;
  background-color: ${({ open }) => (open ? colors.blue2 : colors.blue)};
  justify-content: center;
  align-items: center;
  elevation: 6;
`;

const MainButtonIcon = styled.View`
  justify-content: center;
  align-items: center;
`;

const MiniButton = styled.TouchableOpacity`
  position: absolute;
  right: 0;
  width: 60px;
  height: 60px;
  border-radius: 60px;
  background-color: ${colors.blue};
  justify-content: center;
  align-items: center;
  elevation: 5;
`;

const MiniIconImage = styled.Image.attrs({
  resizeMode: 'contain',
})`
  width: 25px;
  height: 25px;
`;

const MainIconImage = styled.Image.attrs({
  resizeMode: 'contain',
})`
  width: 27px;
  height: 27px;
`;
