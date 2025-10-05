import CustomText from './CustomText';
import { colors } from '../../styles/colors';
import styled from 'styled-components/native';
import author from '../../assets/images/icon/author.png';
import place from '../../assets/images/icon/place.png';
import filledHeart from '../../assets/images/icon/filledheart.png';
import comment from '../../assets/images/icon/chat.png';
import { View } from 'react-native';

type PhotoData = {
  photoId: number;
  authorName: string;
  authorProfileImage: string | null;
  createdAt: string;
  imageUrl: string;
  location: string;
  content: string;
  likeCount: number;
  commentCount: number;
};

type PostCardProps = {
  photo: PhotoData;
};

const PostCard = ({ photo }: PostCardProps) => {
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

  return (
    <>
      <Card key={photo.photoId}>
        <StatusView>
          <AuthorWrapper>
            <ProfileImage
              source={
                photo.authorProfileImage
                  ? { uri: photo.authorProfileImage }
                  : author
              }
            />
            <Author>{photo.authorName}</Author>
          </AuthorWrapper>
          <DateWrapper>
            <DateText>{formatDate(photo.createdAt)}</DateText>
            <TimeText>{formatTime(photo.createdAt)}</TimeText>
          </DateWrapper>
        </StatusView>

        <Content>
          <Photo source={{ uri: photo.imageUrl }} resizeMode="cover" />
          <TextContent>
            <View>
              <PlaceWrapper>
                <IconImage source={place} />
                <Place>{photo.location}</Place>
              </PlaceWrapper>
              <Line />
              <Description>{photo.content}</Description>
            </View>
            <Row>
              <Icon source={filledHeart} />
              <Count>{photo.likeCount}</Count>
              <Icon source={comment} />
              <Count>{photo.commentCount}</Count>
            </Row>
          </TextContent>
        </Content>
      </Card>
    </>
  );
};

export default PostCard;

const Card = styled.View`
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
  background-color: ${colors.gray2};
  border-radius: 8px;
`;

const TextContent = styled.View`
  flex: 1;
  gap: 20px;
`;

const PlaceWrapper = styled.View`
  flex-direction: row;
  gap: 2px;
  align-items: center;
`;

const IconImage = styled.Image`
  width: 20px;
  height: 20px;
`;

const Place = styled(CustomText)`
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
