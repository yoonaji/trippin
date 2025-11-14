import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MyPageStackParam } from './MyPageStack';
import { useNavigation } from '@react-navigation/native';
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

type Navigation = NativeStackNavigationProp<MyPageStackParam>;

const MyPageMain = () => {
  const navigation = useNavigation<Navigation>();
  const [posts, setPosts] = useState<any[]>([]);
  const [userInfo, setUserInfo] = useState({
    id: null as number | null,
    name: '',
    email: '',
    profileImage: null as string | null,
  });

  useEffect(() => {
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

    const fetchPosts = async () => {
      try {
        const res = await api.get('/api/users/me/posts');
        const list = res.data?.data;

        if (Array.isArray(list)) {
          setPosts(list);
        }
      } catch (e: any) {
        showError('게시글 조회 실패', e.response?.data?.message);
      }
    };

    fetchUserInfo();
    fetchPosts();
  }, []);

  return (
    <Container>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ProfileBox>
          <ProfileCircle>
            {userInfo.profileImage ? (
              <ProfileImg source={{ uri: userInfo.profileImage }} />
            ) : (
              <DefaultImg
                source={require('../../assets/images/icon/author.png')}
              />
            )}
          </ProfileCircle>

          <CustomText weight="700" style={{ fontSize: 20, marginTop: 8 }}>
            {userInfo.name || '이름 없음'}
          </CustomText>
          <CustomText style={{ fontSize: 13, color: colors.gray6 }}>
            {userInfo.email || '이메일 없음'}
          </CustomText>
        </ProfileBox>

        <CardContainer>
          <CardTouchable onPress={() => navigation.navigate('LikedScreen')}>
            <CustomText style={{ fontSize: 14 }}>좋아요한 글</CustomText>
            <CountCircle>
              <Icon source={filledHeart} />
              <CountText>??개</CountText>
            </CountCircle>
          </CardTouchable>

          <DividerLine />

          <CardTouchable onPress={() => navigation.navigate('RouteScreen')}>
            <CustomText style={{ fontSize: 14 }}>내 여행 기록</CustomText>
            <CountCircle>
              <IconSmall source={place} />
              <CountText>{posts.length}개</CountText>
            </CountCircle>
          </CardTouchable>
        </CardContainer>
        <Divider />

        <SectionTitleBox>
          <CustomText style={{ fontSize: 15, color: colors.gray7 }}>
            내가 작성한 글
          </CustomText>
          <CustomText
            style={{ fontSize: 13, color: colors.blue, marginTop: 2 }}
          >
            총 {posts.length}개
          </CustomText>
        </SectionTitleBox>

        {posts.length > 0 &&
          posts.map((post, idx) => (
            <PostItem key={post.postId ?? idx}>
              <CustomText
                weight="700"
                style={{ fontSize: 18, marginBottom: 5 }}
              >
                {post.title}
              </CustomText>
              <CustomText style={{ fontSize: 13, color: colors.gray6 }}>
                {post.createdAt
                  ? new Date(post.createdAt).toLocaleDateString('ko-KR')
                  : ''}
              </CustomText>
            </PostItem>
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

const ProfileCircle = styled.View`
  width: 120px;
  height: 120px;
  border-radius: 140px;
  background-color: #fbe9dd;
  justify-content: center;
  align-items: center;
`;

const ProfileImg = styled.Image`
  width: 120px;
  height: 120px;
  border-radius: 60px;
`;

const DefaultImg = styled.Image`
  width: 60px;
  height: 60px;
`;

const CardContainer = styled.View`
  flex-direction: row;
  align-items: flex-start;
  background-color: ${colors.sky};
  border-radius: 20px;
  padding: 18px 10px;
  margin-bottom: 20px;
`;

const CardTouchable = styled.TouchableOpacity`
  width: 50%;
  align-items: flex-start;
`;

const DividerLine = styled.View`
  width: 1px;
  height: 75px;
  background-color: ${colors.gray2};
`;

const CountCircle = styled.View`
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
  width: 20px;
  height: 18px;
  margin-right: 5px;
  tint-color: #e57373;
`;

const IconSmall = styled.Image`
  width: 15px;
  height: 18px;
  margin-right: 5px;
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
  align-items: flex-start;
  margin-bottom: 10px;
`;

const PostItem = styled.View`
  padding: 15px 20px;
  border-bottom-width: 0.6px;
  border-bottom-color: ${colors.gray2};
`;
