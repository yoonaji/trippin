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

  return (
    <Container style={{ paddingBottom: bottom }}>
      <InputWrapper2>
        <Label2>가입한 이메일과 아이디를 입력하세요.</Label2>
        <Label3>입력한 이메일로 비밀번호 재설정 링크를 보내드립니다.</Label3>
      </InputWrapper2>
      <InputWrapper>
        <Label>이메일</Label>
        <Input placeholder="이메일을 입력하세요." />
      </InputWrapper>
      <InputWrapper3>
        <Label>아이디</Label>
        <Input placeholder="아이디를 입력하세요." secureTextEntry />
      </InputWrapper3>

      <PrimaryButton
        title="비밀번호 찾기"
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
  font-weight: 600;
  color: ${colors.gray6};
`;

const Label2 = styled(CustomText)`
  font-size: 20px;
  font-weight: 600;
  color: ${colors.gray7};
`;

const Label3 = styled(CustomText)`
  font-size: 13px;
  font-weight: 400;
  color: ${colors.gray5};
`;

const Input = styled.TextInput`
  border-bottom-width: 1px;
  border-bottom-color: ${colors.gray2};
  margin: 11px 4.87px 20px 0;
  font-size: 10px;
  color: ${colors.gray5};
  font-weight: 400;
`;

const InputWrapper = styled.View`
  width: 100%;
  margin-bottom: 16px;
`;

const InputWrapper2 = styled.View`
  width: 100%;
  margin-bottom: 40px;
`;

const InputWrapper3 = styled.View`
  width: 100%;
  margin-bottom: 357px;
`;
