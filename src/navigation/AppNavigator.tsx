import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabNavigator from './BottomTabNavigator';
import type { RootStackParamList } from './types';
import { useAppSelector } from '../store/hooks';
import { Colors } from '../constants/colors';
import CommentBottomSheet, { CommentBottomSheetRef } from '../screens/dash/Home/CommentBottomSheet';
import { DeviceEventEmitter, View } from 'react-native';
import NotificationScreen from '../screens/dash/Notification/NotificationScreen';
import InboxScreen from '../screens/dash/Inbox/InboxScreen';
import ChatScreen from '../screens/dash/Inbox/ChatScreen';

import WelcomeScreen from '../screens/auth/welCome';
import LoginScreen from '../screens/auth/Login';
import EmailLoginScreen from '../screens/auth/Login/EmailLogin';
import ForgotPasswordScreen from '../screens/auth/Login/ForgotPassword';
import ResetPasswordScreen from '../screens/auth/Login/ResetPassword';
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
            <AuthStack.Screen name="EmailLogin" component={EmailLoginScreen} />
            <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            <AuthStack.Screen name="ResetPassword" component={ResetPasswordScreen} />
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
    const [activePostId, setActivePostId] = React.useState<string | null>(null);
    const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
    console.log('--- AppNavigator Auth Status ---', isAuthenticated);

    React.useEffect(() => {
        RNBootSplash.hide({ fade: true });

        const commentSubscription = DeviceEventEmitter.addListener('OPEN_COMMENTS', (data) => {
            if (data?.postId) {
                setActivePostId(data.postId);
                if (commentSheetRef.current) {
                    commentSheetRef.current.open();
                }
            }
        });

        return () => {
            commentSubscription.remove();
        };
    }, []);

    return (
        <View style={{ flex: 1 }}>
            {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}

            <CommentBottomSheet
                ref={commentSheetRef}
                postId={activePostId}
                onClose={() => {
                    commentSheetRef.current?.close();
                    setActivePostId(null);
                }}
            />
            <Toast />
        </View>
    );
};

export default AppNavigator;
