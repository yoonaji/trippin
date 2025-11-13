import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, ActivityIndicator } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Container } from '../../styles/GlobalStyles';
import styled from 'styled-components/native';
import { colors } from '../../styles/colors';
import { Block, Header, UserInfo, ProfileImage, UserName } from '../../styles/write.ts';

//  API 설정
const API_BASE = 'http://10.0.2.2:8080';
const token =
  'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhQGdtYWlsLmNvbSIsImNhdGVnb3J5IjoiYWNjZXNzIiwiaWF0IjoxNzYyOTU1NzE5LCJleHAiOjE3NjI5NTY2MTl9.YdOIVQykKt6liaMJl28zB4Fd6cCwZl9yiXe96juiN9k';

type FriendStackParam = {
  EachPostScreen: { postId: number }; //  Friend 기반으로 변경
};

type EachPostScreenRouteProp = RouteProp<FriendStackParam, 'EachPostScreen'>;

const ContentColumn = styled.View`
  flex-direction: column;
  width: 100%;
`;

const PostImage = styled.Image`
  width: 220px;
  height: 220px;
  margin-top: 10px;
  margin-left: 60px;
`;

const CommentBlock = styled.View`
  margin-bottom: 10px;
  padding: 10px 12px;
  background-color: #fff;
  border-radius: 20px;
  border-width: 1px;
  border-color: ${colors.gray2};
`;

const CommentUser = styled.Text`
  font-weight: bold;
  font-size: 14px;
`;

const CommentText = styled.Text`
  font-size: 14px;
  margin-top: 2px;
`;

const EachPostScreen = () => {
  const route = useRoute<EachPostScreenRouteProp>();
  const { postId } = route.params;

  const [postData, setPostData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<any[]>([]);

  const fetchFriendPostDetail = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/posts/${postId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      setPostData(result.data);
    } catch (error) {
      console.log(' 친구 게시글 상세 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
  try {
    const response = await fetch(`${API_BASE}/api/users/me/comments`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();
    if (result.success) {
      setComments(result.data);
    }
  } catch (error) {
    console.log('댓글 조회 실패:', error);
  }
};


  

useEffect(() => {
  fetchFriendPostDetail();
  fetchComments();
}, []);


  // const comments = [
  //   { user: 'Minji', text: '헐 여긴 어디야 너무 예쁘다!' },
  //   { user: 'Jiwon', text: '나도 가보고 싶어!' },
  // ];

  if (loading) {
    return (
      <Container style={{ justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </Container>
    );
  }

  if (!postData) {
    return (
      <Container style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Text>게시글을 불러올 수 없습니다.</Text>
      </Container>
    );
  }

  return (
    <Container style={{ backgroundColor: colors.white }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Block>
          <Header>
            <UserInfo>
              <ProfileImage
                source={
                  postData.authorProfileImage
                    ? { uri: postData.authorProfileImage }
                    : undefined
                }
              />
              <UserName>{postData.authorName}</UserName>
            </UserInfo>
          </Header>

          <ContentColumn>
            {postData.photos?.length > 0 && (
              <PostImage
                source={{ uri: postData.photos[0].imageUrl }}
                resizeMode="cover"
              />
            )}

            <View style={{ marginTop: 12 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 4 }}>
                {postData.title}
              </Text>

              <Text style={{ color: colors.gray4, fontSize: 13, marginBottom: 10 }}>
                {postData.period}
              </Text>
            </View>
{/* 
            <View style={{ marginTop: 10 }}>
              {comments.map((cmt, idx) => (
                <CommentBlock key={idx}>
                  <CommentUser>{cmt.user}</CommentUser>
                  <CommentText>{cmt.text}</CommentText>
                </CommentBlock>
              ))}
            </View> */}

            <View style={{ marginTop: 10 }}>
              {comments.map((cmt) => (
                <CommentBlock key={cmt.commentId}>
                  <CommentUser>{cmt.authorName}</CommentUser>
                  <CommentText>{cmt.comment}</CommentText>
                </CommentBlock>
              ))}
            </View>

          </ContentColumn>
        </Block>
      </ScrollView>
    </Container>
  );
};

export default EachPostScreen;
