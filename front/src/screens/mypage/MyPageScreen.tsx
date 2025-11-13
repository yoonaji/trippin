import React, { useEffect, useState } from "react";
import { View, ScrollView, Image, Platform, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { Container } from "../../styles/GlobalStyles";
import CustomText from "../../components/ui/CustomText";
import hearthinIcon from '../../assets/images/icon/hearthin.png';
import recordIcon from '../../assets/images/icon/record.png';
import { colors } from '../../styles/colors';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MyPageStackParam } from './MyPageStack.tsx';
import { useNavigation } from '@react-navigation/native';

type Navigation = NativeStackNavigationProp<MyPageStackParam>;

const MyPageScreen = () => {
  const navigation = useNavigation<Navigation>();
  const [posts, setPosts] = useState<any[]>([]);
  const [userInfo, setUserInfo] = useState({
    id: null as number | null,
    name: "",
    email: "",
    profileImage: null as string | null,
  });

  const BASE_URL =
    Platform.OS === 'android'
      ? 'http://10.0.2.2:8080'
      : 'http://localhost:8080';

  useEffect(() => {
    const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ5b29ubl9fYUBnbWFpbC5jb20iLCJjYXRlZ29yeSI6ImFjY2VzcyIsImlhdCI6MTc2MzAwNjExNCwiZXhwIjoxNzYzMDA3MDE0fQ.KD0LllVFEjKor7iQkHxsI0ikcfqMNQ9BBlC1vHJQ63E";

    const fetchUserInfo = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/users/me`, {
          method: "GET",
          headers: { "Authorization": `Bearer ${token}` },
        });

        if (!response.ok) {
          console.log("내 정보 API 응답 상태 에러:", response.status);
          return;
        }

        const json = await response.json();
        const data = json.data;
        if (!data) return;

        setUserInfo({
          id: data.id ?? null,
          name: data.username ?? data.name ?? "",
          email: data.email ?? "",
          profileImage: data.profileImage ?? null,
        });
      } catch (error) {
        console.log("유저 정보 fetch 실패", error);
      }
    };

    const fetchPosts = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/users/me/posts`, {
          method: "GET",
          headers: { "Authorization": `Bearer ${token}` },
        });

        if (!response.ok) {
          console.log("내 게시글 API 응답 상태 에러:", response.status);
          return;
        }

        const json = await response.json();
        const postsData = json.data;
        if (!Array.isArray(postsData)) return;
        setPosts(postsData);
      } catch (error) {
        console.log("게시글 fetch 실패", error);
      }
    };

    fetchUserInfo();
    fetchPosts();
  }, []);

  return (
    <Container>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* 프로필 영역 */}
        <ProfileContainer>
          <ProfileCircle>
            {userInfo.profileImage ? (
              <Image
                source={{ uri: userInfo.profileImage }}
                style={{ width: 70, height: 70, borderRadius: 35 }}
              />
            ) : (
              <DefaultProfile />

            )}
          </ProfileCircle>
          <CustomText weight="700" style={{ fontSize: 20, marginTop: 8 }}>
            {userInfo.name || "이름 없음"}
          </CustomText>
          <CustomText style={{ fontSize: 13, color: colors.gray6 }}>
            {userInfo.email || "이메일 없음"}
          </CustomText>
        </ProfileContainer>

{/* 좋아요 / 여행기록 카드 */}
<View
  style={{
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.sky,
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 10,
    marginHorizontal:0,
    marginBottom: 20,
  }}>
  
  
  {/* 좋아요한 글 */}
  <TouchableOpacity
    style={{ alignItems: 'flex-start', width:'50%' }}
    onPress={() => navigation.navigate('LikedScreen')}>
    <CustomText style={{ fontSize: 14 }}>좋아요한 글                          </CustomText>
    {/* <CustomText style={{ fontSize: 13, marginTop: 2 }}>??개</CustomText> */}
    {/* <Image source={hearthinIcon} style={{ width: 22, height: 22, tintColor: '#E57373', marginBottom: 4 }} /> */}
      <CountCircle>
          <Image source={hearthinIcon} style={{ width: 20, height: 18, tintColor: '#E57373', marginRight: 5 }} />
        <CustomText style={{ fontSize: 13, color: colors.gray7 }}>
          ??개
        </CustomText>
      </CountCircle>


  </TouchableOpacity>

  {/* 구분선 */}
  <View style={{ width: 1, height: 75, backgroundColor: colors.gray2 }} />

  {/* 내 여행기록 */}
  <TouchableOpacity
    style={{ alignItems: 'flex-start' , width:'50%'}}
    onPress={() => navigation.navigate('RouteScreen')}>
    <CustomText style={{ fontSize: 14 }}>  내 여행기록</CustomText>
    {/* <CustomText style={{ fontSize: 13, marginTop: 2 }}>  ??개</CustomText> */}
    {/* <Image source={recordIcon} style={{ width: 22, height: 22,  marginBottom: 4 }} /> */}
        <CountCircle>
          <Image source={recordIcon} style={{ width: 15, height: 18, marginRight: 5 }} />
          <CustomText style={{ fontSize: 13, color: colors.gray7 }}>
            {posts.length}개
          </CustomText>
        </CountCircle>

  </TouchableOpacity>
</View>

<Divider />

{/* 내가 작성한 글 문구 */}
<View style={{ alignItems: 'flex-start', marginBottom: 10 }}>
  <CustomText style={{ fontSize: 15, color: colors.gray7 }}>
    내가 작성한 글              
  </CustomText>
  <CustomText style={{ fontSize: 13, color: colors.blue, marginTop: 2 }}>
    총 {posts.length}개
  </CustomText>
</View>


        {/* 게시글 리스트 */}
        {Array.isArray(posts) && posts.length > 0 ? (
          posts.map((post, idx) => (
            <PostBlock key={post.postId ?? idx}>
              <CustomText weight="700" style={{ fontSize: 18, marginBottom: 5 }}>
                {post.title}
              </CustomText>
              <CustomText style={{ fontSize: 13, color: colors.gray6 }}>
                {post.createdAt ? new Date(post.createdAt).toLocaleDateString('ko-KR') : ''}
              </CustomText>
            </PostBlock>
          ))
        ) : (
          <CustomText style={{ textAlign: "center", marginTop: 20 }}>
            게시글이 없습니다.
          </CustomText>
        )}
      </ScrollView>
    </Container>
  );
};

export default MyPageScreen;

// -------------------- 스타일 --------------------
const ProfileContainer = styled.View`
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

const DefaultProfile = styled.Image`
  width: 60px;
  height: 60px;
`;

const CardRow = styled.View`
  flex-direction: row;
  justify-content: space-evenly;
  margin-bottom: 25px;
`;

const Card = styled(TouchableOpacity)`
  background-color: ${colors.gray1};
  border-radius: 15px;
  padding: 20px 30px;
  width: 45%;
  align-items: center;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
`;

const Divider = styled.View`
  height: 0.6px;
  background-color: ${colors.gray2};
  width: 100%;
  margin-bottom: 15px;
`;

const PostBlock = styled.View`
  padding: 15px 20px;
  border-bottom-width: 0.6px;
  border-bottom-color: ${colors.gray2};
`;

const CardContainer = styled.View`
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  background-color: ${colors.gray1};
  border-radius: 15px;
  padding: 18px 10px;
  margin: 0 20px 25px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.08);
  elevation: 3; /* Android 그림자 */
`;

const CountCircle = styled.View`
  width: 50px; 
  height: 50px;
  border-radius: 30px; 
  background-color: ${colors.white}; 
  flex-direction: row; /* 아이콘과 텍스트를 가로로 배치 */
  justify-content: center;
  align-items: center;
  margin-top: 15px; /* 상단 텍스트와의 간격 */
  marginLeft:  100px;  
`;

