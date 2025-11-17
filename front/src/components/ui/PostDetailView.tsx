import styled from 'styled-components/native';
import Carousel from './Carousel';
import CustomText from './CustomText';
import { useState } from 'react';
import { View } from 'react-native';
import { colors } from '../../styles/colors';

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

const PostDetailView = ({ data }: { data: PostDetail }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const current = data.photos[activeIndex];

  return (
    <Block>
      <UserInfo>
        <ProfileImage
          source={
            data.authorProfileImage
              ? { uri: data.authorProfileImage }
              : require('../../assets/images/icon/author.png')
          }
        />
        <UserName>{data.authorName}</UserName>
      </UserInfo>

      <View style={{ height: 200, marginVertical: 16 }}>
        <Carousel
          images={data.photos.map(p => p.imageUrl)}
          itemSize={200}
          onIndexChange={idx => setActiveIndex(idx)}
        />
      </View>

      <DotContainer>
        {data.photos.map((_, idx) => (
          <Dot key={idx} active={idx === activeIndex} />
        ))}
      </DotContainer>

      <Content>
        <Title>{data.title}</Title>
        <Period>{data.period}</Period>

        <Description>{current.content}</Description>

        <PostComments>
          {current.comments.length === 0 ? (
            <></>
          ) : (
            current.comments.map(cmt => (
              <CommentBlock key={cmt.commentId}>
                <CommentUser>{cmt.authorName}</CommentUser>
                <CommentText>{cmt.comment}</CommentText>
              </CommentBlock>
            ))
          )}
        </PostComments>
      </Content>
    </Block>
  );
};

export default PostDetailView;

const Block = styled.View`
  width: 100%;
  border-radius: 16px;
  background-color: #ecf5fc;
  padding: 20px;
  elevation: 3;
  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.15;
  shadow-radius: 4px;
  flex: 1;
`;

const UserInfo = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

const ProfileImage = styled.Image`
  width: 38px;
  height: 38px;
  border-radius: 40px;
`;

const UserName = styled(CustomText)`
  font-weight: 500;
  font-size: 15px;
  color: ${colors.gray7};
`;

const DotContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  gap: 6px;
  margin-bottom: 16px;
`;

const Dot = styled.View<{ active?: boolean }>`
  width: 7px;
  height: 7px;
  border-radius: 8px;
  background: ${({ active }) => (active ? colors.gray6 : colors.gray2)};
`;

const Content = styled.View`
  align-items: center;
`;

const Title = styled(CustomText)`
  font-size: 15px;
`;

const Period = styled(CustomText)``;
const Description = styled(CustomText)``;
const PostComments = styled.View``;
const CommentBlock = styled.View``;
const CommentUser = styled(CustomText)``;
const CommentText = styled(CustomText)``;
