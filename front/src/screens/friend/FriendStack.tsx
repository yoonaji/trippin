import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import FriendHomeScreen from './FriendHomeScreen';
import AddFriendScreen from './AddFriendScreen';
import FriendListScreen from './FriendListScreen';
import PostDetailScreen from '../shared/PostDetailScreen';
import CustomText from '../../components/ui/CustomText';
import { colors } from '../../styles/colors';

export type FriendStackParam = {
  FriendHomeScreen: undefined;
  AddFriendScreen: undefined;
  FriendListScreen: undefined;
  PostDetailScreen: { postId: number };
};

const Stack = createNativeStackNavigator<FriendStackParam>();

const FriendStack = () => {
  return (
    <Stack.Navigator initialRouteName="FriendHomeScreen">
      <Stack.Screen
        name="FriendHomeScreen"
        component={FriendHomeScreen}
        options={{
          headerTitle: () => (
            <CustomText
              weight="600"
              style={{ fontSize: 18, color: colors.gray7 }}
            >
              TRIPPIN
            </CustomText>
          ),
          headerTitleAlign: 'center',
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="AddFriendScreen"
        component={AddFriendScreen}
        options={{
          headerTitle: () => (
            <CustomText
              weight="600"
              style={{ fontSize: 18, color: colors.gray7 }}
            >
              친구 추가
            </CustomText>
          ),
          headerTitleAlign: 'center',
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="FriendListScreen"
        component={FriendListScreen}
        options={{
          headerTitle: () => (
            <CustomText
              weight="600"
              style={{ fontSize: 18, color: colors.gray7 }}
            >
              친구 목록
            </CustomText>
          ),
          headerTitleAlign: 'center',
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="PostDetailScreen"
        component={PostDetailScreen}
        options={{
          headerTitle: () => (
            <CustomText
              weight="600"
              style={{ fontSize: 18, color: colors.gray7 }}
            >
              게시글
            </CustomText>
          ),
          headerTitleAlign: 'center',
          headerShadowVisible: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default FriendStack;
