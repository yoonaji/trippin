import React from 'react';
import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import HomeStack from '../screens/home/HomeStack';
import MyPageStack from '../screens/mypage/MyPageStack';
import FriendStack from '../screens/friend/FriendStack';
import tab_friend from '../assets/images/tabbar/tab_friend.png';
import tab_home from '../assets/images/tabbar/tab_home.png';
import tab_mypage from '../assets/images/tabbar/tab_my.png';
import { colors } from '../styles/colors';
import { Image } from 'react-native';
import CustomText from '../components/ui/CustomText';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const renderLabel =
    (label: string) =>
    ({ color }: { color: string }) =>
      <CustomText style={{ color, fontSize: 13 }}>{label}</CustomText>;
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }): BottomTabNavigationOptions => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.white,
          height: 110,
          paddingTop: 10,
          borderTopWidth: 1,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          overflow: 'hidden',
        },
        tabBarActiveTintColor: colors.blue,
        tabBarInactiveTintColor: colors.gray3,
        tabBarIcon: ({ focused }) => {
          let icon;

          if (route.name === 'Home') {
            icon = tab_home;
          } else if (route.name === 'FriendStack') {
            icon = tab_friend;
          } else if (route.name === 'MyPageStack') {
            icon = tab_mypage;
          }

          return (
            <Image
              source={icon}
              style={{
                width: 33,
                height: 33,
                tintColor: focused ? colors.blue : colors.gray3,
              }}
              resizeMode="contain"
            />
          );
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarLabel: renderLabel('홈'),
        }}
      />
      <Tab.Screen
        name="FriendStack"
        component={FriendStack}
        options={{
          tabBarLabel: renderLabel('Friend'),
        }}
      />
      

      <Tab.Screen
        name="MyPageStack"
        component={MyPageStack}
        options={{
          tabBarLabel: renderLabel('My'),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
