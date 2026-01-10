import React, { forwardRef, useCallback, useMemo, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    Image,
    Keyboard,
    Alert,
} from 'react-native';
import BottomSheet, {
    BottomSheetBackdrop,
    BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { Colors } from '../../../constants/colors';
import { Theme } from '../../../constants/theme';
import { IMAGES } from '../../../constants/images';
import ImagePickerService from '../../../services/ImagePickerService';
import DatePicker from 'react-native-date-picker';

// Custom Components
import PostTypeSelector, { PostType } from './PostTypeSelector';
import ActionButtonsGrid from './ActionButtonsGrid';
import ImagePreview from './ImagePreview';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type CreatePostBottomSheetRef = {
    expand: () => void;
    close: () => void;
};

type Props = {
    onPostSubmit?: (data: { text: string; type: PostType; image?: string; date?: Date }) => void;
};

const CreatePost = forwardRef<CreatePostBottomSheetRef, Props>(
    ({ onPostSubmit }, ref) => {
        const insets = useSafeAreaInsets();
        const [postText, setPostText] = useState('');
        const [selectedType, setSelectedType] = useState<PostType>('Discussion');
        const [selectedImage, setSelectedImage] = useState<string | null>(null);
        const [eventDate, setEventDate] = useState<Date | null>(null);
        const [isDatePickerOpen, setDatePickerOpen] = useState(false);

        const snapPoints = useMemo(() => ['95%'], []);
        const sheetRef = React.useRef<BottomSheet>(null);

        // Ref methods
        React.useImperativeHandle(ref, () => ({
            expand: () => sheetRef.current?.expand(),
            close: () => sheetRef.current?.close(),
        }));

        const handleClose = () => {
            sheetRef.current?.close();
            Keyboard.dismiss();
        };

        const handlePost = () => {
            if (postText.trim() || selectedImage) {
                onPostSubmit?.({
                    text: postText.trim(),
                    type: selectedType,
                    image: selectedImage || undefined,
                    date: eventDate || undefined,
                });
                resetForm();
                sheetRef.current?.close();
                Keyboard.dismiss();
            }
        };

        const resetForm = () => {
            setPostText('');
            setSelectedType('Discussion');
            setSelectedImage(null);
            setEventDate(null);
        };

        const handlePhotoPress = async () => {
            Alert.alert(
                'Add Photo',
                'Choose an option',
                [
                    {
                        text: 'Take Photo',
                        onPress: async () => {
                            const path = await ImagePickerService.openCamera();
                            if (path) setSelectedImage(path);
                        },
                    },
                    {
                        text: 'Choose from Gallery',
                        onPress: async () => {
                            const path = await ImagePickerService.openGallery();
                            if (path) setSelectedImage(path);
                        },
                    },
                    { text: 'Cancel', style: 'cancel' },
                ]
            );
        };


        const renderBackdrop = useCallback(
            (props: any) => (
                <BottomSheetBackdrop
                    {...props}
                    disappearsOnIndex={-1}
                    appearsOnIndex={0}
                    opacity={0.5}
                    pressBehavior="close"
                />
            ),
            []
        );

        return (
            <>
                <BottomSheet
                    ref={sheetRef}
                    index={-1}
                    snapPoints={snapPoints}
                    enablePanDownToClose
                    backdropComponent={renderBackdrop}
                    handleIndicatorStyle={styles.handleIndicator}
                    backgroundStyle={styles.background}
                    keyboardBehavior="interactive"
                    keyboardBlurBehavior="restore"
                    bottomInset={insets.bottom}
                >

                    <View style={styles.container}>
                        {/* Header */}
                        <View style={styles.header}>
                            <View style={styles.headerLeft}>
                                <Image source={IMAGES.dummyImage} style={styles.avatar} />
                                <View style={styles.titleContainer}>
                                    <Text style={styles.title}>Create Post</Text>
                                    <Text style={styles.subtitle}>Share with your community</Text>
                                </View>
                            </View>
                            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                                <Text style={styles.closeIcon}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        <BottomSheetScrollView
                            style={{ flex: 1 }}
                            contentContainerStyle={[styles.scrollContent, { flexGrow: 1 }]}
                            keyboardShouldPersistTaps="handled"
                            showsVerticalScrollIndicator={false}
                        >
                            {/* Post Type Selector */}
                            <PostTypeSelector
                                selectedType={selectedType}
                                onSelect={setSelectedType}
                            />

                            <View style={styles.inputWrapper}>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="What's on your mind? Share with your neighbours..."
                                    placeholderTextColor={Colors.textSecondary}
                                    multiline
                                    value={postText}
                                    onChangeText={setPostText}
                                    maxLength={500}
                                />

                            </View>
                            <View style={styles.inputFooter}>
                                <Text style={styles.hashtagHint}>Add hashtags like #TangleTogether</Text>
                                <Text style={styles.charCount}>{postText.length}/500</Text>
                            </View>

                            <ActionButtonsGrid
                                onPhotoPress={handlePhotoPress}
                                onLocationPress={() => Alert.alert('Location', 'Feature coming soon!')}
                                onTagPeoplePress={() => Alert.alert('Tag People', 'Feature coming soon!')}
                                onEventDatePress={() => setDatePickerOpen(true)}
                            />

                            <ImagePreview
                                imageUri={selectedImage}
                                onImageSelected={(uri) => setSelectedImage(uri)}
                            />

                            {eventDate && (
                                <View style={styles.dateBadge}>
                                    <Text style={styles.dateBadgeText}>
                                        📅 Event Date: {eventDate.toLocaleDateString()}
                                    </Text>
                                    <TouchableOpacity onPress={() => setEventDate(null)}>
                                        <Text style={styles.removeDate}>✕</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </BottomSheetScrollView>

                        <View style={[styles.footer, { paddingBottom: insets.bottom + scale(50) }]}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={handleClose}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.postButton,

                                ]}
                                onPress={handlePost}
                                disabled={!(postText.trim() || selectedImage)}
                            >
                                <Text style={[
                                    styles.postButtonText,
                                    { color: (postText.trim() || selectedImage) ? Colors.textSecondary : Colors.textTertiary }
                                ]}>Post to Community</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </BottomSheet>

                <DatePicker
                    modal
                    open={isDatePickerOpen}
                    date={eventDate || new Date()}
                    onConfirm={(date) => {
                        setDatePickerOpen(false);
                        setEventDate(date);
                    }}
                    onCancel={() => {
                        setDatePickerOpen(false);
                    }}
                />
            </>
        );
    }
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        backgroundColor: Colors.background,
        borderTopLeftRadius: Theme.borderRadius.xl * 2,
        borderTopRightRadius: Theme.borderRadius.xl * 2,
    },
    handleIndicator: {
        backgroundColor: 'transparent',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Theme.spacing.lg,
        paddingTop: Theme.spacing.md,
        paddingBottom: Theme.spacing.md,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: scale(45),
        height: scale(45),
        borderRadius: Theme.borderRadius.round,
        backgroundColor: '#FFE5E0',
    },
    titleContainer: {
        marginLeft: Theme.spacing.md,
    },
    title: {
        fontSize: Theme.fontSize.lg,
        fontFamily: Theme.fontFamily.bold,
        color: Colors.text,
    },
    subtitle: {
        fontSize: Theme.fontSize.xs,
        fontFamily: Theme.fontFamily.medium,
        color: Colors.textSecondary,
    },
    closeButton: {
        padding: Theme.spacing.xs,
    },
    closeIcon: {
        fontSize: Theme.fontSize.sm,
        color: Colors.text,
        fontFamily: Theme.fontFamily.extraBold,
    },
    scrollContent: {
        paddingHorizontal: Theme.spacing.lg,
        paddingBottom: Theme.spacing.lg, // Reduced padding
    },
    inputWrapper: {
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: Theme.borderRadius.lg,
        padding: Theme.spacing.xs,
        minHeight: verticalScale(160),
        marginTop: Theme.spacing.md,
        backgroundColor: Colors.white,
        ...Theme.shadow.sm,
    },
    textInput: {
        fontSize: Theme.fontSize.sm,
        fontFamily: Theme.fontFamily.regular,
        color: Colors.text,
        textAlignVertical: 'top',
        maxHeight: verticalScale(160),
    },
    inputFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: Theme.spacing.sm,
    },
    hashtagHint: {
        fontSize: moderateScale(11),
        fontFamily: Theme.fontFamily.medium,
        color: Colors.border,
    },
    charCount: {
        fontSize: moderateScale(11),
        fontFamily: Theme.fontFamily.medium,
        color: Colors.border,
    },
    dateBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F2F2F7',
        padding: Theme.spacing.sm,
        borderRadius: Theme.borderRadius.md,
        marginTop: Theme.spacing.md,
        alignSelf: 'flex-start',
    },
    dateBadgeText: {
        fontSize: Theme.fontSize.sm,
        color: Colors.text,
        fontFamily: Theme.fontFamily.medium,
    },
    removeDate: {
        marginLeft: Theme.spacing.sm,
        color: Colors.error,
        fontWeight: 'bold',
    },
    footer: {
        flexDirection: 'row',
        paddingHorizontal: Theme.spacing.lg,
        paddingVertical: Theme.spacing.xs,
        borderTopWidth: 1,
        borderTopColor: '#F2F2F2',
        backgroundColor: Colors.white,
        justifyContent: 'space-between',
    },
    cancelButton: {
        flex: 1,
        height: verticalScale(45),
        borderRadius: Theme.borderRadius.lg,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
        marginRight: Theme.spacing.md,
        backgroundColor: Colors.white,
        ...Theme.shadow.sm,
    },
    cancelButtonText: {
        color: Colors.text,
        fontSize: Theme.fontSize.sm,
        fontFamily: Theme.fontFamily.semiBold,
    },
    postButton: {
        height: verticalScale(45),
        borderRadius: Theme.borderRadius.lg,
        backgroundColor: Colors.buttonColor,
        paddingHorizontal: Theme.spacing.lg,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
        ...Theme.shadow.sm,
    },
    postButtonText: {
        fontSize: Theme.fontSize.sm,
        fontFamily: Theme.fontFamily.semiBold,
    },
});

export default CreatePost;