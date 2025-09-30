// FriendHomeScreen.tsx
import React, { useState, useEffect } from 'react';
import { Text, View, Image, ScrollView, ActivityIndicator } from 'react-native';
import { Container } from '../../styles/GlobalStyles';
import CustomText from '../../components/ui/CustomText';
import IconButton from '../../components/buttons/IconButton';
import plus from '../../assets/images/icon/plus.png';
import listIcon from '../../assets/images/icon/listIcon.png';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FriendStackParam } from './FriendStack';
import { useNavigation } from '@react-navigation/native';
import {
  Block,
  Header,
  UserInfo,
  ProfileImage,
  UserName,
  IconGroup,
  IconImage,
  ContentRow,
  LeftImage,
  InfoArea,
} from '../../styles/write.ts';
import heartIcon from '../../assets/images/icon/heart.png';
import chatIcon from '../../assets/images/icon/chat.png';
import styled from 'styled-components/native';
import { colors } from '../../styles/colors';
import SearchBar from './SearchBar.tsx';
import stadium from '../../assets/images/data/sample_stadium.png'; // placeholder
import { TouchableOpacity } from 'react-native';

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

const API_BASE = 'http://10.0.2.2:8080';
const token =
  'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ5b29ubl9fYUBnbWFpbC5jb20iLCJjYXRlZ29yeSI6ImFjY2VzcyIsImlhdCI6MTc1OTE1OTAwNSwiZXhwIjoxNzU5MTU5OTA1fQ.k1yDkkBQK04g-ypmLK3OJX4CiRUvNnn8RODA3_nOOKI';

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

const FriendHomeScreen: React.FC = () => {
  const navigation = useNavigation<Navigation>();
  const [email, setEmail] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/friends/feed`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            // "Content-Type": "application/json", // GET에서는 보통 불필요
          },
        });

        const json = await res.json();
        console.log('friends/feed response:', res.status, json); // 디버깅용

        if (res.ok && Array.isArray(json.data)) {
          setPosts(json.data);
        } else {
          console.error('API Error:', json?.message ?? res.status);
        }
      } catch (error) {
        console.error('Fetch Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  //좋아요하기
  const handleLike = async (photoId: number) => {
    try {
      const res = await fetch(`${API_BASE}/api/photos/${photoId}/like`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const json = await res.json();
      console.log('like response:', res.status, json);

    if (res.ok) {
      if (json.data) {
        const { photoId, likeCount, liked } = json.data;
        setPosts(prev =>
          prev.map(post =>
            post.postId === photoId
              ? { ...post, likeCount, liked }
              : post,
          ),
        );
      } else {
        // data 없을 때 최소한 liked true/false만 토글해주기
        setPosts(prev =>
          prev.map(post =>
            post.postId === photoId
              ? { ...post, liked: true, likeCount: (post.likeCount ?? 0) + 1 }
              : post,
          ),
        );
      }
    } else {
      console.error('Like API Error:', json?.message ?? res.status);
    }
    } catch (error) {
      console.error('Like Fetch Error:', error);
    }
  };

// 좋아요 취소
const handleUnlike = async (photoId: number) => {
  try {
    const res = await fetch(`${API_BASE}/api/photos/${photoId}/like`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const json = await res.json();
    console.log('unlike response:', res.status, json);

    if (res.ok) {
      if (json.data) {
        const { photoId, likeCount, liked } = json.data;
        setPosts(prev =>
          prev.map(post =>
            post.postId === photoId
              ? { ...post, likeCount, liked }
              : post,
          ),
        );
      } else {
        // data가 null일 경우 대비: liked만 false로 바꾸고, likeCount 감소
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
    } else {
      console.error('Unlike API Error:', json?.message ?? res.status);
    }
  } catch (error) {
    console.error('Unlike Fetch Error:', error);
  }
};


  return (
    <Container>
      <SearchBar
        value={email}
        onChangeText={setEmail}
        placeholder="이메일로 친구 추가"
        onClear={() => setEmail('')}
        style={{ marginTop: 16, marginHorizontal: 10 }}
      />

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
            <Block key={post.postId ?? idx}>
              <Header>
                <UserInfo>
                  {post.authorProfileImage ? (
                    <ProfileImage source={{ uri: post.authorProfileImage }} />
                  ) : (
                    // authorProfileImage가 null이면 기본 이미지 사용
                    <ProfileImage
                      source={require('../../assets/images/data/sample_stadium.png')}
                    />
                  )}
                  <UserName>{post.authorName}</UserName>
                  {/* 유저네임 여긴 잘됨 */}
                </UserInfo>
              </Header>

              <ContentRow style={{ marginTop: 16 }}>
                {post.thumbnailUrl ? (
                  <LeftImage source={{ uri: post.thumbnailUrl }} />
                ) : (
                  <LeftImage
                    source={require('../../assets/images/data/sample_stadium.png')}
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
          ))}
        </ScrollView>
      )}

      <FloatingButtonContainer>
        <FloatingButtonWrapper>
          <IconButton
            icon={listIcon}
            size={25}
            color={colors.white}
            onPress={() => navigation.navigate('FriendListScreen')}
          />
        </FloatingButtonWrapper>

        <FloatingButtonWrapper>
          <IconButton
            icon={plus}
            size={35}
            color={colors.white}
            onPress={() => navigation.navigate('AddFriendScreen')}
          />
        </FloatingButtonWrapper>
      </FloatingButtonContainer>
    </Container>
  );
};

export default FriendHomeScreen;
