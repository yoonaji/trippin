import styled from 'styled-components/native';
import { colors } from '../../../styles/colors';

type Props = {
  nickname: string;
  onAccept: () => void;
  onReject: () => void;
};

const FriendRequestItem = ({ nickname, onAccept, onReject }: Props) => (
  <ItemContainer>
    <ProfileImage />
    <UserName>{nickname}</UserName>
    <AcceptButton onPress={onAccept}>
      <ButtonLabel>수락</ButtonLabel>
    </AcceptButton>
    <RejectButton onPress={onReject}>
      <ButtonLabel reject>거절</ButtonLabel>
    </RejectButton>
  </ItemContainer>
);

export default FriendRequestItem;

const ProfileImage = styled.View`
  width: 44px;
  height: 44px;
  border-radius: 22px;
  background-color: gray;
  margin-right: 12px;
  margin-left: 22px;
`;

const ButtonBase = styled.TouchableOpacity`
  min-width: 60px;
  height: 32px;
  border-radius: 16px;
  justify-content: center;
  align-items: center;
  margin-left: 6px;
  padding: 0 12px;
`;

const ItemContainer = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 12px 0;
  border-bottom-width: 0.5px;
  border-color: ${colors.gray2};
`;

const UserName = styled.Text`
  flex: 1;
  font-weight: bold;
  font-size: 16px;
  color: ${colors.gray8};
`;

const AcceptButton = styled(ButtonBase)`
  background: ${colors.blue};
`;

const RejectButton = styled(ButtonBase)`
  background: ${colors.white};
  border-color: ${colors.blue};
  border-width: 1px;
  margin-right: 22px;
`;

const ButtonLabel = styled.Text<{ reject?: boolean }>`
  color: ${props => (props.reject ? colors.gray8 : colors.gray8)};
  font-size: 12px;
`;
