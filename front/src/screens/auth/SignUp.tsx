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
import { Dropdown } from 'react-native-element-dropdown';
import { Alert, Platform, StyleSheet } from 'react-native';
import Onboarding from '../onboarding/Onboarding';
import api from '../../../axiosConfig';

type Navigation = NativeStackNavigationProp<AuthStackParam>;

const currentYear = new Date().getFullYear();

const yearsData = Array.from({ length: currentYear - 1980 + 1 }, (_, i) => ({
  label: `${currentYear - i}년`,
  value: currentYear - i,
}));

const monthsData = Array.from({ length: 12 }, (_, i) => ({
  label: `${i + 1}월`,
  value: i + 1,
}));

const getDays = (year: number, month: number) => {
  const daysInMonth = new Date(year, month, 0).getDate();
  return Array.from({ length: daysInMonth }, (_, i) => ({
    label: `${i + 1}일`,
    value: i + 1,
  }));
};

const SignUp = () => {
  const navigation = useNavigation<Navigation>();
  const { bottom } = useSafeAreaInsets();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gender, setGender] = useState('');
  const [year, setYear] = useState<number | null>(null);
  const [month, setMonth] = useState<number | null>(null);
  const [day, setDay] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const formatDate = (y: number, m: number, d: number) =>
    `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

  const toServerGender = (g: string) =>
    g === '여자' ? 'F' : g === '남자' ? 'M' : undefined;

  const handleSignUp = async () => {
    if (loading) return;

    if (!email.trim()) {
      Alert.alert('오류', '이메일을 입력해주세요.');
      return;
    }
    if (!emailRegex.test(email)) {
      Alert.alert('오류', '이메일 형식이 올바르지 않습니다.');
      return;
    }
    if (!username.trim()) {
      Alert.alert('오류', '아이디(닉네임)를 입력해주세요.');
      return;
    }
    if (username.length > 45) {
      Alert.alert('오류', '아이디는 45자 이하로 입력해주세요.');
      return;
    }
    if (/\s/.test(username)) {
      Alert.alert('오류', '아이디에 공백은 사용할 수 없습니다.');
      return;
    }
    if (!password.trim()) {
      Alert.alert('오류', '비밀번호를 입력해주세요.');
      return;
    }
    if (password.length < 8) {
      Alert.alert('오류', '비밀번호는 8자 이상으로 설정해주세요.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('오류', '비밀번호가 일치하지 않습니다.');
      return;
    }

    const birthDate =
      year && month && day ? formatDate(year, month, day) : undefined;

    const payload: Record<string, any> = {
      username,
      email,
      password,
    };

    const g = toServerGender(gender);
    if (g) payload.gender = g;
    if (birthDate) payload.birthDate = birthDate;

    try {
      setLoading(true);

      const res = await api.post('/api/auth/signup', payload);
      const data = await res.data;

      Alert.alert('회원가입 완료', data?.message ?? '가입이 완료되었습니다.', [
        {
          text: '확인',
          onPress: () => {
            navigation.navigate('Onboarding');
          },
        },
      ]);
    } catch (e: any) {
      console.log('Signup Error:', e);
      const message =
        e?.response?.data?.message ??
        e?.message ??
        '네트워크 오류가 발생했습니다.';
      Alert.alert('회원가입 실패', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container style={{ paddingBottom: bottom }}>
      <InputWrapper>
        <Label>아이디</Label>
        <Input
          placeholder="아이디를 입력하세요. (6~20자)"
          value={username}
          onChangeText={setUsername}
        />
      </InputWrapper>
      <InputWrapper>
        <Label>이메일</Label>
        <Input
          placeholder="이메일을 입력하세요."
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
      </InputWrapper>
      <InputWrapper>
        <Label>비밀번호</Label>
        <Input
          placeholder="비밀번호를 입력하세요."
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </InputWrapper>
      <InputWrapper>
        <Label>비밀번호 확인</Label>
        <Input
          placeholder="비밀번호를 다시 입력하세요."
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      </InputWrapper>

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
          <Dropdown
            style={styles.dropdown}
            placeholder="년도"
            data={yearsData}
            labelField="label"
            valueField="value"
            value={year}
            onChange={item => setYear(item.value)}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            itemTextStyle={{ fontSize: 13, color: colors.gray6 }}
          />

          <Dropdown
            style={styles.dropdown}
            placeholder="월"
            data={monthsData}
            labelField="label"
            valueField="value"
            value={month}
            onChange={item => setMonth(item.value)}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            itemTextStyle={{ fontSize: 13, color: colors.gray6 }}
          />

          <Dropdown
            style={styles.dropdown}
            placeholder="일"
            data={year && month ? getDays(year, month) : []}
            labelField="label"
            valueField="value"
            value={day}
            onChange={item => setDay(item.value)}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            itemTextStyle={{ fontSize: 13, color: colors.gray6 }}
          />
        </Row>
      </InputWrapper3>

      <PrimaryButton
        title={loading ? '회원가입 중...' : '회원가입'}
        color={colors.blue}
        onPress={loading ? undefined : handleSignUp}
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
  margin-bottom: 36px;
`;

const InputWrapper3 = styled.View`
  width: 100%;
  margin-bottom: 30px;
`;

const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 15px;
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

const styles = StyleSheet.create({
  dropdown: {
    flex: 1,
    height: 50,
    borderColor: colors.gray2,
    borderWidth: 0,
    borderRadius: 0,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray2,
    paddingHorizontal: 12,
    marginHorizontal: 5,
  },
  placeholderStyle: {
    fontSize: 13,
    fontWeight: '400',
    color: colors.gray6,
  },
  selectedTextStyle: {
    fontSize: 13,
    fontWeight: '400',
    color: colors.gray6,
  },
});
