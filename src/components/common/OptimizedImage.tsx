import React from 'react';
import { View, Image, StyleSheet, ImageProps, ViewStyle } from 'react-native';
import { Colors } from '../../constants/colors';

interface OptimizedImageProps extends ImageProps {
    containerStyle?: ViewStyle;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
    containerStyle,
    style,
    ...props
}) => {
    return (
        <View style={[styles.container, { backgroundColor: Colors.white }, containerStyle]}>
            <Image
                {...props}
                style={[styles.image, style]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
    },
});

export default OptimizedImage;
