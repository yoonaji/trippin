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
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const renderLabel =
    (label: string) =>
    ({ color }: { color: string }) =>
      <CustomText style={{ color, fontSize: 13 }}>{label}</CustomText>;
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }): BottomTabNavigationOptions => {
        const routeName = getFocusedRouteNameFromRoute(route) ?? '';

        const hideTabBarRoutes = [
          'PostCreateScreen',
          'PostConfirmScreen',
          'PostDetailScreen',
        ];
        const shouldHideTabBar = hideTabBarRoutes.includes(routeName);

        return {
          headerShown: false,
          tabBarStyle: {
            backgroundColor: colors.blue,
            height: shouldHideTabBar ? 0 : 115,
            paddingTop: 10,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            overflow: 'hidden',
            display: shouldHideTabBar ? 'none' : 'flex',
          },
          tabBarActiveTintColor: colors.gray6,
          tabBarInactiveTintColor: colors.white,
          tabBarIcon: ({ focused }) => {
            let icon;
            let size = { width: 20, height: 20 };

            if (route.name === 'Home') {
              icon = tab_home;
              size = { width: 21, height: 20 };
            } else if (route.name === 'FriendStack') {
              icon = tab_friend;
              size = { width: 26, height: 26 };
            } else if (route.name === 'MyPageStack') {
              icon = tab_mypage;
              size = { width: 17.333, height: 17.333 };
            }

            return (
              <Image
                source={icon}
                style={{
                  ...size,
                  tintColor: focused ? colors.gray6 : colors.white,
                }}
                resizeMode="contain"
              />
            );
          },
        };
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarLabel: renderLabel('Home'),
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
