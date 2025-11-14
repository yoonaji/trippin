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

export type PostType = {
  userName: string;
  location: string;
  date: string;
  text: string;
  image: any;
};

export type MyPageStackParam = {
  MyPageMain: undefined;
  InfoEditScreen: undefined;
  LikedScreen: undefined;
  RouteScreen: undefined;
  PostDetailScreen: { post: any; comments?: any[] };
};

const Stack = createNativeStackNavigator<MyPageStackParam>();

const MyPageStack = () => {
  return (
    <Stack.Navigator initialRouteName="MyPageMain">
      <Stack.Screen
        name="MyPageMain"
        component={MyPageMain}
        options={({ navigation }) => ({
          title: 'My Page',
          headerTitleAlign: 'center',
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
              My Page
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
              My Page
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
              My Page
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
