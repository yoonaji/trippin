import styled from 'styled-components/native';
import CustomText from '../CustomText';
import { colors } from '../../../styles/colors';
import { photosDummyData } from '../../../data/photoDummyData';
import { forwardRef } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import PostCard from '../PostCard';

type ListType = 'popular' | 'route' | 'favorite';

type BottomListProps = {
  type: ListType;
};

const BottomList = forwardRef<any, BottomListProps>(({ type }, ref) => {
  return (
    <>
      <TopSection>
        {type === 'popular' && (
          <>
            <Detail>사람들이 많이 방문한 여행 장소</Detail>
            <TopText>TOP 5</TopText>
          </>
        )}
        {type === 'route' && (
          <>
            <Detail>오늘의 인기 경로</Detail>
            <TopText>TOP 1</TopText>
          </>
        )}
        {type === 'favorite' && (
          <>
            <Detail>내가 좋아한 장소</Detail>
            <TopText>TOP 5</TopText>
          </>
        )}
      </TopSection>
      <ScrollView ref={ref} contentContainerStyle={{ paddingBottom: 300 }}>
        {photosDummyData.map(photo => (
          <PostCard key={photo.photoId} data={{ type: 'photo', ...photo }} />
        ))}
      </ScrollView>
    </>
  );
});

export default BottomList;

const TopSection = styled.View`
  padding-bottom: 12px;
`;

const Detail = styled(CustomText)`
  color: ${colors.gray7};
  font-size: 12px;
  font-weight: 200;
`;

const TopText = styled(CustomText)`
  color: ${colors.blue2};
  font-size: 22px;
  font-weight: 700;
`;
