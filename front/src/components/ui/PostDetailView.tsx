import styled from 'styled-components/native';
import Carousel from './Carousel';
import CustomText from './CustomText';
import { useState, useEffect } from 'react';
import { View } from 'react-native';
import { colors } from '../../styles/colors';
import plane from '../../assets/images/icon/plane.png';
import api from '../../../axiosConfig';
import { showError, showSuccess } from '../../utils/toast';
import IconButton from '../buttons/IconButton';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<Comment[]>(current.comments);

  const [myName, setMyName] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem('username').then(stored => {
      if (stored) setMyName(stored);
    });
  }, []);

  useEffect(() => {
    setComments(current.comments);
  }, [activeIndex]);

  const submitComment = async () => {
    if (!comment.trim()) return;

    try {
      const res = await api.post(`/api/photos/${current.photoId}/comments`, {
        comment: comment,
      });

      const newCmt: Comment = res.data.data;

      setComments(prev => [...prev, newCmt]);
      setComment('');
      showSuccess('댓글 작성 성공');
    } catch (err: any) {
      showError('댓글 작성 실패', err.response?.data?.message);
    }
  };

  const deleteComment = async (commentId: number) => {
    try {
      await api.delete(`/api/photos/${current.photoId}/comments/${commentId}`);

      const res = await api.get(`/api/photos/${current.photoId}`);
      const updated = res.data.data;
      setComments(updated.comments);
      showSuccess('댓글 삭제 성공');
    } catch (err: any) {
      showError('댓글 삭제 실패', err.response?.data?.message);
    }
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);

    const year = String(date.getFullYear()).slice(2); // 25
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 09
    const day = String(date.getDate()).padStart(2, '0'); // 21

    const week = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];

    return `${year}.${month}.${day} (${week})`;
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');

    const isPM = hours >= 12;
    const period = isPM ? '오후' : '오전';

    if (hours > 12) hours -= 12;
    if (hours === 0) hours = 12;

    return `${period} ${hours}:${minutes}`;
  };

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
        <Line />
        <DescriptionBox>
          <Description>{current.content}</Description>
        </DescriptionBox>

        <CommentInputBox>
          <CommentInput
            placeholder="댓글을 입력하세요"
            placeholderTextColor={colors.gray4}
            value={comment}
            onChangeText={setComment}
          />
          <IconButton icon={plane} size={15} onPress={submitComment} />
        </CommentInputBox>

        <PostComments>
          {comments.length === 0 ? (
            <View
              style={{
                alignItems: 'center',
              }}
            >
              <EmptyComment>댓글이 없습니다.</EmptyComment>
            </View>
          ) : (
            comments.map(cmt => (
              <CommentBlock key={cmt.commentId}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <CommentUserInfo>
                    <CommentProfileImage
                      source={
                        cmt.authorProfileImage
                          ? { uri: cmt.authorProfileImage }
                          : require('../../assets/images/icon/author.png')
                      }
                    />
                    <CommentUser>{cmt.authorName}</CommentUser>
                  </CommentUserInfo>
                  <DateWrapper>
                    <CommentDate>{formatDate(cmt.createdAt)}</CommentDate>
                    <CommentTime>{formatTime(cmt.createdAt)}</CommentTime>
                  </DateWrapper>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <CommentText>{cmt.comment}</CommentText>
                  {cmt.authorName === myName && (
                    <DeleteButton onPress={() => deleteComment(cmt.commentId)}>
                      <DeleteText>댓글 삭제</DeleteText>
                    </DeleteButton>
                  )}
                </View>
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
  font-size: 18px;
  font-weight: 700;
  color: ${colors.gray7};
`;

const Period = styled(CustomText)`
  color: ${colors.gray5};
  font-size: 11px;
  font-weight: 400;
  line-height: 25px;
`;

const Line = styled.View`
  background-color: ${colors.gray2};
  width: 100%;
  height: 1px;
`;

const DescriptionBox = styled.View`
  min-height: 45px;
  margin-vertical: 14px;
`;

const Description = styled(CustomText)``;

const CommentInputBox = styled.View`
  width: 100%;
  height: 40px;
  border-radius: 10px;
  border: 0.5px solid ${colors.gray3};
  background: #f7fbfe;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-horizontal: 13px;
  margin-bottom: 15px;
`;

const CommentInput = styled.TextInput`
  font-size: 13px;
  flex: 1;
  padding-right: 10px;
`;

const PostComments = styled.View`
  min-height: 200px;
  width: 100%;
`;

const EmptyComment = styled(CustomText)`
  color: ${colors.gray5};
  font-size: 13px;
`;

const CommentBlock = styled.View`
  width: 100%;
  min-height: 62px;
  padding: 10px 12px;
  border-radius: 13px;
  background-color: ${colors.white};
  gap: 6px;

  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.15;
  shadow-radius: 4px;

  elevation: 0.5;
`;

const CommentUserInfo = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 6px;
`;

const CommentProfileImage = styled.Image`
  width: 25px;
  height: 25px;
  border-radius: 25px;
`;

const CommentUser = styled(CustomText)`
  color: ${colors.gray7};
  font-size: 13px;
  font-weight: 500;
`;

const DateWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 2px;
`;

const CommentDate = styled(CustomText)`
  color: ${colors.gray7};
  font-size: 11px;
  font-weight: 500;
`;

const CommentTime = styled(CustomText)`
  color: ${colors.gray5};
  font-size: 10px;
  font-weight: 400;
`;

const DeleteButton = styled.Pressable`
  padding: 4px 8px;
  border-radius: 5px;
  background: #d9d9d9;
  justify-content: center;
  align-items: center;
`;

const DeleteText = styled(CustomText)`
  font-size: 12px;
  color: ${colors.gray5};
`;

const CommentText = styled(CustomText)`
  color: ${colors.gray7};
  font-size: 13px;
  font-weight: 300;
`;
