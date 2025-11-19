import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import FriendHomeScreen from './FriendHomeScreen';
import AddFriendScreen from './AddFriendScreen';
import FriendListScreen from './FriendListScreen'; // 추가

export type FriendStackParam = {
  FriendHomeScreen: undefined;
  AddFriendScreen: undefined;
  FriendListScreen: undefined;  // 추가

};

const Stack = createNativeStackNavigator<FriendStackParam>();

const MyPageStack = () => {
  return (
    <Stack.Navigator initialRouteName="FriendHomeScreen">
      <Stack.Screen
        name="FriendHomeScreen"
        component={FriendHomeScreen}
        options={{ 
          title: 'TRIPPIN',
          headerTitleAlign: 'center' 
        }}
      />
      <Stack.Screen
        name="AddFriendScreen"
        component={AddFriendScreen}
        options={{ 
          title: 'Add Friend',
          headerTitleAlign: 'center'
        }}
      />
      <Stack.Screen
        name="FriendListScreen"
        component={FriendListScreen}
        options={{ 
          title: 'Friend List' ,
          headerTitleAlign: 'center' 
        }}

      />

    </Stack.Navigator>
  );
};

export default MyPageStack;
