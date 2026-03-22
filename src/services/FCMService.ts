import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { Platform, PermissionsAndroid } from 'react-native';

class FCMService {
    async getDeviceToken() {
        try {
            console.log('--- FCM Debug: Starting Token Fetch ---');

            // 1. Request Permission first (Handles iOS & Android 13+)
            let authStatus = await messaging().hasPermission();
            console.log('--- FCM Auth Status ---', authStatus);

            if (
                authStatus === messaging.AuthorizationStatus.NOT_DETERMINED ||
                authStatus === messaging.AuthorizationStatus.DENIED
            ) {
                try {
                    authStatus = await messaging().requestPermission();
                    console.log('--- FCM Requested Auth Status ---', authStatus);
                } catch (e) {
                    console.log('--- FCM Request Permission Error ---', e);
                }
            }

            // Also explicitly check Android permission just in case
            if (Platform.OS === 'android' && Number(Platform.Version) >= 33) {
                try {
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
                    );
                    console.log('--- Android POST_NOTIFICATIONS Status ---', granted);
                } catch (e) {
                    console.log('--- Android Request Permission Error ---', e);
                }
            }

            const enabled =
                authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                authStatus === messaging.AuthorizationStatus.PROVISIONAL ||
                Platform.OS === 'android';

            if (enabled) {
                const token = await messaging().getToken();
                console.log('--- FCM Token Success ---', token);
                return token;
            } else {
                console.log('--- FCM Permissions Not Enabled ---', authStatus);
            }
            return null;
        } catch (error: any) {
            console.log('--- FCM Token Global Error ---', {
                message: error.message,
                code: error.code
            });
            return null;
        }
    }

    getDeviceType() {
        return Platform.OS; // returns 'ios' or 'android'
    }
}

export default new FCMService();
