import styled from 'styled-components/native';
import { colors } from '../../../styles/colors';
import user from '../../../assets/images/icon/author.png';
import CustomText from '../CustomText';

type Props = {
  nickname: string;
  onAccept: () => void;
  onReject: () => void;
};

const FriendRequestItem = ({ nickname, onAccept, onReject }: Props) => (
  <ItemContainer>
    <ProfileWrapper>
      <ProfileImage source={user} />
      <UserName>{nickname}</UserName>
    </ProfileWrapper>
    <ButtonWrapper>
      <AcceptButton onPress={onAccept}>
        <ButtonLabel>수락</ButtonLabel>
      </AcceptButton>
      <RejectButton onPress={onReject}>
        <ButtonLabel>거절</ButtonLabel>
      </RejectButton>
    </ButtonWrapper>
  </ItemContainer>
);

export default FriendRequestItem;

const ItemContainer = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  border-bottom-width: 0.5px;
  border-color: ${colors.gray2};
`;

const ProfileWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

const ProfileImage = styled.Image`
  width: 40px;
  height: 40px;
  border-radius: 40px;
`;

const ButtonBase = styled.TouchableOpacity`
  weight: 55px;
  height: 30px;
  border-radius: 20px;
  justify-content: center;
  align-items: center;
  padding: 0 18px;
`;

const ButtonWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 5px;
`;

const UserName = styled(CustomText)`
  font-weight: 500;
  font-size: 14px;
  color: ${colors.gray7};
`;

const AcceptButton = styled(ButtonBase)`
  background: ${colors.blue};
`;

const RejectButton = styled(ButtonBase)`
  background: ${colors.white};
  border: 1px solid ${colors.blue};
`;

const ButtonLabel = styled(CustomText)`
  font-size: 12px;
  font-weight: 300;
  color: ${colors.gray7};
`;
