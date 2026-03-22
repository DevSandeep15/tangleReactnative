import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

class GoogleSigninService {
    constructor() {
        GoogleSignin.configure({
            webClientId: '53225538485-psti3op4i5qbaadlh9i7bcipahqi93up.apps.googleusercontent.com',
            offlineAccess: false,
        });
    }

    async signIn() {
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            console.log('--- Google Sign-In Success ---', userInfo);
            return userInfo;
        } catch (error: any) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                console.log('--- Google Sign-In Cancelled ---');
            } else if (error.code === statusCodes.IN_PROGRESS) {
                console.log('--- Google Sign-In In Progress ---');
                // Try to sign out to clear the state
                await GoogleSignin.signOut();
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                console.log('--- Google Play Services Not Available ---');
            } else {
                console.log('--- Google Sign-In Error ---', error);
            }
            throw error;
        }
    }

    async signOut() {
        try {
            await GoogleSignin.signOut();
        } catch (error) {
            console.error('--- Google Sign-Out Error ---', error);
        }
    }

    async revokeAccess() {
        try {
            await GoogleSignin.revokeAccess();
            await GoogleSignin.signOut();
        } catch (error) {
            console.error('--- Google Revoke Access Error ---', error);
        }
    }
}

export default new GoogleSigninService();
