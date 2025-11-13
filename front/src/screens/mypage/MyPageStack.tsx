import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import MyPageScreen from './MyPageScreen';
import InfoEditScreen from './InfoEditScreen';
import setting from '../../assets/images/icon/setting.png';
import IconButton from '../../components/buttons/IconButton';
import LikedScreen from './LikedScreen';
import RouteScreen from './RouteScreen';
import EachPostScreen from './EachPostScreen'; 


export type PostType = {
  userName: string;
  location: string;
  date: string;
  text: string;
  image: any;
};

export type MyPageStackParam = {
  MyPageScreen: undefined;
  InfoEditScreen: undefined;
  LikedScreen: undefined;
  RouteScreen: undefined;
  EachPostScreen: { post: PostType }; 
};

const Stack = createNativeStackNavigator<MyPageStackParam>();

const MyPageStack = () => {
  return (
    <Stack.Navigator initialRouteName="MyPageScreen">
      <Stack.Screen
        name="MyPageScreen"
        component={MyPageScreen}
        options={({ navigation }) => ({ 
          title: 'My Page',
          headerTitleAlign: 'center',
          // 원래 위에 있던 설정 아이콘
          headerRight: () => (
            <IconButton icon={setting} size={25} onPress={() => navigation.navigate('InfoEditScreen')}/>
          ),
        })}
      />

      <Stack.Screen
        name="EachPostScreen"
        component={EachPostScreen}
        options={{ title: 'My Page', headerTitleAlign: 'center' }}
      />

      <Stack.Screen
        name="InfoEditScreen"
        component={InfoEditScreen}
        options={{ title: 'My Page' , headerTitleAlign: 'center'}}
      />
      <Stack.Screen
        name="LikedScreen"
        component={LikedScreen}
        options={{ title: 'My Page' , headerTitleAlign: 'center'}}
      />
      <Stack.Screen
        name="RouteScreen"
        component={RouteScreen}
        options={{ title: 'My Page' , headerTitleAlign: 'center'}}
      />

    </Stack.Navigator>
  );
};

export default MyPageStack;

