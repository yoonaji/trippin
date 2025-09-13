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
  const [userInfo, setUserInfo] = useState<{ name: string; email: string }>({ name: "", email: "" });


  useEffect(() => {
    const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ5b29ubl9fYUBnbWFpbC5jb20iLCJjYXRlZ29yeSI6ImFjY2VzcyIsImlhdCI6MTc1NzQyMDI2NCwiZXhwIjoxNzU3NDIxMTY0fQ.22KB3ga-zU03Hk1S3vv1ICnC5CDK9xymh015YNGHdaY"; // 실제 토큰

    // 사용자 정보 fetch
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
        console.log("fetchUserInfo result:", json); 

        if (json.success) {
          setUserInfo({
            name: json.data.username,
            email: json.data.email,
          });
        }
      } catch (error) {
        console.log("유저 정보 fetch 실패", error);
      }
    };

    // 게시글 fetch
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
              {userInfo.name || "익dlrld명"}
            </CustomText>
          </View>

          <CustomText style={{ fontSize: 14 }}>{userInfo.email || "이메일 없음"}</CustomText>
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

      {/* 피드 */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {posts.map((post, idx) => (
          <Block key={idx}>
            <Header>
              <UserInfo>
                <ProfileImage />
                <UserName>{post.userName || "익명"}</UserName>
              </UserInfo>
            </Header>

            <View style={{ marginTop: 6 }}>
              <CustomText weight="900" style={{ fontSize: 20, fontWeight: 'bold' }}>
                {post.title}
              </CustomText>
              <Divider />
              <CustomText style={{ fontSize: 13 }}>
                {post.createdAt?.split("T")[0]}
              </CustomText>
            </View>
          </Block>
        ))}
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
