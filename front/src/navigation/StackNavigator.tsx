import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import Onboarding from '../screens/onboarding/Onboarding';
import TabNavigator from './TabNavigator';
import AuthStack, { AuthStackParam } from '../screens/auth/AuthStack';
import CustomText from '../components/ui/CustomText';
import { colors } from '../styles/colors';
import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Onboarding: undefined;
  Main: undefined;
  AuthStack: NavigatorScreenParams<AuthStackParam>;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const StackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Onboarding"
      screenOptions={{
        headerTitleAlign: 'center',
        headerTitle: ({ children }) => (
          <CustomText style={{ fontSize: 17 }} weight="600">
            {children}
          </CustomText>
        ),
        headerStyle: {
          backgroundColor: colors.cream,
        },
      }}
    >
      <Stack.Screen
        name="Onboarding"
        component={Onboarding}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AuthStack"
        component={AuthStack}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Main"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default StackNavigator;
