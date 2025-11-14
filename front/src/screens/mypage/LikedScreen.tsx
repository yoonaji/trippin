import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import { Container } from '../../styles/GlobalStyles';
import CustomText from '../../components/ui/CustomText';
import IconButton from '../../components/buttons/IconButton';
import heartIcon from '../../assets/images/icon/filledheart.png';
import heart from '../../assets/images/icon/heart.png';
import chatIcon from '../../assets/images/icon/chat.png';
import api from '../../../axiosConfig';
import { colors } from '../../styles/colors';
import { showError } from '../../utils/toast';
import { useNavigation } from '@react-navigation/native';
import { MyPageStackParam } from './MyPageStack';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface LikedPostType {
  id: number;
  userName: string;
  location: string;
  date: string;
  text: string;
  image: string;
}

const LikedScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<MyPageStackParam>>();
  const [posts, setPosts] = useState<LikedPostType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavoritePosts = async () => {
      try {
        const res = await api.get('/api/users/me/favorites');
        const data = res.data?.data ?? [];

        if (!Array.isArray(data)) {
          throw new Error('INVALID_RESPONSE');
        }

        setPosts(data);
      } catch (e: any) {
        showError('좋아요 목록 조회 실패', e.response?.data?.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoritePosts();
  }, []);

  if (loading) {
    return (
      <CenteredContainer>
        <CustomText style={{ fontSize: 15, marginBottom: 10 }}>
          불러오는 중...
        </CustomText>
        <Loader />
      </CenteredContainer>
    );
  }

  if (posts.length === 0) {
    return (
      <CenteredContainer>
        <HeaderRow>
          <Title>
            <FloatingButtonContainer>
              <FloatingButtonWrapper>
                <IconButton icon={heart} size={18} />
              </FloatingButtonWrapper>
            </FloatingButtonContainer>
            좋아요
          </Title>
        </HeaderRow>

        <CustomText style={{ marginTop: 20 }}>
          찜한 게시물이 아직 없습니다.
        </CustomText>
      </CenteredContainer>
    );
  }

  return (
    <Container>
      <Scroll>
        <HeaderRow>
          <Title>
            <FloatingButtonContainer>
              <FloatingButtonWrapper>
                <IconButton icon={heart} size={22} />
              </FloatingButtonWrapper>
            </FloatingButtonContainer>
            좋아요
          </Title>
        </HeaderRow>

        {posts.map(post => (
          <PostTouchable
            key={post.id}
            onPress={() => navigation.navigate('PostDetailScreen', { post })}
          >
            <PostCard>
              <UserInfoRow>
                <ProfileCircle />
                <UserName>{post.userName}</UserName>
              </UserInfoRow>

              <ContentSection>
                <PostImage source={{ uri: post.image }} />

                <InfoArea>
                  <PostLocation>{post.location}</PostLocation>
                  <PostDate>{post.date}</PostDate>

                  <Divider />

                  <PostText>{post.text}</PostText>

                  <IconRow>
                    <SmallIcon source={heartIcon} />
                    <SmallIcon source={chatIcon} />
                  </IconRow>
                </InfoArea>
              </ContentSection>
            </PostCard>
          </PostTouchable>
        ))}
      </Scroll>
    </Container>
  );
};

export default LikedScreen;

const Scroll = styled.ScrollView`
  flex: 1;
`;

const CenteredContainer = styled(Container)`
  justify-content: center;
  align-items: center;
`;

const Loader = styled.ActivityIndicator.attrs({
  size: 'large',
  color: colors.blue,
})``;

const HeaderRow = styled.View`
  padding: 15px 0;
`;

const Title = styled(CustomText)`
  font-size: 18px;
  font-weight: 700;
  color: ${colors.blue};
`;

const FloatingButtonContainer = styled.View`
  position: absolute;
  bottom: 8px;
  right: 30px;
  align-items: center;
`;

const FloatingButtonWrapper = styled.View`
  background-color: ${colors.blue};
  width: 35px;
  height: 35px;
  border-radius: 35px;
  justify-content: center;
  align-items: center;
`;

const PostTouchable = styled.TouchableOpacity`
  width: 100%;
`;

const PostCard = styled.View`
  padding: 18px;
  border-bottom-width: 1px;
  border-bottom-color: ${colors.gray2};
`;

const UserInfoRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

const ProfileCircle = styled.View`
  width: 35px;
  height: 35px;
  border-radius: 20px;
  background-color: ${colors.gray1};
  margin-right: 10px;
`;

const UserName = styled(CustomText)`
  font-size: 14px;
  font-weight: 600;
`;

const ContentSection = styled.View`
  flex-direction: row;
  margin-top: 14px;
`;

const PostImage = styled.Image`
  width: 95px;
  height: 95px;
  border-radius: 10px;
  margin-right: 12px;
`;

const InfoArea = styled.View`
  flex: 1;
`;

const PostLocation = styled(CustomText)`
  font-size: 16px;
  font-weight: 700;
`;

const PostDate = styled(CustomText)`
  font-size: 12px;
  color: ${colors.gray6};
  margin: 3px 0;
`;

const Divider = styled.View`
  height: 1px;
  background-color: ${colors.gray2};
  margin-vertical: 6px;
`;

const PostText = styled(CustomText)`
  font-size: 12px;
  color: ${colors.gray7};
  line-height: 17px;
`;

const IconRow = styled.View`
  flex-direction: row;
  margin-top: 10px;
`;

const SmallIcon = styled.Image`
  width: 20px;
  height: 20px;
  margin-right: 12px;
`;
