import React, { useState } from 'react';
import { Container } from '../../styles/GlobalStyles';
import styled from 'styled-components/native';
import CustomText from '../../components/ui/CustomText';
import { AuthStackParam } from './AuthStack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../styles/colors';
import PrimaryButton from '../../components/buttons/PrimaryButton';

type Navigation = NativeStackNavigationProp<AuthStackParam>;

const SignUp = () => {
  const navigation = useNavigation<Navigation>();
  const { bottom } = useSafeAreaInsets();
  const [gender, setGender] = useState('');

  return (
    <Container style={{ paddingBottom: bottom }}>
      <InputWrapper>
        <Label>아이디</Label>
        <Input placeholder="아이디를 입력하세요. (6~20자)" />
      </InputWrapper>
      <InputWrapper>
        <Label>비밀번호</Label>
        <Input placeholder="비밀번호를 입력하세요." secureTextEntry />
      </InputWrapper>
      <InputWrapper2>
        <Label>비밀번호 확인</Label>
        <Input placeholder="비밀번호를 다시 입력하세요." secureTextEntry />
      </InputWrapper2>

      <InputWrapper2>
        <Label>성별</Label>
        <Row>
          <GenderButton
            selected={gender === '남자'}
            onPress={() => setGender('남자')}
          >
            <GenderText selected={gender === '남자'}>남자</GenderText>
          </GenderButton>
          <GenderButton
            selected={gender === '여자'}
            onPress={() => setGender('여자')}
          >
            <GenderText selected={gender === '여자'}>여자</GenderText>
          </GenderButton>
        </Row>
      </InputWrapper2>

      <InputWrapper3>
        <Label>생년월일</Label>
        <Row>
          <DateInput placeholder="년도" />
          <DateInput placeholder="월" />
          <DateInput placeholder="일" />
        </Row>
      </InputWrapper3>

      <PrimaryButton
        title="회원가입"
        color={colors.blue}
        onPress={() => navigation.navigate('Main')}
        fontWeight="400"
      />
    </Container>
  );
};

export default SignUp;

const Label = styled(CustomText)`
  font-size: 13px;
  font-weight: 600px;
  margin-bottom: 11px;
  color: ${colors.gray8};
`;

const Input = styled.TextInput`
  border-bottom-width: 1px;
  border-bottom-color: #ccc;
  margin-bottom: 24px;
  margin: 11px 4.87px 10px 0;
  font-size: 10px;
  color: ${colors.gray5};
  font-weight: 400px;
`;

const InputWrapper = styled.View`
  width: 100%;
  margin-bottom: 16px;
`;

const InputWrapper2 = styled.View`
  width: 100%;
  margin-bottom: 36px;
`;

const InputWrapper3 = styled.View`
  width: 100%;
  margin-bottom: 132px;
`;

const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const GenderButton = styled.TouchableOpacity<{ selected: boolean }>`
  flex: 1;
  padding: 13px;
  margin: 0 5px;
  border-width: 1px;
  border-radius: 20px;
  border-color: ${props => colors.blue};
  background-color: ${props => (props.selected ? colors.blue : colors.white)};
  align-items: center;
`;

const GenderText = styled.Text<{ selected: boolean }>`
  color: ${props => (props.selected ? colors.gray8 : colors.gray5)};
`;

const DateInput = styled.TextInput`
  flex: 1;
  margin: 0 4px;
  border-bottom-width: 1px;
  border-bottom-color: #ccc;
  text-align: center;
  padding: 8px 0;
`;
