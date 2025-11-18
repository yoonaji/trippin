import React from 'react';
import styled from 'styled-components/native';
import CustomText from '../CustomText';
import { colors } from '../../../styles/colors';
import { Modal, TouchableOpacity, View } from 'react-native';
import close from '../../../assets/images/icon/x_icon.png';

type Props = {
  visible: boolean;
  onClose: () => void;
  user: {
    id: number;
    username: string;
    email: string;
    profileImage: string | null;
  } | null;
  onSendRequest: () => void;
};

const FriendSearchModal = ({
  visible,
  onClose,
  user,
  onSendRequest,
}: Props) => {
  if (!user) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Dim onPress={onClose} />

      <ModalBox>
        <View style={{ width: '100%', alignItems: 'flex-end' }}>
          <CloseButton onPress={onClose}>
            <CloseIcon source={close} />
          </CloseButton>
        </View>

        <ProfileWrapper>
          <ProfileImage
            source={
              user.profileImage
                ? { uri: user.profileImage }
                : require('../../../assets/images/icon/author.png')
            }
          />
          <NicknameText>{user.username}</NicknameText>
          <EmailText>{user.email}</EmailText>
        </ProfileWrapper>

        <RequestButton onPress={onSendRequest}>
          <ButtonText>친구 요청</ButtonText>
        </RequestButton>
      </ModalBox>
    </Modal>
  );
};

export default FriendSearchModal;

const Dim = styled.TouchableOpacity`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  justify-content: center;
`;

const ModalBox = styled.View`
  width: 80%;
  position: absolute;
  top: 30%;
  align-self: center;
  padding: 18px 20px;
  border-radius: 16px;
  background-color: white;
  align-items: center;
`;

const CloseButton = styled.Pressable`
  width: 25px;
  height: 25px;
`;

const CloseIcon = styled.Image`
  width: 25px;
  height: 25px;
  tint-color: ${colors.gray8};
`;

const ProfileWrapper = styled.View`
  width: 100%;
  margin-top: 20px;
  align-items: center;
  border-radius: 10px;
  padding-vertical: 8px;
  border: 0.5px solid ${colors.gray2};
`;

const ProfileImage = styled.Image.attrs({
  resizeMode: 'contain',
})`
  width: 64px;
  height: 64px;
  border-radius: 64px;
`;

const NicknameText = styled(CustomText)`
  margin-top: 4px;
  color: ${colors.gray7};
  font-size: 14px;
  font-weight: 500;
`;

const EmailText = styled(CustomText)`
  color: ${colors.gray6};
  font-size: 10px;
  font-weight: 200;
`;

const RequestButton = styled(TouchableOpacity)`
  width: 100px;
  height: 30px;
  margin-top: 11px;
  background-color: ${colors.blue};
  border-radius: 20px;
  align-items: center;
  justify-content: center;
`;

const ButtonText = styled(CustomText)`
  color: ${colors.gray6};
  font-size: 12px;
  font-weight: 500;
  padding: 0;
`;
