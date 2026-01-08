import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabNavigator from './BottomTabNavigator';
import type { RootStackParamList } from './types';
import { Colors } from '../constants/colors';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: Colors.background },
            }}>
            <Stack.Screen
                name="MainTabs"
                component={BottomTabNavigator}
            />
            {/* Add other global screens here, e.g.: */}
            {/* <Stack.Screen name="Details" component={DetailsScreen} /> */}
        </Stack.Navigator>
    );
};

export default AppNavigator;
