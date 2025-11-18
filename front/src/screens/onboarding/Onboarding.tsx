import React, { useState } from 'react';
import { Container } from '../../styles/GlobalStyles';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import { RootStackParamList } from '../../navigation/StackNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../styles/colors';
import kakao from '../../assets/images/icon/kakao.png';
import naver from '../../assets/images/icon/naver.png';
import google from '../../assets/images/icon/google.png';
import IconButton from '../../components/buttons/IconButton';
import CustomText from '../../components/ui/CustomText.tsx';
import styled from 'styled-components/native';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../../axiosConfig.ts';

type Navigation = NativeStackNavigationProp<RootStackParamList>;

const Onboarding = () => {
  const navigation = useNavigation<Navigation>();
  const { bottom } = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (loading) return;

    if (!email || !password) {
      Alert.alert('오류', '이메일과 비밀번호를 입력해주세요.');
      return;
    }

    try {
      setLoading(true);

      const res = await api.post('/api/auth/signin', {
        email,
        password,
      });

      const data = res.data;

      await AsyncStorage.setItem('accessToken', data.accessToken);
      await AsyncStorage.setItem('refreshToken', data.refreshToken);
      const userEmailToSave = data.email ?? email;
      await AsyncStorage.setItem('userEmail', userEmailToSave);
      await AsyncStorage.setItem('username', data.username);

      navigation.navigate('Main');
    } catch (e: any) {
      console.log(e);
      const message =
        e?.response?.data?.message ??
        e?.message ??
        '네트워크 오류가 발생했습니다.';
      Alert.alert('로그인 실패', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container style={{ paddingBottom: bottom, paddingTop: 152 }}>
      <SubText weight="400">기록하고싶은 그 순간, trippin에 담아</SubText>
      <LogoText>Trippin</LogoText>

      <InputWrapper>
        <Label>이메일</Label>
        <Input
          placeholder="이메일을 입력하세요."
          value={email}
          onChangeText={setEmail}
          placeholderTextColor={colors.gray3}
        />
      </InputWrapper>

      <InputWrapper2>
        <Label>비밀번호</Label>
        <Input
          placeholder="비밀번호를 입력하세요."
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor={colors.gray3}
        />
      </InputWrapper2>

      <PrimaryButton
        title={loading ? '로그인 중...' : '로그인'}
        color={colors.blue}
        onPress={handleLogin}
        fontWeight="400"
      />

      <SubMenu>
        <MenuText
          onPress={() => navigation.navigate('AuthStack', { screen: 'SignUp' })}
        >
          회원가입
        </MenuText>
        <Divider>|</Divider>
        <MenuText
          onPress={() =>
            navigation.navigate('AuthStack', { screen: 'FindAccount' })
          }
        >
          비밀번호 찾기
        </MenuText>
      </SubMenu>

      <DividerLineWrapper>
        <Line />
        <SmallGrayText>간편 로그인</SmallGrayText>
        <Line />
      </DividerLineWrapper>

      <SnsWrapper>
        <SnsButton bgColor={colors.kakao} size={60}>
          <IconButton
            icon={kakao}
            size={60}
            onPress={() => navigation.navigate('Main')}
          />
        </SnsButton>
        <SnsButton bgColor={colors.naver} size={60}>
          <IconButton
            icon={naver}
            size={55}
            onPress={() => navigation.navigate('Main')}
          />
        </SnsButton>
        <SnsButton bgColor={colors.white} size={60}>
          <IconButton
            icon={google}
            size={50}
            onPress={() => navigation.navigate('Main')}
          />
        </SnsButton>
      </SnsWrapper>
    </Container>
  );
};

export default Onboarding;

const SubText = styled(CustomText)`
  color: ${colors.gray7};
  font-size: 12px;
  margin-bottom: 16px;
`;

const LogoText = styled.Text`
  color: ${colors.gray7};
  font-family: Ghanachocolate;
  font-weight: 400;
  font-size: 50px;
  margin-bottom: 65px;
`;

const InputWrapper = styled.View`
  width: 100%;
  margin-bottom: 16px;
`;

const InputWrapper2 = styled.View`
  width: 100%;
  margin-bottom: 38px;
`;

const Label = styled(CustomText)`
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 12px;
  color: ${colors.gray6};
`;

const Input = styled.TextInput`
  width: 100%;
  border-bottom-width: 1px;
  border-bottom-color: ${colors.gray2};
  font-size: 10px;
  font-weight: 400;
  padding: 10px 0 10px 8px;
`;

const SubMenu = styled.View`
  flex-direction: row;
  margin: 37px 0;
  justify-content: center;
  align-items: center;
`;

const MenuText = styled.Text`
  font-size: 10px;
  color: ${colors.gray6};
`;

const Divider = styled.Text`
  color: ${colors.gray6};
  font-size: 10px;
  text-align-vertical: center;
  margin: 0 18px;
`;

const DividerLineWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  width: 100%;
  margin: 0;
`;

const Line = styled.View`
  flex: 1;
  height: 1px;
  background-color: ${colors.gray2};
`;

const SmallGrayText = styled.Text`
  font-size: 10px;
  color: ${colors.gray9};
  margin: 0 37px;
`;

const SnsWrapper = styled.View`
  flex-direction: row;
  justify-content: center;
  margin-top: 23px;
`;

const SnsButton = styled.TouchableOpacity<{
  bgColor?: string;
  size?: number;
}>`
  width: ${({ size }) => size || 60}px;
  height: ${({ size }) => size || 60}px;
  border-radius: ${({ size }) => (size || 60) / 2}px;
  background-color: ${({ bgColor }) => bgColor || 'transparent'};
  justify-content: center;
  align-items: center;
  margin: 0 30px;
  overflow: hidden;
`;
