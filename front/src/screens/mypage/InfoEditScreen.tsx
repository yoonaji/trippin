import React, { useState } from 'react';
import styled from 'styled-components/native';
import { Container } from '../../styles/GlobalStyles';
import CustomText from '../../components/ui/CustomText';
import IconButton from '../../components/buttons/IconButton';
import profile from '../../assets/images/icon/profile.png';
import ring from '../../assets/images/icon/ring.png';
import company from '../../assets/images/icon/company.png';
import { colors } from '../../styles/colors';
import api from '../../../axiosConfig';
import { showError, showSuccess } from '../../utils/toast';

const MyPageScreen = () => {
  const [adsEnabled, setAdsEnabled] = useState(true);
  const [nicknameModal, setNicknameModal] = useState(false);
  const [profileModal, setProfileModal] = useState(false);

  const [newNickname, setNewNickname] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');

  const handleNicknameUpdate = async () => {
    if (!newNickname.trim()) {
      return showError('닉네임 입력 필요', '닉네임을 입력해주세요.');
    }

    try {
      const res = await api.patch('/api/users/me/username', {
        username: newNickname,
      });

      showSuccess('닉네임 변경 완료', res.data?.message);
      setNicknameModal(false);
      setNewNickname('');
    } catch (e: any) {
      showError('닉네임 변경 실패', e.response?.data?.message);
    }
  };

  const handleProfileImageUpdate = async () => {
    if (!newImageUrl.trim()) {
      return showError('이미지 URL 필요', '이미지 URL을 입력해주세요.');
    }

    try {
      const res = await api.patch('/api/users/me/profile-image', {
        profileImage: newImageUrl,
      });

      showSuccess('프로필 변경 완료', res.data?.message);
      setProfileModal(false);
      setNewImageUrl('');
    } catch (e: any) {
      showError('프로필 사진 변경 실패', e.response?.data?.message);
    }
  };

  const handleLogout = async () => {
    try {
      const res = await api.delete('/api/auth/logout');
      showSuccess('로그아웃 완료', res.data?.message);
    } catch (e: any) {
      showError('로그아웃 실패', e.response?.data?.message);
    }
  };

  return (
    <Container>
      <Scroll>
        <HeaderRow>
          <SectionTitle>
            <FloatingContainer>
              <FloatingButton>
                <IconButton icon={profile} size={25} />
              </FloatingButton>
            </FloatingContainer>
            프로필 설정
          </SectionTitle>
        </HeaderRow>

        <BlockCard>
          <ItemButton onPress={() => setNicknameModal(true)}>
            <CustomText style={{ fontSize: 15 }}>닉네임 변경하기</CustomText>
          </ItemButton>

          <ItemButton onPress={() => setProfileModal(true)}>
            <CustomText style={{ fontSize: 15 }}>
              프로필 사진 변경하기
            </CustomText>
          </ItemButton>

          <ItemButton>
            <CustomText style={{ fontSize: 15 }}>비밀번호 변경하기</CustomText>
          </ItemButton>

          <ItemButton onPress={handleLogout}>
            <CustomText style={{ fontSize: 15 }}>로그아웃</CustomText>
          </ItemButton>
        </BlockCard>

        <ModalBox visible={nicknameModal} transparent animationType="fade">
          <ModalOuter>
            <ModalInner>
              <ModalTitle>닉네임 변경</ModalTitle>

              <StyledInput
                placeholder="새 닉네임 입력"
                value={newNickname}
                onChangeText={setNewNickname}
              />

              <ButtonRow>
                <ModalButton bg={colors.blue} onPress={handleNicknameUpdate}>
                  <ButtonText>확인</ButtonText>
                </ModalButton>
                <ModalButton
                  bg={colors.gray3}
                  onPress={() => setNicknameModal(false)}
                >
                  <ButtonText>취소</ButtonText>
                </ModalButton>
              </ButtonRow>
            </ModalInner>
          </ModalOuter>
        </ModalBox>

        <ModalBox visible={profileModal} transparent animationType="fade">
          <ModalOuter>
            <ModalInner>
              <ModalTitle>프로필 사진 변경</ModalTitle>

              <StyledInput
                placeholder="이미지 URL 입력"
                value={newImageUrl}
                onChangeText={setNewImageUrl}
                keyboardType="url"
                autoCapitalize="none"
              />

              <ButtonRow>
                <ModalButton
                  bg={colors.blue}
                  onPress={handleProfileImageUpdate}
                >
                  <ButtonText>확인</ButtonText>
                </ModalButton>
                <ModalButton
                  bg={colors.gray3}
                  onPress={() => setProfileModal(false)}
                >
                  <ButtonText>취소</ButtonText>
                </ModalButton>
              </ButtonRow>
            </ModalInner>
          </ModalOuter>
        </ModalBox>

        <HeaderRow>
          <SectionTitle>
            <FloatingContainer>
              <FloatingButton>
                <IconButton icon={ring} size={25} />
              </FloatingButton>
            </FloatingContainer>
            알림 설정
          </SectionTitle>
        </HeaderRow>

        <BlockCard>
          <ItemButton>
            <CustomText style={{ fontSize: 15 }}>알림 설정하기</CustomText>
          </ItemButton>

          <SwitchRow>
            <CustomText style={{ fontSize: 15 }}>
              광고성 정보 수신 동의
            </CustomText>
            <StyledSwitch value={adsEnabled} onValueChange={setAdsEnabled} />
          </SwitchRow>
        </BlockCard>

        <HeaderRow>
          <SectionTitle>
            <FloatingContainer>
              <FloatingButton>
                <IconButton icon={company} size={25} />
              </FloatingButton>
            </FloatingContainer>
            제휴 문의
          </SectionTitle>
        </HeaderRow>

        <BlockCard>
          <ItemButton>
            <CustomText style={{ fontSize: 15 }}>가맹점 / 제휴 문의</CustomText>
          </ItemButton>
        </BlockCard>
      </Scroll>
    </Container>
  );
};

export default MyPageScreen;

const Scroll = styled.ScrollView``;

const HeaderRow = styled.View`
  margin: 20px 0 12px;
`;

const SectionTitle = styled(CustomText)`
  font-size: 16px;
  font-weight: 700;
  color: ${colors.blue};
`;

const FloatingContainer = styled.View`
  position: absolute;
  right: 28px;
  bottom: 8px;
`;

const FloatingButton = styled.View`
  background-color: ${colors.blue};
  width: 35px;
  height: 35px;
  border-radius: 20px;
  justify-content: center;
  align-items: center;
`;

const BlockCard = styled.View`
  background-color: ${colors.white};
  padding: 4px 0;
  border-radius: 14px;
  margin-bottom: 25px;
`;

const ItemButton = styled.TouchableOpacity`
  padding: 14px 20px;
  background-color: ${colors.sky};
  border-radius: 10px;
  margin: 6px 0;
`;

const SwitchRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: ${colors.sky};
  padding: 14px 20px;
  margin: 6px 0;
  border-radius: 10px;
`;

const StyledSwitch = styled.Switch.attrs({
  trackColor: { false: '#ccc', true: colors.blue },
})``;

const ModalBox = styled.Modal``;

const ModalOuter = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.45);
`;

const ModalInner = styled.View`
  width: 80%;
  padding: 22px;
  background-color: white;
  border-radius: 16px;
`;

const ModalTitle = styled(CustomText)`
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 16px;
`;

const StyledInput = styled.TextInput.attrs({
  placeholderTextColor: colors.gray5,
})`
  border: 1px solid ${colors.gray4};
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 18px;
`;

const ButtonRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const ModalButton = styled.TouchableOpacity<{ bg: string }>`
  flex: 1;
  padding: 12px 0;
  margin: 0 4px;
  background-color: ${({ bg }) => bg};
  border-radius: 10px;
  align-items: center;
`;

const ButtonText = styled(CustomText)`
  font-size: 15px;
  font-weight: 700;
  color: white;
`;
