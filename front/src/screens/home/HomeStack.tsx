import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import React from 'react';
import MainMapScreen from './MainMapScreen';
import { Image, TouchableOpacity, View } from 'react-native';
import headerLogo from '../../assets/images/logo/header_logo.png';
import { colors } from '../../styles/colors';
import searchIcon from '../../assets/images/icon/search.png';
import postIcon from '../../assets/images/icon/posting.png';
import PostCreateScreen from './PostCreateScreen';
import { useNavigation } from '@react-navigation/native';
import CustomText from '../../components/ui/CustomText';
import PostConfirmScreen from './PostConfirmScreen';

export type HomeStackParam = {
  MainMapScreen: undefined;
  PostCreateScreen: undefined;
  PostConfirmScreen: { postData: any };
};

const Stack = createNativeStackNavigator<HomeStackParam>();

const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainMapScreen"
        component={MainMapScreen}
        options={({ navigation }) => ({
          title: '지도',
          headerTitleAlign: 'center',
          headerShadowVisible: false,
          headerTitle: () => (
            <Image
              source={headerLogo}
              style={{
                width: 59,
                height: 21,
                resizeMode: 'contain',
              }}
            />
          ),
          headerStyle: {
            backgroundColor: colors.white,
          },
          headerRight: () => (
            <View style={{ flexDirection: 'row', gap: 14 }}>
              <TouchableOpacity style={{ width: 28, height: 28 }}>
                <Image source={searchIcon} style={{ width: 28, height: 28 }} />
              </TouchableOpacity>
              <TouchableOpacity
                style={{ width: 28, height: 28 }}
                onPress={() => navigation.navigate('PostCreateScreen')}
              >
                <Image source={postIcon} style={{ width: 24, height: 24 }} />
              </TouchableOpacity>
            </View>
          ),
        })}
      />
      <Stack.Screen
        name="PostCreateScreen"
        component={PostCreateScreen}
        options={{
          headerTitle: () => (
            <CustomText
              weight="600"
              style={{ fontSize: 18, color: colors.gray7 }}
            >
              게시글 작성
            </CustomText>
          ),
          headerTitleAlign: 'center',
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="PostConfirmScreen"
        component={PostConfirmScreen}
        options={{
          headerTitle: () => (
            <CustomText
              weight="600"
              style={{ fontSize: 18, color: colors.gray7 }}
            >
              미리보기
            </CustomText>
          ),
          headerTitleAlign: 'center',
          headerShadowVisible: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default HomeStack;
