import styled from 'styled-components/native';
import { colors } from '../../../styles/colors';

type Props = {
  nickname: string;
  email: string;
  onDelete: (email: string) => void;
};

const FriendListItem = ({ nickname, email, onDelete }: Props) => (
  <ItemContainer>
    <ProfileImage />
    <UserName>{nickname}</UserName>

    <DeleteButton onPress={() => onDelete(email)}>
      <ButtonText>친구삭제</ButtonText>
    </DeleteButton>
  </ItemContainer>
);

export default FriendListItem;

const ItemContainer = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 12px 0;
  border-bottom-width: 0.5px;
  border-color: ${colors.gray2};
`;

const ProfileImage = styled.View`
  width: 44px;
  height: 44px;
  border-radius: 22px;
  background-color: gray;
  margin-right: 12px;
  margin-left: 22px;
`;

const UserName = styled.Text`
  flex: 1;
  font-size: 16px;
  font-weight: bold;
  color: ${colors.gray8};
`;

const DeleteButton = styled.TouchableOpacity`
  padding: 6px 12px;
  border-radius: 40px;
  background-color: ${colors.blue};
  margin-right: 20px;
`;

const ButtonText = styled.Text`
  color: ${colors.white};
  font-size: 13px;
`;
