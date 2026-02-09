import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { verticalScale, scale } from 'react-native-size-matters';
import { Colors } from '../../../constants/colors';
import { Theme } from '../../../constants/theme';
import ImagePickerService from '../../../services/ImagePickerService';

interface Props {
    imageUris: string[];
    onRemoveImage: (index: number) => void;
}

const ImagePreview: React.FC<Props> = ({ imageUris, onRemoveImage }) => {
    if (imageUris.length === 0) return null;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Text style={styles.headerEmoji}>📸</Text>
                    <Text style={styles.headerTitle}>Image Preview ({imageUris.length})</Text>
                </View>
            </View>
            <View style={styles.scrollContainer}>
                {imageUris.map((uri, index) => (
                    <View key={index} style={styles.imageWrapper}>
                        <Image source={{ uri }} style={styles.image} resizeMode="cover" />
                        <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={() => onRemoveImage(index)}
                        >
                            <Text style={styles.deleteIcon}>✕</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: Theme.spacing.md,
        padding: Theme.spacing.md,
        borderRadius: Theme.borderRadius.xl,
        borderWidth: 1,
        borderColor: Colors.border,
        backgroundColor: Colors.buttonColor,
        ...Theme.shadow.sm,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Theme.spacing.sm,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
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
    scrollContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: scale(10),
    },
    imageWrapper: {
        width: scale(80),
        height: scale(80),
        borderRadius: Theme.borderRadius.md,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: Colors.border,
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    deleteButton: {
        position: 'absolute',
        top: 2,
        right: 2,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: scale(10),
        width: scale(18),
        height: scale(18),
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteIcon: {
        color: 'white',
        fontSize: scale(10),
        fontWeight: 'bold',
    },
});

export default ImagePreview;

