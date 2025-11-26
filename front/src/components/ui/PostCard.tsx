import CustomText from './CustomText';
import { colors } from '../../styles/colors';
import styled from 'styled-components/native';
import author from '../../assets/images/icon/author.png';
import noImage from '../../assets/images/icon/no_image.png';
import place from '../../assets/images/icon/place.png';
import filledHeart from '../../assets/images/icon/filledheart.png';
import heart from '../../assets/images/icon/heart.png';
import comment from '../../assets/images/icon/chat.png';
import { View } from 'react-native';
import { useEffect, useState } from 'react';
import api from '../../../axiosConfig';

type PhotoData = {
  type: 'photo';
  photoId: number;
  authorName: string;
  authorProfileImage: string | null;
  createdAt: string;
  imageUrl: string;
  location: string;
  content: string;
  likeCount: number;
  commentCount: number;
  liked?: boolean;
};

type PostData = {
  type: 'post';
  postId: number;
  title: string;
  thumbnailUrl: string | null;
  period: string | null;
  authorName: string;
  authorProfileImage: string | null;
};

type PostCardProps = {
  data: PhotoData | PostData;
  onPress?: () => void;
  onToggleLike?: (photoId: number, liked: boolean, likeCount: number) => void;
};

const isPhotoData = (data: PhotoData | PostData): data is PhotoData => {
  return data.type === 'photo';
};

const PostCard = ({ data, onPress, onToggleLike }: PostCardProps) => {
  if (!data) return null;

  const isPost = data.type === 'post';
  const isPhoto = isPhotoData(data);

  const [loadFailed, setLoadFailed] = useState(false);
  const [isLiked, setIsLiked] = useState(
    isPhoto ? Boolean(data.liked) : false,
  );
  const [likeCount, setLikeCount] = useState(isPhoto ? data.likeCount : 0);
  const [processing, setProcessing] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const year = String(date.getFullYear()).slice(2);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const weekday = days[date.getDay()];
    return `${year}.${month}.${day} (${weekday})`;
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('ko-KR', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatLocation = (location: string) => {
    if (!location) return '';

    const parts = location.split(' ').filter(Boolean);
    const keywords = ['읍', '면', '동', '리', '로', '길', '가'];

    let breakIndex = -1;

    for (let i = 0; i < parts.length; i++) {
      const word = parts[i];
      if (keywords.some(k => word.endsWith(k))) {
        breakIndex = i;
        break;
      }
    }

    if (breakIndex === -1) return location;

    let firstPart = parts.slice(0, breakIndex + 1).join(' ');
    let secondPart = parts.slice(breakIndex + 1).join(' ');

    const nextWord = parts[breakIndex + 1];
    const startsWithNumber = nextWord && /^\d/.test(nextWord);

    if (startsWithNumber) {
      firstPart += ' ' + nextWord;
      secondPart = parts.slice(breakIndex + 2).join(' ');
    }

    if (!secondPart) return firstPart;

    return `${firstPart}\n${secondPart}`;
  };

  const toggleLike = async () => {
    if (!isPhoto || processing) return;

    setProcessing(true);

    const prevLiked = isLiked;
    const prevCount = likeCount;

    const nextLiked = !prevLiked;
    const nextCount = nextLiked ? prevCount + 1 : prevCount - 1;

    setIsLiked(nextLiked);
    setLikeCount(nextCount);
    onToggleLike?.(data.photoId, nextLiked, nextCount);

    try {
      if (nextLiked) {
        await api.post(`/api/photos/${data.photoId}/like`);
      } else {
        await api.delete(`/api/photos/${data.photoId}/like`);
      }
    } catch (e) {
      setIsLiked(prevLiked);
      setLikeCount(prevCount);
      onToggleLike?.(data.photoId, prevLiked, prevCount);
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    if (isPhoto) {
      setIsLiked(Boolean(data.liked));
      setLikeCount(data.likeCount);
    }
  }, [isPhoto, isPhoto ? data.photoId : undefined, isPhoto ? data.liked : undefined, isPhoto ? data.likeCount : undefined]);

  return (
    <Card onPress={onPress}>
      <StatusView>
        <AuthorWrapper>
          <ProfileImage
            source={
              data.authorProfileImage
                ? { uri: data.authorProfileImage }
                : author
            }
          />
          <Author>{data.authorName}</Author>
        </AuthorWrapper>

        {isPhoto && data.createdAt && (
          <DateWrapper>
            <DateText>{formatDate(data.createdAt)}</DateText>
            <TimeText>{formatTime(data.createdAt)}</TimeText>
          </DateWrapper>
        )}
      </StatusView>

      <Content>
        <Photo
          source={
            loadFailed
              ? noImage
              : isPost
              ? data.thumbnailUrl
                ? { uri: data.thumbnailUrl }
                : noImage
              : data.imageUrl
              ? { uri: data.imageUrl }
              : noImage
          }
          onError={() => setLoadFailed(true)}
        />

        <TextContent>
          <View>
            {isPost ? (
              <CustomText style={{ fontSize: 15, fontWeight: '700' }}>
                {data.title}
              </CustomText>
            ) : (
              <PlaceWrapper>
                <IconImage source={place} />
                <Place>{formatLocation(data.location)}</Place>
              </PlaceWrapper>
            )}

            <Line />

            {isPost ? (
              <PeriodText>{data.period}</PeriodText>
            ) : (
              <Description>{data.content}</Description>
            )}
          </View>

          {isPhoto && (
            <Row>
              <HeartButton onPress={toggleLike}>
                <Icon source={isLiked ? filledHeart : heart} />
              </HeartButton>
              <Count>{likeCount}</Count>
              <Icon source={comment} />
              <Count>{data.commentCount}</Count>
            </Row>
          )}
        </TextContent>
      </Content>
    </Card>
  );
};

export default PostCard;

const Card = styled.Pressable`
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  border: 0.5px solid ${colors.gray3};
  margin-bottom: 12px;
  gap: 9px;
`;

const StatusView = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const AuthorWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 5px;
`;

const ProfileImage = styled.Image`
  width: 22px;
  height: 22px;
  border-radius: 21px;
`;

const Author = styled(CustomText)`
  color: ${colors.gray7};
  font-size: 12px;
  font-weight: 500;
  line-height: 12px;
`;

const DateWrapper = styled.View`
  flex-direction: row;
  gap: 1px;
`;

const DateText = styled(CustomText)`
  color: ${colors.gray7};
  font-size: 10px;
  font-weight: 500;
  line-height: 10px;
`;

const TimeText = styled(CustomText)`
  color: ${colors.gray5};
  font-size: 10px;
  line-height: 10px;
`;

const Content = styled.View`
  flex-direction: row;
  gap: 15px;
`;

const Photo = styled.Image`
  width: 100px;
  height: 100px;
  border-radius: 8px;
  background-color: ${colors.gray1};
`;

const TextContent = styled.View`
  flex: 1;
  gap: 20px;
`;

const PlaceWrapper = styled.View`
  flex-direction: row;
  align-items: flex-start;
  gap: 2px;
  max-width: 100%;
  flex-shrink: 1;
`;

const IconImage = styled.Image`
  width: 20px;
  height: 20px;
`;

const Place = styled(CustomText).attrs({
  numberOfLines: 3,
  ellipsizeMode: 'tail',
})`
  flex-shrink: 1;
  color: ${colors.gray7};
  font-size: 14px;
  font-weight: 700;
  line-height: 15px;
`;

const Line = styled.View`
  width: 100%;
  height: 0.5px;
  background: ${colors.gray5};
  margin-top: 8px;
  margin-bottom: 6px;
`;

const PeriodText = styled(CustomText)`
  color: ${colors.gray5};
  font-size: 12px;
  font-weight: 400;
`;

const Description = styled(CustomText).attrs({
  numberOfLines: 2,
  ellipsizeMode: 'tail',
})`
  color: ${colors.gray7};
  width: 100%;
  font-size: 10px;
  font-weight: 400;
  line-height: 13px;
`;

const Row = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  gap: 3px;
`;

const HeartButton = styled.Pressable``;

const Icon = styled.Image`
  width: 19px;
  height: 19px;
`;

const Count = styled(CustomText)`
  color: ${colors.gray7};
  font-size: 11px;
  font-weight: 500;
  line-height: 13px;
`;
