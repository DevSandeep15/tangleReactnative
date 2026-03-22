import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import AppNavigator from './src/navigation/AppNavigator';
import { Colors } from './src/constants/colors';
import { NavigationContainer } from '@react-navigation/native';
import { store, persistor } from './src/store/store';
import SocketInitializer from './src/services/SocketInitializer';
import NotificationInitializer from './src/services/NotificationInitializer';
import Toast from 'react-native-toast-message';
import FCMService from './src/services/FCMService';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    const fetchFCMToken = async () => {
      const token = await FCMService.getDeviceToken();
      console.log('=== FCM TOKEN FROM APP.TSX ===', token);
    };
    
    fetchFCMToken();
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SocketInitializer />
        <NotificationInitializer />
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SafeAreaProvider>
            <NavigationContainer>
              <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor={isDarkMode ? Colors.backgroundDark : Colors.background}
              />
              <AppNavigator />
            </NavigationContainer>
          </SafeAreaProvider>
        </GestureHandlerRootView>
        <Toast />
      </PersistGate>
    </Provider>
  );
}

export default App;
