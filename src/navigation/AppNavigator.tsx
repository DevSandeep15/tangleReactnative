import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabNavigator from './BottomTabNavigator';
import type { RootStackParamList } from './types';
import { Colors } from '../constants/colors';
import CommentBottomSheet, { CommentBottomSheetRef } from '../screens/dash/Home/CommentBottomSheet';
import { DeviceEventEmitter, View } from 'react-native';
import NotificationScreen from '../screens/dash/Notification/NotificationScreen';
import InboxScreen from '../screens/dash/Inbox/InboxScreen';
import ChatScreen from '../screens/dash/Inbox/ChatScreen';

import WelcomeScreen from '../screens/auth/welCome';
import LoginScreen from '../screens/auth/Login';
import SignupScreen from '../screens/auth/Signup';
import VerificationScreen from '../screens/auth/Verification';
import SetupProfileScreen from '../screens/auth/SetupProfile';
import LocationScreen from '../screens/auth/Location';
import InterestsScreen from '../screens/auth/Interests';
import CreateAvatarScreen from '../screens/auth/CreateAvatar';
import NotificationPreferenceScreen from '../screens/auth/NotificationPreference';
import FinishAuthScreen from '../screens/auth/finishAuth';
import FindBuddyScreen from '../screens/auth/FindBuddy';
import type { AuthStackParamList } from './types';
import Toast from 'react-native-toast-message';
import RNBootSplash from 'react-native-bootsplash';

const Stack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator = () => {
    return (
        <AuthStack.Navigator
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: Colors.background },
            }}>
            <AuthStack.Screen name="Welcome" component={WelcomeScreen} />
            <AuthStack.Screen name="Login" component={LoginScreen} />
            <AuthStack.Screen name="Signup" component={SignupScreen} />
            <AuthStack.Screen name="Verification" component={VerificationScreen} />
            <AuthStack.Screen name="SetupProfile" component={SetupProfileScreen} />
            <AuthStack.Screen name="Location" component={LocationScreen} />
            <AuthStack.Screen name="Interests" component={InterestsScreen} />
            <AuthStack.Screen name="CreateAvatar" component={CreateAvatarScreen} />
            <AuthStack.Screen name="NotificationPreference" component={NotificationPreferenceScreen} />
            <AuthStack.Screen name="FinishAuth" component={FinishAuthScreen} />
            <AuthStack.Screen name="FindBuddy" component={FindBuddyScreen} />
        </AuthStack.Navigator>
    );
};

const MainNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: Colors.background },
            }}>
            <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
            <Stack.Screen
                name="Notifications"
                component={NotificationScreen}
                options={{ animation: 'slide_from_right' }}
            />
            <Stack.Screen
                name="Inbox"
                component={InboxScreen}
                options={{ animation: 'slide_from_right' }}
            />
            <Stack.Screen
                name="ChatDetail"
                component={ChatScreen}
                options={{ animation: 'slide_from_right' }}
            />
        </Stack.Navigator>
    );
};

const AppNavigator: React.FC = () => {
    const commentSheetRef = React.useRef<CommentBottomSheetRef>(null);
    const [isAuthenticated, setIsAuthenticated] = React.useState(false); // Simulate auth state

    React.useEffect(() => {
        RNBootSplash.hide({ fade: true });

        const commentSubscription = DeviceEventEmitter.addListener('OPEN_COMMENTS', () => {
            if (commentSheetRef.current) {
                commentSheetRef.current.open();
            }
        });

        const authSubscription = DeviceEventEmitter.addListener('LOGIN', () => {
            setIsAuthenticated(true);
        });

        return () => {
            commentSubscription.remove();
            authSubscription.remove();
        };
    }, []);

    return (
        <View style={{ flex: 1 }}>
            {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}

            <CommentBottomSheet
                ref={commentSheetRef}
                onClose={() => commentSheetRef.current?.close()}
            />
            <Toast />
        </View>
    );
};

export default AppNavigator;
