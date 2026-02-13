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
import Geolocation from '@react-native-community/geolocation';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { createPost, getPosts } from '../../../store/slices/postSlice';
import Toast from 'react-native-toast-message';

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
    onPostSubmit?: (data: any) => void;
};

const CreatePost = forwardRef<CreatePostBottomSheetRef, Props>(
    ({ onPostSubmit }, ref) => {
        const insets = useSafeAreaInsets();
        const dispatch = useAppDispatch();
        const { user } = useAppSelector(state => state.auth);
        const { loading: postLoading } = useAppSelector(state => state.post);
        console.log('user information ==>', user)
        const [postText, setPostText] = useState('');
        const [selectedType, setSelectedType] = useState<PostType>('Discussion');
        const [selectedImages, setSelectedImages] = useState<string[]>([]);
        const [eventDate, setEventDate] = useState<Date | null>(null);
        const [isDatePickerOpen, setDatePickerOpen] = useState(false);
        const [location, setLocation] = useState<any>(null);
        const [isLocationLoading, setIsLocationLoading] = useState(false);

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

        const getCurrentLocation = () => {
            setIsLocationLoading(true);
            Geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;

                    try {
                        // Reverse Geocoding using OpenStreetMap (Nominatim)
                        // Note: In production, use a dedicated service like Google Maps or Mapbox
                        const response = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
                            {
                                headers: {
                                    'User-Agent': 'TangleApp'
                                }
                            }
                        );
                        const data = await response.json();
                        const address = data.display_name || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;

                        setLocation({
                            latitude,
                            longitude,
                            address: address
                        });
                    } catch (error) {
                        console.log('Geocoding Error:', error);
                        setLocation({
                            latitude,
                            longitude,
                            address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
                        });
                    } finally {
                        setIsLocationLoading(false);
                    }
                },
                (error) => {
                    setIsLocationLoading(false);
                    console.log('Location Error:', error);
                    Toast.show({
                        type: 'error',
                        text1: 'Location Error',
                        text2: 'Could not get your current location',
                    });
                },
                { enableHighAccuracy: false, timeout: 20000, maximumAge: 10000 }
            );
        };
        const handlePost = async () => {
            if (!user?._id && !user?.id) {
                Toast.show({ type: 'error', text1: 'User not logged in' });
                return;
            }

            if (!postText.trim()) {
                Toast.show({ type: 'error', text1: 'Please Add Description' });
                return;
            }

            if (selectedImages.length === 0) {
                Toast.show({ type: 'error', text1: 'Please add at least one image' });
                return;
            }

            const formData = new FormData();

            // desc
            formData.append('desc', postText.trim());

            // post_type
            formData.append('post_type', selectedType.toLowerCase());

            // user_id
            formData.append('user_id', user?._id || user?.id);

            // location
            formData.append('location', location?.address || 'mohali');

            // tags
            formData.append('tags', 'party,music,night');

            // event_date
            if (eventDate) {
                formData.append('event_date', eventDate.toISOString());
            }

            // images (CRITICAL)
            selectedImages.forEach((uri, index) => {
                formData.append('images', {
                    uri: Platform.OS === 'ios' ? uri.replace('file://', '') : uri,
                    name: `post_${index}.jpg`,
                    type: 'image/jpeg',
                } as any);
            });

            try {
                const resultAction = await dispatch(createPost(formData));

                if (createPost.fulfilled.match(resultAction)) {
                    Toast.show({ type: 'success', text1: 'Post created!' });
                    dispatch(getPosts()); // Refresh the feed
                    resetForm();
                    sheetRef.current?.close();
                    onPostSubmit?.(resultAction.payload);
                } else {
                    Toast.show({
                        type: 'error',
                        text1: 'Error',
                        text2: resultAction.payload as string,
                    });
                }
            } catch (e) {
                console.log('POST ERROR:', e);
            }
        };


        const resetForm = () => {
            setPostText('');
            setSelectedType('Discussion');
            setSelectedImages([]);
            setEventDate(null);
            setLocation(null);
        };

        const handlePhotoPress = async () => {
            if (selectedImages.length >= 4) {
                Toast.show({
                    type: 'error',
                    text1: 'Limit Reached',
                    text2: 'You can only upload up to 4 images.',
                });
                return;
            }

            Alert.alert(
                'Add Photo',
                'Choose an option',
                [
                    {
                        text: 'Take Photo',
                        onPress: async () => {
                            const path = await ImagePickerService.openCamera();
                            if (path) setSelectedImages([...selectedImages, path]);
                        },
                    },
                    {
                        text: 'Choose from Gallery',
                        onPress: async () => {
                            const path = await ImagePickerService.openGallery();
                            if (path) setSelectedImages([...selectedImages, path]);
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
                                onLocationPress={getCurrentLocation}
                                onTagPeoplePress={() => Alert.alert('Tag People', 'Feature coming soon!')}
                                onEventDatePress={() => setDatePickerOpen(true)}
                            />

                            <ImagePreview
                                imageUris={selectedImages}
                                onRemoveImage={(index) => {
                                    const newImages = [...selectedImages];
                                    newImages.splice(index, 1);
                                    setSelectedImages(newImages);
                                }}
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

                            {isLocationLoading && (
                                <View style={styles.dateBadge}>
                                    <Text style={styles.dateBadgeText}>📍 Fetching location...</Text>
                                </View>
                            )}

                            {location && !isLocationLoading && (
                                <View style={styles.locationContainer}>
                                    <View style={styles.locationHeader}>
                                        <Text style={styles.locationLabel}>📍 Current Location</Text>
                                        <TouchableOpacity onPress={() => setLocation(null)}>
                                            <Text style={styles.removeDate}>✕</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <TextInput
                                        style={styles.locationInput}
                                        value={location.address}
                                        onChangeText={(text) => setLocation({ ...location, address: text })}
                                        multiline
                                    />
                                </View>
                            )}
                        </BottomSheetScrollView>

                        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, Theme.spacing.lg) }]}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={handleClose}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.postButton,
                                    { opacity: (postText.trim() && selectedImages.length > 0) ? 1 : 0.6 }
                                ]}
                                onPress={handlePost}
                                disabled={!(postText.trim() && selectedImages.length > 0)}
                            >
                                <Text style={[
                                    styles.postButtonText,
                                    { color: (postText.trim() || selectedImages.length > 0) ? Colors.text : Colors.textTertiary }
                                ]}>{postLoading ? 'Posting...' : 'Post Community'}</Text>
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
        minHeight: verticalScale(120),
        marginTop: Theme.spacing.md,
        backgroundColor: Colors.white,
        ...Theme.shadow.sm,
    },
    textInput: {
        fontSize: Theme.fontSize.sm,
        fontFamily: Theme.fontFamily.regular,
        color: Colors.text,
        textAlignVertical: 'top',
        maxHeight: verticalScale(120),
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
    locationContainer: {
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: Theme.borderRadius.lg,
        padding: Theme.spacing.md,
        marginTop: Theme.spacing.md,
        ...Theme.shadow.sm,
    },
    locationHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Theme.spacing.xs,
    },
    locationLabel: {
        fontSize: Theme.fontSize.xs,
        fontFamily: Theme.fontFamily.semiBold,
        color: Colors.textSecondary,
    },
    locationInput: {
        fontSize: Theme.fontSize.sm,
        fontFamily: Theme.fontFamily.medium,
        color: Colors.text,
        padding: 0,
    },
    footer: {
        flexDirection: 'row',
        paddingHorizontal: Theme.spacing.lg,
        paddingVertical: Theme.spacing.sm,
        borderTopWidth: 1,
        borderTopColor: '#F2F2F2',
        backgroundColor: Colors.white,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cancelButton: {
        flex: 1,
        height: moderateScale(45),
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
        flex: 1.5,
        height: moderateScale(45),
        borderRadius: Theme.borderRadius.lg,
        backgroundColor: Colors.buttonColor,
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
    tagsWrapper: {
        marginTop: Theme.spacing.md,
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: Theme.borderRadius.lg,
        padding: Theme.spacing.md,
        ...Theme.shadow.sm,
    },
    tagsLabel: {
        fontSize: Theme.fontSize.xs,
        fontFamily: Theme.fontFamily.semiBold,
        color: Colors.textSecondary,
        marginBottom: Theme.spacing.xs,
    },
    tagsInput: {
        fontSize: Theme.fontSize.sm,
        fontFamily: Theme.fontFamily.medium,
        color: Colors.text,
        padding: 0,
    },
});

export default CreatePost;