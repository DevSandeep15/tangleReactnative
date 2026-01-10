import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { verticalScale, scale } from 'react-native-size-matters';
import { Colors } from '../../../constants/colors';
import { Theme } from '../../../constants/theme';
import ImagePickerService from '../../../services/ImagePickerService';

interface Props {
    imageUri: string | null;
    onImageSelected: (uri: string | null) => void;
}

const ImagePreview: React.FC<Props> = ({ imageUri, onImageSelected }) => {
    if (!imageUri) return null;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Text style={styles.headerEmoji}>📸</Text>
                    <Text style={styles.headerTitle}>Image Preview</Text>
                </View>
                <TouchableOpacity onPress={() => onImageSelected(null)}>
                    <Text style={styles.closeIcon}>✕</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.imageContainer}>
                <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: Theme.spacing.xs,
        padding: Theme.spacing.md,
        borderRadius: Theme.borderRadius.xl,
        borderWidth: 1,
        borderColor: Colors.border,
        backgroundColor: Colors.buttonColor
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Theme.spacing.sm,
    },
    headerLeft: {
        flexDirection: 'row',
    },
    headerEmoji: {
        fontSize: Theme.fontSize.sm,
        marginRight: Theme.spacing.xs,
    },
    headerTitle: {
        fontSize: Theme.fontSize.xs + 1,
        fontFamily: Theme.fontFamily.medium,
        color: Colors.text,
    },
    closeIcon: {
        fontSize: Theme.fontSize.sm,
        color: Colors.textSecondary,
        fontFamily: Theme.fontFamily.semiBold,
    },
    imageContainer: {
        width: '100%',
        height: verticalScale(150),
        borderRadius: Theme.borderRadius.lg,
        backgroundColor: '#858585',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: Colors.border,
    },
    placeholderContainer: {
        borderStyle: 'dashed',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    placeholderText: {
        color: Colors.textSecondary,
        fontSize: Theme.fontSize.sm,
        fontFamily: Theme.fontFamily.regular,
    },
});

export default ImagePreview;

