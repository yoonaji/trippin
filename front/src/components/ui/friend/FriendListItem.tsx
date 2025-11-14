import styled from 'styled-components/native';
import { colors } from '../../../styles/colors';
import user from '../../../assets/images/icon/author.png';
import CustomText from '../CustomText';

type Props = {
  nickname: string;
  email: string;
  onDelete: (email: string) => void;
};

const FriendListItem = ({ nickname, email, onDelete }: Props) => (
  <ItemContainer>
    <ProfileWrapper>
      <ProfileImage source={user} />
      <UserName>{nickname}</UserName>
    </ProfileWrapper>
    <DeleteButton onPress={() => onDelete(email)}>
      <ButtonText>친구 삭제</ButtonText>
    </DeleteButton>
  </ItemContainer>
);

export default FriendListItem;

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

const UserName = styled.Text`
  font-weight: 500;
  font-size: 14px;
  color: ${colors.gray7};
`;

const DeleteButton = styled.Pressable`
  height: 30px;
  border-radius: 20px;
  justify-content: center;
  align-items: center;
  padding: 0 15px;
  background: ${colors.white};
  border: 1px solid ${colors.blue};
`;

const ButtonText = styled(CustomText)`
  color: ${colors.gray7};
  font-size: 12px;
  font-weight: 300;
`;
