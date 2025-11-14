import { useEffect, useState } from 'react';
import { Container } from '../../styles/GlobalStyles';
import { ScrollView } from 'react-native-gesture-handler';
import { colors } from '../../styles/colors';
import api from '../../../axiosConfig';
import styled from 'styled-components/native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { showError } from '../../utils/toast';

type PostDetailParam = {
  PostDetailScreen: {
    post: any;
    comments?: any[];
  };
};

const PostDetailScreen = () => {
  const route = useRoute<RouteProp<PostDetailParam, 'PostDetailScreen'>>();
  const { post, comments: initComments } = route.params;

  const [comments, setComments] = useState(initComments ?? []);

  useEffect(() => {
    if (!initComments) {
      fetchComments();
    }
  }, []);

  const fetchComments = async () => {
    try {
      const res = await api.get(`/api/posts/${post.postId}/comments`);
      setComments(res.data.data ?? []);
    } catch (error: any) {
      showError('댓글 불러오기 실패', error.response?.data?.message);
    }
  };

  return (
    <Container>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Block>
          <Header>
            <UserInfo>
              <ProfileImage
                source={
                  post.authorProfileImage
                    ? { uri: post.authorProfileImage }
                    : undefined
                }
              />
              <UserName>{post.authorName}</UserName>
            </UserInfo>
          </Header>
          <ContentColumn>
            <PostImage
              source={
                post.thumbnailUrl
                  ? { uri: post.thumbnailUrl }
                  : require('../../assets/images/icon/author.png')
              }
            />
            <Title>{post.title}</Title>
            <Period>{post.period}</Period>
            <PostComments>
              {comments.length === 0 ? (
                <></>
              ) : (
                comments.map(cmt => (
                  <CommentBlock key={cmt.commentId}>
                    <CommentUser>{cmt.authorName}</CommentUser>
                    <CommentText>{cmt.comment}</CommentText>
                  </CommentBlock>
                ))
              )}
            </PostComments>
          </ContentColumn>
        </Block>
      </ScrollView>
    </Container>
  );
};

export default PostDetailScreen;

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
  padding: 0 5px;
`;

const UserInfo = styled.View`
  flex-direction: row;
  align-items: center;
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
  color: ${colors.gray8};
`;

const ContentColumn = styled.View`
  flex-direction: column;
  width: 100%;
`;

const PostImage = styled.Image`
  width: 100%;
  height: 250px;
  border-radius: 12px;
  margin-top: 16px;
`;

const Title = styled.Text`
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 4px;
`;

const Period = styled.Text`
  color: ${colors.gray4};
  font-size: 13px;
  margin-bottom: 10px;
`;

const PostComments = styled.View`
  margin-top: 10px;
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
