import React, { useEffect } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, AndroidVisibility } from '@notifee/react-native';

const NotificationInitializer: React.FC = () => {
    useEffect(() => {
        const setupNotifications = async () => {
            try {
                // Tell Firebase NOT to show its own alerts in foreground
                // This prevents the "Alert" you are seeing and lets Notifee handle the banner.
                // Only for iOS, as it may throw on Android.
                if (Platform.OS === 'ios') {
                    await (messaging() as any).setForegroundNotificationPresentationOptions({
                        alert: false,
                        badge: true,
                        sound: false,
                    });
                }
            } catch (error) {
                console.log('Error setting foreground options:', error);
            }

            try {
                // For Android 13+, explicit permission prompt is required
                if (Platform.OS === 'android' && Number(Platform.Version) >= 33) {
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
                    );
                    console.log('--- POST_NOTIFICATIONS Permission ---', granted);
                }
            } catch (error) {
                console.log('Error requesting Android permissions:', error);
            }

            try {
                // Request explicit Notifee permissions as a fallback/sync
                await notifee.requestPermission();
            } catch (error) {
                console.log('Error requesting Notifee permissions:', error);
            }

            try {
                // Create a high-priority channel (required for Android)
                await notifee.createChannel({
                    id: 'high_priority_channel',
                    name: 'High Priority Notifications',
                    importance: AndroidImportance.HIGH,
                    visibility: AndroidVisibility.PUBLIC,
                });
            } catch (error) {
                console.log('Error creating channel:', error);
            }
        };

        setupNotifications();

        // Handle foreground messages
        const unsubscribe = messaging().onMessage(async remoteMessage => {
            console.log('--- FCM Foreground Message ---', remoteMessage);

            try {
                // Display a banner using Notifee
                await notifee.displayNotification({
                    title: remoteMessage.notification?.title || 'New Notification',
                    body: remoteMessage.notification?.body || 'You have a new message',
                    android: {
                        channelId: 'high_priority_channel',
                        importance: AndroidImportance.HIGH,
                        smallIcon: 'ic_launcher', // Required for Android, otherwise Notifee may fail silently
                        pressAction: {
                            id: 'default',
                        },
                    },
                });
                console.log('--- Notifee Foreground Display Success ---');
            } catch (error) {
                console.error('--- Notifee Foreground Display Error ---', error);
            }
        });

        // Handle background/quit state notification clicks
        messaging().onNotificationOpenedApp(remoteMessage => {
            console.log('--- FCM Notification opened app from background state ---', remoteMessage);
        });

        // Check if the app was opened from a quit state via a notification
        messaging()
            .getInitialNotification()
            .then(remoteMessage => {
                if (remoteMessage) {
                    console.log('--- FCM Notification opened app from quit state ---', remoteMessage);
                }
            });

        return unsubscribe;
    }, []);

    return null;
};

export default NotificationInitializer;
