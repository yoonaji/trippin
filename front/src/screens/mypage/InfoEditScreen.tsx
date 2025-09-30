import React, { useState } from "react";
import { ScrollView, Switch, TouchableOpacity, Modal, View, TextInput, Button, } from "react-native";
import styled from "styled-components/native";
import { colors } from "../../styles/colors";
import CustomText from "../../components/ui/CustomText";
import { Container } from "../../styles/GlobalStyles";
import { Block ,IconImage} from '../../styles/write.ts';
import IconButton from '../../components/buttons/IconButton';
import profile from '../../assets/images/icon/profile.png';
import ring from '../../assets/images/icon/ring.png';
import company from '../../assets/images/icon/company.png';
import axios from "axios";
import { Alert } from "react-native";
// import { launchImageLibrary } from "react-native-image-picker";

// API URL
const API_URL = "http://10.0.2.2:8080/api/users/me/username";
const LOGOUT_URL = "http://10.0.2.2:8080/api/auth/logout";


// 로그아웃
const logout = async (token: string) => {
  try {
    const response = await fetch(LOGOUT_URL, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Error ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error("로그아웃 실패:", error.message);
    Alert.alert("오류", "로그아웃 실패");
    throw error;
  }
};

// 닉네임 변경
const updateNickname = async (username: string, token: string) => {
  try {
    const response = await fetch(API_URL, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Error ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error("닉네임 변경 실패:", error.message);
    throw error;
  }
};



// 일반 버튼 
const SectionItem = ({
  label,
  onPress,
}: {
  label: string;
  onPress?: () => void;
}) => (
  <ItemButton onPress={onPress}>
    <CustomText style={{ fontSize: 15 }}>{label}</CustomText>
  </ItemButton>
);

// 스위치 
const SwitchItem = ({
  label,
  value,
  onValueChange,
}: {
  label: string;
  value: boolean;
  onValueChange: (val: boolean) => void;
}) => (
  <ItemRow>
    <CustomText style={{ fontSize: 15 }}>{label}</CustomText>
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: "#ccc", true: colors.blue }}
      thumbColor={value ? colors.white : "#f4f3f4"}
    />
  </ItemRow>
);

const MyPageScreen = () => {
  const [adsEnabled, setAdsEnabled] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [newNickname, setNewNickname] = useState("");

  // 토큰
  const accessToken =
    "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ5b29ubl9fYUBnbWFpbC5jb20iLCJjYXRlZ29yeSI6ImFjY2VzcyIsImlhdCI6MTc1NzQxNzc3NiwiZXhwIjoxNzU3NDE4Njc2fQ.XvNlwU5Ulc1sUjy5xEn-zDnN9qwHMDG0OPU6DGdnWxQ";

  const handleSubmitNickname = async () => {
    if (!newNickname.trim()) {
      Alert.alert("알림", "닉네임을 입력해주세요.");
      return;
    }

    try {
      const res = await updateNickname(newNickname, accessToken);
      Alert.alert("성공", res.message);
      setModalVisible(false);
      setNewNickname("");
    } catch (err) {
      Alert.alert("오류", "닉네임 변경 실패");
    }
  };

  const handleLogout = async () => {
    try {
      const res = await logout(accessToken);
      Alert.alert("성공", res.message);
    } catch (err) {
      Alert.alert("오류", "로그아웃 실패");
    }
  };


  return (
    <Container >

      <ScrollView showsVerticalScrollIndicator={false}>

        <HeaderRow>

          <CustomText style={{ fontSize: 16, fontWeight: "700" ,color:colors.blue}}>

        <FloatingButtonContainer>
          <FloatingButtonWrapper>
            <IconButton icon={profile} size={25}  />
          </FloatingButtonWrapper>
        </FloatingButtonContainer>

            프로필 설정
          </CustomText>
        </HeaderRow>
        <Block>
          <SectionItem label="닉네임 변경하기                                           " onPress={() => setModalVisible(true)} />

          <SectionItem label="프로필 사진 변경하기" onPress={() => {}} />
          <SectionItem label="비밀번호 변경하기" onPress={() => {}} />
          <SectionItem label="로그아웃" onPress={() => handleLogout()} />
        </Block>
{/* 닉네임 입력 모달 */}
<Modal visible={modalVisible} transparent animationType="slide">
  <View
    style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.5)",
    }}
  >
    <View
      style={{
        backgroundColor: "white",
        padding: 20,
        borderRadius: 20,
        width: "80%",
      }}
    >
      <CustomText style={{ fontSize: 18, marginBottom: 15 }}>
        닉네임 변경
      </CustomText>

      <TextInput
        value={newNickname}
        onChangeText={setNewNickname}
        placeholder="새 닉네임 입력"
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 12,
          marginBottom: 20,
          borderRadius: 8,
        }}
      />

      <ButtonRow>
        <ModalButton bg={colors.blue} onPress={handleSubmitNickname}>
          <ButtonText>확인</ButtonText>
        </ModalButton>
        <ModalButton bg={colors.gray2} onPress={() => setModalVisible(false)}>
          <ButtonText>취소</ButtonText>
        </ModalButton>
      </ButtonRow>
    </View>
  </View>
</Modal>






        <HeaderRow>
          <CustomText style={{ fontSize: 16, fontWeight: "700" ,color:colors.blue}}>

        <FloatingButtonContainer>
          <FloatingButtonWrapper>
            <IconButton icon={ring} size={25}  />
          </FloatingButtonWrapper>
        </FloatingButtonContainer>

            알림 설정
          </CustomText>
        </HeaderRow>
        <Block>
          <SectionItem label="알림 설정하기" onPress={() => {}} />
          <SwitchItem
            label="광고성 정보 수신 알림"
            value={adsEnabled}
            onValueChange={setAdsEnabled}
          />
        </Block>

        <HeaderRow>
          <CustomText style={{ fontSize: 16, fontWeight: "700" ,color:colors.blue}}>

        <FloatingButtonContainer>
          <FloatingButtonWrapper>
            <IconButton icon={company} size={25}  />
          </FloatingButtonWrapper>
        </FloatingButtonContainer>


            제휴 문의
          </CustomText>
        </HeaderRow>
        <Block>
          <SectionItem label="가맹점 / 제휴 문의" onPress={() => {}} />
        </Block>

      </ScrollView>
    </Container>
  );
};

// 스타일
const HeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 15px;
  margin-top: 15px;
`;

const IconCircle = styled.View`
  width: 40px;
  height: 40px;
  border-radius: 100px;
  background-color: ${colors.blue};
  align-items: center;
  justify-content: center;
  margin-right: 10px;
`;

const ItemButton = styled(TouchableOpacity)`
  background-color: ${colors.sky};
  padding: 10px 20px;    
  border-radius: 12px;
`;

const ItemRow = styled.View`
  background-color: ${colors.sky};
  padding: 10px 20px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2px;
`;

  // 버튼 컨테이너
const FloatingButtonContainer = styled.View`
  position: absolute;
  bottom: 8px;
  right: 30px;
  flex-direction: column;
  align-items: center;
`;

const FloatingButtonWrapper = styled.View`
  background-color:  ${colors.blue};
  width: 35px;
  height: 35px;
  border-radius: 35px;
  justify-content: center;
  align-items: center;
  margin-bottom: -10px; 
  margin-right: 10px; 

`;

const ButtonRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const ModalButton = styled.TouchableOpacity<{ bg: string }>`
  flex: 1;
  background-color: ${(props) => props.bg};
  padding: 12px;
  margin: 0 5px;
  border-radius: 12px;
  align-items: center;
`;

const ButtonText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: 600;
`;

export { HeaderRow, IconCircle };
export default MyPageScreen;
