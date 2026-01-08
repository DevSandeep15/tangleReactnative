import { PermissionsAndroid, Platform, Alert, Linking } from 'react-native';
import ImagePicker, { Options } from 'react-native-image-crop-picker';

const DEFAULT_OPTIONS: Options = {
    width: 1200,
    height: 800,
    cropping: true,
    mediaType: 'photo',
};

class ImagePickerService {
    async openCamera(customOptions?: Options) {
        try {
            if (Platform.OS === 'android') {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA
                );

                if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
                    this.showSettingsAlert('Camera');
                    return null;
                }

                if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                    return null;
                }
            }

            const image = await ImagePicker.openCamera({ ...DEFAULT_OPTIONS, ...customOptions });
            return image.path;
        } catch (error: any) {
            console.log('Camera Error: ', error);
            // Handle iOS denial or other issues
            if (error.message?.includes('Access to camera/photos was denied')) {
                this.showSettingsAlert('Camera');
            }
            return null;
        }
    }

    async openGallery(customOptions?: Options) {
        try {
            const image = await ImagePicker.openPicker({ ...DEFAULT_OPTIONS, ...customOptions });
            return image.path;
        } catch (error: any) {
            console.log('Gallery Error: ', error);
            if (error.message?.includes('Access to camera/photos was denied')) {
                this.showSettingsAlert('Gallery');
            }
            return null;
        }
    }

    private showSettingsAlert(type: string) {
        Alert.alert(
            `${type} Permission`,
            `We need access to your ${type.toLowerCase()} to upload photos. Please allow it from settings.`,
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Open Settings', onPress: () => Linking.openSettings() },
            ]
        );
    }
}

export default new ImagePickerService();

