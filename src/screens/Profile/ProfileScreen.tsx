import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Colors } from '../../constants/colors';
import { Theme } from '../../constants/theme';
import type { ProfileScreenProps } from '../../navigation/types';

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.header}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>U</Text>
                </View>
                <Text style={styles.title}>User Profile</Text>
                <Text style={styles.subtitle}>Manage your account</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>Profile Information</Text>
                <Text style={styles.cardText}>
                    Your profile details and settings will be displayed here.
                </Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    content: {
        padding: Theme.spacing.md,
    },
    header: {
        alignItems: 'center',
        marginBottom: Theme.spacing.lg,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Theme.spacing.md,
        ...Theme.shadow.md,
    },
    avatarText: {
        fontSize: Theme.fontSize.xxxl,
        fontWeight: Theme.fontWeight.bold,
        color: Colors.white,
    },
    title: {
        fontSize: Theme.fontSize.xxxl,
        fontWeight: Theme.fontWeight.bold,
        color: Colors.text,
        marginBottom: Theme.spacing.xs,
    },
    subtitle: {
        fontSize: Theme.fontSize.md,
        color: Colors.textSecondary,
    },
    card: {
        backgroundColor: Colors.backgroundSecondary,
        padding: Theme.spacing.md,
        borderRadius: Theme.borderRadius.lg,
        ...Theme.shadow.sm,
    },
    cardTitle: {
        fontSize: Theme.fontSize.lg,
        fontWeight: Theme.fontWeight.semibold,
        color: Colors.text,
        marginBottom: Theme.spacing.sm,
    },
    cardText: {
        fontSize: Theme.fontSize.md,
        color: Colors.textSecondary,
        lineHeight: 22,
    },
});

export default ProfileScreen;
