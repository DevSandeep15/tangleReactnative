import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Platform, View, TouchableOpacity, Text, Image } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import type { RootTabParamList } from './types';
import { Colors } from '../constants/colors';
import { Theme } from '../constants/theme';

import ServiceScreen from '../screens/Service/ServiceScreen';
import HomeScreen from '../screens/Home/HomeScreen';
import HubScreen from '../screens/Hub/HubScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import { ICONS } from '../constants/icons';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import CreatePost, { CreatePostBottomSheetRef } from '../screens/Add/createPost';



const Tab = createBottomTabNavigator<RootTabParamList>();

// Tab icon component with proper TypeScript typing
interface TabIconProps {
    focused: boolean;
    size: number;
    iconName: keyof typeof ICONS;
}

const TabIcon: React.FC<TabIconProps> = ({ focused, size, iconName }) => {
    const iconSource = ICONS[iconName];

    if (!iconSource) {
        return null;
    }

    return (
        <Image
            source={iconSource as any}
            style={{
                width: size,
                height: size,
            }}
            resizeMode="contain"
        />
    );
};

// Custom Tab Bar Component
interface CustomTabBarProps extends BottomTabBarProps {
    onOpenCreatePost: () => void;
}

const CustomTabBar: React.FC<CustomTabBarProps> = ({ state, descriptors, navigation, onOpenCreatePost }) => {
    return (
        <View style={styles.tabBarContainer}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                            ? options.title
                            : route.name;

                const isFocused = state.index === index;
                const isMiddleTab = index === 2;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };

                // Get icon color
                const textColor = isFocused ? Colors.tabBarActive : Colors.tabBarInactive;

                // Render middle button differently
                if (isMiddleTab) {
                    return (
                        <TouchableOpacity
                            activeOpacity={0.8}
                            key={route.key}
                            accessibilityRole="button"
                            accessibilityState={isFocused ? { selected: true } : {}}
                            accessibilityLabel={options.tabBarAccessibilityLabel}
                            onPress={onOpenCreatePost}
                            onLongPress={onLongPress}
                            style={styles.middleTabButton}>
                            <View style={styles.floatingButton}>
                                <View style={styles.plusIcon}>
                                    <Image source={ICONS.plus} style={styles.plusIcon} />
                                </View>
                            </View>
                        </TouchableOpacity>
                    );
                }

                // Get the icon name based on route
                let iconName: keyof typeof ICONS = 'homeTab';
                switch (route.name) {
                    case 'Home':
                        iconName = 'homeTab';
                        break;
                    case 'Services':
                        iconName = 'serviceTab';
                        break;
                    case 'Hub':
                        iconName = 'hubTab';
                        break;
                    case 'Profile':
                        iconName = 'profileTab';
                        break;
                }

                return (
                    <TouchableOpacity
                        key={route.key}
                        accessibilityRole="button"
                        accessibilityState={isFocused ? { selected: true } : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        style={styles.tabButton}>
                        <View style={styles.tabIconContainer}>
                            <TabIcon
                                focused={isFocused}
                                // color={iconColor}
                                size={scale(21)}
                                iconName={iconName}
                            />
                        </View>
                        {typeof label === 'string' && label !== '' && (
                            <Text style={[styles.labelText, { color: textColor }]}>
                                {label}
                            </Text>
                        )}
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const BottomTabNavigator: React.FC = () => {
    const createPostRef = React.useRef<CreatePostBottomSheetRef>(null);

    const handleOpenCreatePost = () => {
        createPostRef.current?.expand();
    };

    return (
        <View style={{ flex: 1 }}>
            <Tab.Navigator
                tabBar={(props) => <CustomTabBar {...props} onOpenCreatePost={handleOpenCreatePost} />}
                screenOptions={{
                    headerShown: false,
                    headerStyle: styles.header,
                    headerTitleStyle: styles.headerTitle,
                    headerShadowVisible: false,
                }}>
                <Tab.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{
                        tabBarLabel: 'Home',
                        headerTitle: 'Home',
                    }}
                />
                <Tab.Screen
                    name="Services"
                    component={ServiceScreen}
                    options={{
                        tabBarLabel: 'Services',
                        headerTitle: 'Services',
                    }}
                />
                <Tab.Screen
                    name="Add"
                    component={CreatePost}
                    options={{
                        tabBarLabel: '',
                        headerTitle: 'Create',
                    }}
                />
                <Tab.Screen
                    name="Hub"
                    component={HubScreen}
                    options={{
                        tabBarLabel: 'Hub',
                        headerTitle: 'Hub',
                    }}
                />
                <Tab.Screen
                    name="Profile"
                    component={ProfileScreen}
                    options={{
                        tabBarLabel: 'Profile',
                        headerTitle: 'Profile',
                    }}
                />
            </Tab.Navigator>

            <CreatePost ref={createPostRef} />
        </View>
    );
};

const styles = StyleSheet.create({
    tabBarContainer: {
        flexDirection: 'row',
        backgroundColor: Colors.white,
        height: Platform.OS === 'ios' ? verticalScale(85) : verticalScale(65),
        paddingBottom: Platform.OS === 'ios' ? verticalScale(25) : verticalScale(10),
        paddingTop: verticalScale(10),
        paddingHorizontal: scale(10),
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: verticalScale(-2) },
        shadowOpacity: 0.1,
        shadowRadius: moderateScale(8),
    },
    tabButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    middleTabButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: verticalScale(-10),
    },
    tabIconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: verticalScale(4),
    },
    labelText: {
        fontSize: moderateScale(11),
        fontFamily: Theme.fontFamily.semiBold,
        marginBottom: verticalScale(2),
    },
    floatingButton: {
        width: scale(45),
        height: scale(45),
        borderRadius: scale(28),
        backgroundColor: Colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: moderateScale(4),
        borderWidth: 1,
        borderColor: '#E5E5E5',
    },
    plusIcon: {
        width: scale(24),
        height: scale(24),
        alignItems: 'center',
        justifyContent: 'center',
    },
    plusHorizontal: {
        position: 'absolute',
        width: scale(20),
        height: verticalScale(3),
        backgroundColor: '#333',
        borderRadius: moderateScale(1.5),
    },
    plusVertical: {
        position: 'absolute',
        width: scale(3),
        height: verticalScale(20),
        backgroundColor: '#333',
        borderRadius: moderateScale(1.5),
    },
    header: {
        backgroundColor: Colors.background,
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
        height: Platform.OS === 'ios' ? verticalScale(100) : verticalScale(60),
    },
    headerTitle: {
        fontSize: moderateScale(18),
        fontFamily: Theme.fontFamily.semiBold,
        color: Colors.text,
    },
});

export default BottomTabNavigator;
