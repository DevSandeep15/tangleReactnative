import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';

// Define the param list for bottom tabs
export type RootTabParamList = {
    Home: undefined;
    Services: undefined;
    Add: undefined;
    Hub: undefined;
    Profile: undefined;
};

// Define the param list for auth stack
export type AuthStackParamList = {
    Welcome: undefined;
    Login: undefined;
    Signup: undefined;
    Verification: { email: string };
};

// Define the param list for stack navigation
export type RootStackParamList = {
    Auth: NavigatorScreenParams<AuthStackParamList>;
    MainTabs: NavigatorScreenParams<RootTabParamList>;
    Notifications: undefined;
    Inbox: undefined;
    ChatDetail: { name: string; avatar: any };
};

export type WelcomeScreenProps = NativeStackScreenProps<AuthStackParamList, 'Welcome'>;

export type InboxScreenProps = NativeStackScreenProps<RootStackParamList, 'Inbox'>;
export type ChatDetailScreenProps = NativeStackScreenProps<RootStackParamList, 'ChatDetail'>;

// Screen props types for type-safe navigation
export type HomeScreenProps = CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, 'Home'>,
    NativeStackScreenProps<RootStackParamList>
>;

export type ServicesScreenProps = CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, 'Services'>,
    NativeStackScreenProps<RootStackParamList>
>;

export type AddScreenProps = CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, 'Add'>,
    NativeStackScreenProps<RootStackParamList>
>;

export type HubScreenProps = CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, 'Hub'>,
    NativeStackScreenProps<RootStackParamList>
>;

export type ProfileScreenProps = CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, 'Profile'>,
    NativeStackScreenProps<RootStackParamList>
>;

export type NotificationScreenProps = NativeStackScreenProps<RootStackParamList, 'Notifications'>;

// Type for screens in the stack
export type MainTabsScreenProps = NativeStackScreenProps<RootStackParamList, 'MainTabs'>;

// Declare global types for navigation
declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList { }
    }
}
