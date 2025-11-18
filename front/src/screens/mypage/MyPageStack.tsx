import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import InfoEditScreen from './InfoEditScreen';
import setting from '../../assets/images/icon/setting.png';
import IconButton from '../../components/buttons/IconButton';
import LikedScreen from './LikedScreen';
import RouteScreen from './RouteScreen';
import PostDetailScreen from '../shared/PostDetailScreen';
import CustomText from '../../components/ui/CustomText';
import { colors } from '../../styles/colors';
import MyPageMain from './MyPageMain';

export type MyPageStackParam = {
  MyPageMain: undefined;
  InfoEditScreen: undefined;
  LikedScreen: undefined;
  RouteScreen: undefined;
  PostDetailScreen: { postId: number };
};

const Stack = createNativeStackNavigator<MyPageStackParam>();

const MyPageStack = () => {
  return (
    <Stack.Navigator initialRouteName="MyPageMain">
      <Stack.Screen
        name="MyPageMain"
        component={MyPageMain}
        options={({ navigation }) => ({
          headerTitle: () => (
            <CustomText
              weight="600"
              style={{ fontSize: 18, color: colors.gray7 }}
            >
              마이페이지
            </CustomText>
          ),
          headerTitleAlign: 'center',
          headerShadowVisible: false,
          headerRight: () => (
            <IconButton
              icon={setting}
              size={25}
              onPress={() => navigation.navigate('InfoEditScreen')}
            />
          ),
        })}
      />
      <Stack.Screen
        name="InfoEditScreen"
        component={InfoEditScreen}
        options={{
          headerTitle: () => (
            <CustomText
              weight="600"
              style={{ fontSize: 18, color: colors.gray7 }}
            >
              마이페이지
            </CustomText>
          ),
          headerTitleAlign: 'center',
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="LikedScreen"
        component={LikedScreen}
        options={{
          headerTitle: () => (
            <CustomText
              weight="600"
              style={{ fontSize: 18, color: colors.gray7 }}
            >
              좋아요한 글
            </CustomText>
          ),
          headerTitleAlign: 'center',
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="RouteScreen"
        component={RouteScreen}
        options={{
          headerTitle: () => (
            <CustomText
              weight="600"
              style={{ fontSize: 18, color: colors.gray7 }}
            >
              나의 여행경로
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

export default MyPageStack;
