import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { NavigatorScreenParams } from '@react-navigation/native';

// Define the param list for bottom tabs
export type RootTabParamList = {
    Home: undefined;
    Services: undefined;
    Add: undefined;
    Hub: undefined;
    Profile: undefined;
};

// Define the param list for stack navigation
export type RootStackParamList = {
    MainTabs: NavigatorScreenParams<RootTabParamList>;
    // Add other screens here, e.g.:
    // Details: { id: string };
    // Settings: undefined;
};

// Screen props types for type-safe navigation
export type HomeScreenProps = BottomTabScreenProps<RootTabParamList, 'Home'>;
export type ServicesScreenProps = BottomTabScreenProps<RootTabParamList, 'Services'>;
export type AddScreenProps = BottomTabScreenProps<RootTabParamList, 'Add'>;
export type HubScreenProps = BottomTabScreenProps<RootTabParamList, 'Hub'>;
export type ProfileScreenProps = BottomTabScreenProps<RootTabParamList, 'Profile'>;

// Type for screens in the stack
export type MainTabsScreenProps = NativeStackScreenProps<RootStackParamList, 'MainTabs'>;

// Declare global types for navigation
declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList { }
    }
}
