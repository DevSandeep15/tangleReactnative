import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Colors } from '../../../constants/colors';
import { Theme } from '../../../constants/theme';
import type { ServicesScreenProps } from '../../../navigation/types';
import Header from '../../../components/commonHeader/Header';

const ServiceScreen: React.FC<ServicesScreenProps> = ({ navigation }) => {
    return (
        <SafeAreaView style={styles.container}>
            <Header title="Services" />

            <View style={styles.content}>
                <Text style={styles.text}>Featuer Coming Soon</Text>

            </View>
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
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: Theme.fontSize.lg,
        fontFamily: Theme.fontFamily.semiBold,
        color: Colors.text,
        textAlign: 'center',
        marginTop: Theme.spacing.md,
    },

});

export default ServiceScreen;
