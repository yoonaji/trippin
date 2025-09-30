import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import SignUp from './SignUp';
import { colors } from '../../styles/colors';
import CustomText from '../../components/ui/CustomText.tsx';
import TabNavigator from '../../navigation/TabNavigator';

export type AuthStackParam = {
  SignUp: undefined;
  Main: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParam>();

const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitle: ({ children }) => (
          <CustomText style={{ fontSize: 18 }} weight="600">
            {children}
          </CustomText>
        ),
        headerStyle: {
          backgroundColor: colors.white,
        },
        headerTintColor: colors.gray7,
        headerTitleStyle: {
          fontSize: 17,
          color: colors.gray7,
        },
        headerTitleAlign: 'center',
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="SignUp"
        component={SignUp}
        options={{ title: '회원가입' }}
      />
      <Stack.Screen
        name="Main"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;
