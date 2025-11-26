import React, { useEffect } from 'react';
import StackNavigator from './src/navigation/StackNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'react-native';
import Toast from 'react-native-toast-message';
import CustomErrToast from './src/components/ui/CustomErrToast';
import CustomSuccessToast from './src/components/ui/CustomSuccessToast';
import { LoadingProvider } from './src/components/ui/LoadingContext';

const App: React.FC = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="#ffffff"
          hidden={false}
        />
        <NavigationContainer>
          <LoadingProvider>
            <StackNavigator />
          </LoadingProvider>
        </NavigationContainer>
        <Toast
          position="bottom"
          config={{
            error: props => <CustomErrToast {...props} />,
            success: props => <CustomSuccessToast {...props} />,
          }}
        />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
