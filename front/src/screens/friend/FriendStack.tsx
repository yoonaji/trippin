import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import FriendHomeScreen from './FriendHomeScreen';
import AddFriendScreen from './AddFriendScreen';
import FriendListScreen from './FriendListScreen';
import EachPostScreen from './EachPostScreen'; // 경로 맞게 수정 필요!

export type PostType = {
  userName: string;
  location: string;
  date: string;
  text: string;
  image: any;
};

export type FriendStackParam = {
  FriendHomeScreen: undefined;
  AddFriendScreen: undefined;
  FriendListScreen: undefined;
  EachPostScreen: { postId: number };  // 추가!
};

const Stack = createNativeStackNavigator<FriendStackParam>();

const FriendStack = () => {
  return (
    <Stack.Navigator initialRouteName="FriendHomeScreen">
      <Stack.Screen
        name="FriendHomeScreen"
        component={FriendHomeScreen}
        options={{
          title: 'TRIPPIN',
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="AddFriendScreen"
        component={AddFriendScreen}
        options={{
          title: 'Add Friend',
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="FriendListScreen"
        component={FriendListScreen}
        options={{
          title: '친구 목록',
          headerTitleAlign: 'center',
        }}
      />

      {/* 새로 추가된 화면 */}
      <Stack.Screen
        name="EachPostScreen"
        component={EachPostScreen}
        options={{
          title: '게시글',
          headerTitleAlign: 'center',
        }}
      />
    </Stack.Navigator>
  );
};

export default FriendStack;
