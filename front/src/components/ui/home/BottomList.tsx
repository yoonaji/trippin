import styled from 'styled-components/native';
import CustomText from '../CustomText';
import { colors } from '../../../styles/colors';
import { ScrollView } from 'react-native-gesture-handler';
import { BottomListItem } from '../../../types/BottomListItem';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParam } from '../../../screens/home/HomeStack';
import PostCard from '../PostCard';

type ListType = 'popular' | 'favorite' | 'route' | 'place';

type BottomListProps = {
  type: ListType;
  listData: BottomListItem[];
  setListData: React.Dispatch<React.SetStateAction<BottomListItem[]>>;
};

type Navigation = NativeStackNavigationProp<HomeStackParam>;

const BottomList = ({ type, listData, setListData }: BottomListProps) => {
  const navigation = useNavigation<Navigation>();

  return (
    <>
      <TopSection>
        {type === 'popular' && (
          <>
            <Detail>사람들이 많이 방문한 여행 장소</Detail>
            <TopText>TOP 5</TopText>
          </>
        )}
        {type === 'favorite' && (
          <>
            <Detail>내가 좋아한 장소</Detail>
            <TopText>TOP 5</TopText>
          </>
        )}
        {type === 'place' && (
          <>
            <Detail>이 장소의 게시글 목록</Detail>
            <TopText>PLACE POSTS</TopText>
          </>
        )}
      </TopSection>

      <ScrollView contentContainerStyle={{ paddingBottom: 300 }}>
        {listData.map(item => (
          <PostCard
            key={item.type === 'photo' ? item.photoId : item.postId}
            data={item}
            onPress={() =>
              navigation.navigate('PostDetailScreen', {
                postId: item.postId,
              })
            }
            onToggleLike={(photoId, liked, newCount) => {
              setListData(prev =>
                prev.map(p =>
                  p.type === 'photo' && p.photoId === photoId
                    ? { ...p, liked, likeCount: newCount }
                    : p,
                ),
              );
            }}
          />
        ))}
      </ScrollView>
    </>
  );
};

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
