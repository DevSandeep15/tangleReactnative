import { moderateScale } from 'react-native-size-matters';

export const Theme = {
    // Spacing
    spacing: {
        xs: moderateScale(4),
        sm: moderateScale(8),
        md: moderateScale(16),
        lg: moderateScale(24),
        xl: moderateScale(32),
        xxl: moderateScale(48),
    },

    // Border Radius
    borderRadius: {
        sm: moderateScale(4),
        md: moderateScale(8),
        lg: moderateScale(12),
        xl: moderateScale(16),
        round: moderateScale(999),
    },

    // Font Sizes
    fontSize: {
        xs: moderateScale(12),
        sm: moderateScale(14),
        md: moderateScale(16),
        lg: moderateScale(18),
        xl: moderateScale(20),
        xxl: moderateScale(24),
        xxxl: moderateScale(32),
    },

    // Font Weights - keeping for reference, but should prefer fontFamily
    fontWeight: {
        regular: '400' as const,
        medium: '500' as const,
        semibold: '600' as const,
        bold: '700' as const,
    },

    // Font Families
    fontFamily: {
        black: 'Montserrat-Black',
        bold: 'Montserrat-Bold',
        extraBold: 'Montserrat-ExtraBold',
        light: 'Montserrat-Light',
        medium: 'Montserrat-Medium',
        regular: 'Montserrat-Regular',
        semiBold: 'Montserrat-SemiBold',
    },

    // Shadows
    shadow: {
        sm: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: moderateScale(1) },
            shadowOpacity: 0.05,
            shadowRadius: moderateScale(2),
            elevation: 2,
        },
        md: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: moderateScale(2) },
            shadowOpacity: 0.1,
            shadowRadius: moderateScale(4),
            elevation: 4,
        },
        lg: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: moderateScale(4) },
            shadowOpacity: 0.15,
            shadowRadius: moderateScale(8),
            elevation: 8,
        },
    },
};
