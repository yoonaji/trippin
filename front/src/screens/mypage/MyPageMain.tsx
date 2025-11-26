import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MyPageStackParam } from './MyPageStack';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { showError } from '../../utils/toast';
import api from '../../../axiosConfig';
import { Container } from '../../styles/GlobalStyles';
import { ScrollView } from 'react-native-gesture-handler';
import CustomText from '../../components/ui/CustomText';
import { colors } from '../../styles/colors';
import styled from 'styled-components/native';
import filledHeart from '../../assets/images/icon/filledheart.png';
import place from '../../assets/images/icon/place.png';
import { useLoading } from '../../components/ui/LoadingContext';
import { View } from 'react-native';
import right from '../../assets/images/icon/right.png';
import PostCard from '../../components/ui/PostCard';

type Navigation = NativeStackNavigationProp<MyPageStackParam>;

const MyPageMain = () => {
  const navigation = useNavigation<Navigation>();
  const { setLoadingPromise } = useLoading();

  const [posts, setPosts] = useState<any[]>([]);
  const [userInfo, setUserInfo] = useState({
    id: null as number | null,
    name: '',
    email: '',
    profileImage: null as string | null,
  });
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [routeCount, setRouteCount] = useState(0);
  const [postCount, setPostCount] = useState(0);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (!isFocused) return;
    const fetchUserInfo = async () => {
      try {
        const res = await api.get('/api/users/me');
        const data = res.data?.data;

        if (!data) return;

        setUserInfo({
          id: data.id ?? null,
          name: data.username ?? data.name ?? '',
          email: data.email ?? '',
          profileImage: data.profileImage ?? null,
        });
      } catch (e: any) {
        showError('내 정보 조회 실패', e.response?.data?.message);
      }
    };

    const fetchFavorite = async () => {
      const res = await api.get('/api/users/me/favorites');
      const list = res.data?.data;
      if (Array.isArray(list)) setFavoriteCount(list.length);
    };

    const fetchRoutes = async () => {
      const res = await api.get('/api/users/me/routes');
      const list = res.data?.data;
      if (Array.isArray(list)) setRouteCount(list.length);
    };

    const fetchPosts = async () => {
      const res = await api.get('/api/users/me/posts');
      const list = res.data?.data;
      if (Array.isArray(list)) {
        setPostCount(list.length);
        setPosts(list);
      }
    };

    const loadAll = async () => {
      await setLoadingPromise(
        Promise.all([
          fetchUserInfo(),
          fetchFavorite(),
          fetchRoutes(),
          fetchPosts(),
        ]),
        '내 정보를 불러오는 중...',
      );
    };

    loadAll();
  }, [isFocused]);

  return (
    <Container>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ alignItems: 'center' }}
        style={{ width: '100%' }}
      >
        <ProfileBox>
          <ProfileImg
            source={
              userInfo.profileImage
                ? { uri: userInfo.profileImage }
                : require('../../assets/images/icon/author.png')
            }
          />

          <CustomText weight="700" style={{ fontSize: 20, marginTop: 8 }}>
            {userInfo.name || '이름 없음'}
          </CustomText>
          <CustomText style={{ fontSize: 13, color: colors.gray6 }}>
            {userInfo.email || '이메일 없음'}
          </CustomText>
        </ProfileBox>

        <CardContainer>
          <CardTouchable onPress={() => navigation.navigate('LikedScreen')}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <CardText>좋아요한 글</CardText>
              <CardArrow source={right} />
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <CountCircle>
                <Icon source={filledHeart} style={{ width: 18, height: 18 }} />
                <CountText>{favoriteCount}개</CountText>
              </CountCircle>
            </View>
          </CardTouchable>

          <CardDivider />

          <CardTouchable onPress={() => navigation.navigate('RouteScreen')}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <CardText>내 여행 기록</CardText>
              <CardArrow source={right} />
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <CountCircle>
                <Icon source={place} style={{ width: 24, height: 24 }} />
                <CountText>{routeCount}개</CountText>
              </CountCircle>
            </View>
          </CardTouchable>
        </CardContainer>

        <Divider />

        <SectionTitleBox>
          <MyPostText>내가 작성한 글</MyPostText>
          <PostCountText>총 {postCount}개</PostCountText>
        </SectionTitleBox>

        {posts.length > 0 &&
          posts.map((post, idx) => (
            <PostCard
              key={post.postId ?? idx}
              onPress={() =>
                navigation.navigate('PostDetailScreen', { postId: post.postId })
              }
              data={{
                type: 'post',
                postId: post.postId,
                title: post.title,
                thumbnailUrl: post.thumbnailUrl,
                period: post.period,
                authorName: userInfo.name,
                authorProfileImage: userInfo.profileImage,
              }}
            />
          ))}
      </ScrollView>
    </Container>
  );
};

export default MyPageMain;

const ProfileBox = styled.View`
  align-items: center;
  margin-top: 50px;
  margin-bottom: 25px;
`;

const ProfileImg = styled.Image`
  width: 120px;
  height: 120px;
  border-radius: 120px;
`;

const CardContainer = styled.View`
  width: 100%;
  height: 103px;
  flex-direction: row;
  justify-content: center;
  align-items: space-between;
  background-color: #e9f3fc;
  border-radius: 10px;
  padding: 7px 13px;
  margin-bottom: 20px;
`;

const CardTouchable = styled.TouchableOpacity`
  flex: 1;
`;

const CardText = styled(CustomText)`
  color: ${colors.gray6};
  font-size: 13px;
  font-weight: 500;
`;

const CardArrow = styled.Image`
  width: 8px;
  height: 13px;
`;

const CardDivider = styled.View`
  width: 1px;
  height: 75px;
  background-color: ${colors.gray2};
  margin-horizontal: 14px;
`;

const CountCircle = styled.View`
  position: relative;
  width: 50px;
  height: 50px;
  background-color: ${colors.white};
  border-radius: 30px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 15px;
`;

const Icon = styled.Image`
  position: absolute;
  left: -5px;
  bottom: -1px;
`;

const CountText = styled(CustomText)`
  font-size: 13px;
  color: ${colors.gray7};
`;

const Divider = styled.View`
  height: 0.6px;
  background-color: ${colors.gray2};
  width: 100%;
  margin-bottom: 15px;
`;

const SectionTitleBox = styled.View`
  width: 100%;
  align-items: flex-start;
  margin-bottom: 10px;
`;

const MyPostText = styled(CustomText)`
  font-size: 13px;
  font-weight: 200;
  color: ${colors.gray7};
`;

const PostCountText = styled(CustomText)`
  font-size: 15px;
  font-weight: 500;
  color: ${colors.blue2};
`;
