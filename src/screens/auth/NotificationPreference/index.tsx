import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../../navigation/types';
import { Colors } from '../../../constants/colors';
import { Theme } from '../../../constants/theme';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { AuthHeader } from '../../../components/authHeader/AuthHeader';
import { AuthButton } from '../../../components/Button/AuthButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CustomSwitch } from '../../../components/Switch/CustomSwitch';

type Props = NativeStackScreenProps<AuthStackParamList, 'NotificationPreference'>;

const NotificationPreferenceScreen: React.FC<Props> = ({ navigation, route }) => {
    console.log('route.params', route.params);
    const insets = useSafeAreaInsets();
    const { email, name, age, gender, password, society_name, flat_number, preferred_interest, emoji_name, emoji, emoji_url } = route.params;

    const [activityAlerts, setActivityAlerts] = useState(true);
    const [eventReminders, setEventReminders] = useState(true);
    const [chatNotifications, setChatNotifications] = useState(true);

    const handleDone = () => {
        console.log({
            activityAlerts,
            eventReminders,
            chatNotifications
        });

        navigation.navigate('FinishAuth', {
            email,
            name,
            age,
            gender,
            password,
            society_name,
            flat_number,
            preferred_interest,
            emoji_name,
            emoji,
            emoji_url,
            activity_alerts: activityAlerts,
            event_reminders: eventReminders,
            chat_notifications: chatNotifications,
        });
    };

    const renderPreferenceItem = (
        title: string,
        description: string,
        value: boolean,
        onValueChange: (val: boolean) => void
    ) => (
        <View style={styles.preferenceGroup}>
            <Text style={styles.preferenceTitle}>{title}</Text>
            <View style={styles.preferenceContainer}>
                <Text style={styles.preferenceDescription}>{description}</Text>
                <CustomSwitch
                    value={value}
                    onValueChange={onValueChange}
                    activeColor="#FFCCB6"
                />
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <AuthHeader
                title="Notification Preference 🔔"
                subtitle="How do you want to stay updated?"
                onBackPress={() => navigation.goBack()}
            />

            <View style={styles.content}>
                {renderPreferenceItem(
                    'Activity Alerts',
                    'Let me know about fun activities and new matches!',
                    activityAlerts,
                    setActivityAlerts
                )}

                {renderPreferenceItem(
                    'Event Reminders',
                    'Remind me about society events!',
                    eventReminders,
                    setEventReminders
                )}

                {renderPreferenceItem(
                    'Chat Notifications',
                    'Buzz me when I get a message',
                    chatNotifications,
                    setChatNotifications
                )}

                <View style={[styles.footer]}>
                    <AuthButton
                        title="Done with settings📲"
                        onPress={handleDone}
                        style={{ backgroundColor: Colors.pink, }}
                        textStyle={{ color: Colors.black }}
                    />

                </View>
            </View>


            <Text style={[styles.footerNote, { marginBottom: insets.bottom }]}>
                Don't worry, we won't spam... much
            </Text>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    content: {
        flex: 1,
        paddingHorizontal: Theme.spacing.lg,
        paddingTop: verticalScale(10),
    },
    preferenceGroup: {
        marginBottom: verticalScale(20),
    },
    preferenceTitle: {
        fontSize: Theme.fontSize.xs + scale(1),
        fontFamily: Theme.fontFamily.medium,
        color: Colors.text,
        marginBottom: verticalScale(3),
        marginLeft: moderateScale(15),
    },
    preferenceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: moderateScale(20),
        paddingHorizontal: moderateScale(15),
        paddingVertical: moderateScale(12),
        ...Theme.shadow.sm,
    },
    preferenceDescription: {
        fontSize: moderateScale(13),
        fontFamily: Theme.fontFamily.medium,
        color: Colors.textSecondary,
        flex: 1,
        marginRight: moderateScale(10),
        lineHeight: moderateScale(18),
    },
    footer: {
        alignItems: 'center',
        paddingHorizontal: Theme.spacing.lg,
        marginTop: verticalScale(20)
    },
    footerNote: {
        fontSize: moderateScale(12),
        fontFamily: Theme.fontFamily.semiBold,
        color: Colors.text,
        textAlign: 'center',
        marginTop: verticalScale(20),
    },
});

export default NotificationPreferenceScreen;
