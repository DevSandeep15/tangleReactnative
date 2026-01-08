import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Colors } from '../../constants/colors';
import { Theme } from '../../constants/theme';
import type { ServicesScreenProps } from '../../navigation/types';

const ServiceScreen: React.FC<ServicesScreenProps> = ({ navigation }) => {
    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.header}>
                <Text style={styles.title}>Services</Text>
                <Text style={styles.subtitle}>Explore our services</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>Available Services</Text>
                <Text style={styles.cardText}>
                    Your services will be displayed here. Add your service components and features.
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
        marginBottom: Theme.spacing.lg,
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

export default ServiceScreen;
