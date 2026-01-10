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

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
    const commentSheetRef = React.useRef<CommentBottomSheetRef>(null);

    React.useEffect(() => {
        const subscription = DeviceEventEmitter.addListener('OPEN_COMMENTS', () => {
            if (commentSheetRef.current) {
                commentSheetRef.current.open();
            }
        });
        return () => subscription.remove();
    }, []);

    return (
        <View style={{ flex: 1 }}>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: Colors.background },
                }}>
                <Stack.Screen
                    name="MainTabs"
                    component={BottomTabNavigator}
                />
                <Stack.Screen
                    name="Notifications"
                    component={NotificationScreen}
                    options={{
                        animation: 'slide_from_right'
                    }}
                />
                <Stack.Screen
                    name="Inbox"
                    component={InboxScreen}
                    options={{
                        animation: 'slide_from_right'
                    }}
                />
                <Stack.Screen
                    name="ChatDetail"
                    component={ChatScreen}
                    options={{
                        animation: 'slide_from_right'
                    }}
                />
            </Stack.Navigator>

            <CommentBottomSheet
                ref={commentSheetRef}
                onClose={() => commentSheetRef.current?.close()}
            />
        </View>
    );
};

export default AppNavigator;
