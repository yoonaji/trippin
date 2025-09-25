import React, { useEffect, useState } from "react";
import { View, ScrollView, Image } from "react-native";
import styled from "styled-components/native";
import { Container } from "../../styles/GlobalStyles";
import CustomText from "../../components/ui/CustomText";
import { Block, Header, UserInfo, ProfileImage, UserName } from '../../styles/write.ts';
import hearthinIcon from '../../assets/images/icon/hearthin.png';
import record from '../../assets/images/icon/record.png';
import setting from '../../assets/images/icon/setting.png';
import IconButton from '../../components/buttons/IconButton';
import { colors } from '../../styles/colors';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MyPageStackParam } from './MyPageStack.tsx';
import { useNavigation } from '@react-navigation/native';

type Navigation = NativeStackNavigationProp<MyPageStackParam>;

const MyPageScreen = () => {
  const navigation = useNavigation<Navigation>();
  const [posts, setPosts] = useState<any[]>([]);
  const [userInfo, setUserInfo] = useState({
    id: null as number | null, // 사용자 ID를 저장할 공간 추가
    name: "",
    email: "",
    profileImage: null as string | null,
  });
  useEffect(() => {
    const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ5b29ubl9fYUBnbWFpbC5jb20iLCJjYXRlZ29yeSI6ImFjY2VzcyIsImlhdCI6MTc1ODU5NzI2NywiZXhwIjoxNzU4NTk4MTY3fQ.Vcd2iCxlDZIqkwOfoSdwFVuh6LxAfUcL8do__X7HleU";
    const fetchUserInfo = async () => {
      try {
        const response = await fetch("http://10.0.2.2:8080/api/users/me", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const json = await response.json();
        if (json.success) {
          setUserInfo({
            id: json.data.id, // 받아온 사용자 ID 저장
            name: json.data.username,
            email: json.data.email,
            profileImage: json.data.profileImage,
      });

        }
      } catch (error) {
        console.log("유저 정보 fetch 실패", error);
      }
    };
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://10.0.2.2:8080/api/users/me/posts", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const json = await response.json();
        if (json.success) {
          setPosts(json.data);
        }
      } catch (error) {
        console.log("게시글 fetch 실패", error);
      }
    };

    fetchUserInfo();
    fetchPosts();
  }, []);

  return (
    <Container>
      <Header style={{ marginTop: 30 }}>
        <ProfileImagePlaceholder />
        <ProfileInfo>
          <View>
            <CustomText weight="700" style={{ fontSize: 20 }}>
              {userInfo.name || "익명"}
            </CustomText>
          </View>
          <CustomText style={{ fontSize: 14 }}>
            {userInfo.email || "이메일 없음"}
          </CustomText>
          {/* ID가 있을 경우에만 표시 */}
          {userInfo.id && (
            <CustomText style={{ fontSize: 12, color: colors.gray6, marginTop: 4 }}>
              ID: {userInfo.id}
            </CustomText>
          )}
        </ProfileInfo>
      </Header>

      <Divider />

      {/* 아이콘 3개 */}
      <IconRow>
        <IconItem>
          <FloatingButtonWrapper>
            <IconButton icon={setting} size={35} onPress={() => navigation.navigate('InfoEditScreen')} />
          </FloatingButtonWrapper>
          <CustomText style={{ marginTop: 6, fontSize: 13 }}>설정</CustomText>
        </IconItem>
        <IconItem>
          <FloatingButtonWrapper>
            <IconButton icon={hearthinIcon} size={35} onPress={() => navigation.navigate('LikedScreen')} />
          </FloatingButtonWrapper>
          <CustomText style={{ marginTop: 6, fontSize: 13 }}>좋아요</CustomText>
        </IconItem>
        <IconItem>
          <FloatingButtonWrapper>
            <IconButton icon={record} size={35} onPress={() => navigation.navigate('RouteScreen')} />
          </FloatingButtonWrapper>
          <CustomText style={{ marginTop: 6, fontSize: 13 }}>내 여행기록</CustomText>
        </IconItem>
      </IconRow>

      <Divider />

      {/* 피드 영역: 원본 디자인대로 */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {Array.isArray(posts) && posts.length > 0 ? (
          posts.map((post, idx) => (
            <Block key={post.postId ?? idx}>
              <Header>
                <UserInfo>
                  <ProfileImage />
                  {/* 게시글 작성자 이름은 userInfo 상태에서 가져옴 */}
                  <UserName>{userInfo.name || '작성자'}</UserName>
                </UserInfo>
              </Header>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
                <View style={{ flex: 1, marginRight: 12 }}>
                  <CustomText weight="900" style={{ fontSize: 20, fontWeight: 'bold' }}>
                    {/* API 데이터의 'title' 필드 사용 */}
                    {post.title}
                  </CustomText>
                  <Divider />
                  <CustomText style={{ fontSize: 13 }}>
                    {/* API 데이터의 'createdAt' 필드 사용. 날짜 형식은 필요에 맞게 변경 */}
                    {new Date(post.createdAt).toLocaleDateString('ko-KR')}
                  </CustomText>
                </View>
                <View style={{ width: 100, height: 100, position: 'relative' }}>
                  <Image
                    // API에 이미지 URL이 없다면 임시 이미지 사용
                    source={{ uri: `https://picsum.photos/100?random=${idx}` }}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="cover"
                  />
                  <View
                    style={{
                      position: 'absolute',
                      bottom: 7,
                      right: 8,
                      backgroundColor: 'rgba(255,255,255,0.85)',
                      borderRadius: 7,
                      paddingHorizontal: 10,
                      paddingVertical: 2,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <CustomText style={{ fontSize: 9, color: colors.gray8 }}>
                      1/4
                    </CustomText>
                  </View>
                </View>
              </View>
            </Block>
          ))
        ) : (
          <CustomText>게시글이 없습니다</CustomText>
        )}
      </ScrollView>
    </Container>
  );
};

export default MyPageScreen;

const ProfileImagePlaceholder = styled.View`
  width: 70px;
  height: 70px;
  border-radius: 35px;
  background: #FBE9DD;
  margin-right: 15px;
  align-items: center;
  justify-content: center;
`;

const ProfileInfo = styled.View`
  width: 170px;
`;

const IconRow = styled.View`
  flex-direction: row;
  justify-content: space-around;
  margin-bottom: 20px;
  margin-top: 10px;
`;

const IconItem = styled.View`
  flex-direction: column;
  align-items: center;
  margin-left: 25px;
  margin-right: 25px;
`;

const FloatingButtonWrapper = styled.View`
  background-color:  ${colors.blue};
  width: 60px;
  height: 60px;
  border-radius: 30px;
  justify-content: center;
  align-items: center;
  margin-bottom: 8px; 
`;

const Divider = styled.View`
  height: .7px;
  background-color: ${colors.gray2};
  width: 100%;
  margin-bottom: 15px; 
  margin-top: 15px; 
`;
