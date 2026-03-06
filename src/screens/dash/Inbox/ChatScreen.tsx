import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TextInput,
    TouchableOpacity,
    StatusBar,
    Platform,
    Keyboard,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

import { Colors } from '../../../constants/colors';
import { Theme } from '../../../constants/theme';
import { ICONS } from '../../../constants/icons';
import type { ChatDetailScreenProps } from '../../../navigation/types';

interface Message {
    id: string;
    text: string;
    time: string;
    sender: 'me' | 'other';
}

import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { getMessages, clearMessages, addReceivedMessage, deleteMessage, deleteMessageFromState, clearChat } from '../../../store/slices/chatSlice';
import socketService from '../../../services/socketService';
import { ActivityIndicator, Modal, Pressable, Alert } from 'react-native';

const ChatScreen: React.FC<ChatDetailScreenProps> = ({ navigation, route }) => {
    const insets = useSafeAreaInsets();
    const dispatch = useAppDispatch();
    const { name, avatar, roomId, receiverId } = route.params;
    const { currentMessages, loading } = useAppSelector(state => state.chat);
    const { user } = useAppSelector(state => state.auth);

    const [messageText, setMessageText] = useState('');
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Initial fetch and Socket Join
    useEffect(() => {
        if (roomId && user?._id) {
            dispatch(getMessages(roomId));
            console.log('--- Joining Chatroom via Socket ---', { roomId, userId: user._id });
            socketService.emit('joinRoom', { roomId, userId: user._id });
        }
        return () => {
            dispatch(clearMessages());
        };
    }, [dispatch, roomId, user?._id]);

    // Socket listeners for real-time messages
    useEffect(() => {
        const onNewMessage = (response: any) => {
            const msgData = response.data || response;
            const incomingRoomId = msgData?.roomId?.toString().trim();
            const currentRoomId = roomId?.toString().trim();

            if (incomingRoomId === currentRoomId) {
                dispatch(addReceivedMessage(msgData));
            }
        };

        socketService.on('newMessage', onNewMessage);
        return () => {
            socketService.off('newMessage', onNewMessage);
        };
    }, [roomId, dispatch]);

    const flatListRef = useRef<FlatList<any>>(null);
    const inputRef = useRef<TextInput>(null);

    // Handle keyboard show/hide for Android
    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
            (e: any) => setKeyboardHeight(e.endCoordinates.height)
        );

        const keyboardDidHideListener = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
            () => setKeyboardHeight(0)
        );

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    // Scroll to bottom when new messages come
    useEffect(() => {
        if (currentMessages?.length > 0) {
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 200);
        }
    }, [currentMessages]);

    const handleSend = () => {
        if (!messageText.trim()) return;

        if (!roomId || !user?._id || !receiverId) {
            return;
        }

        const tempId = Date.now().toString();
        const optimisticMessage = {
            _id: tempId,
            roomId: roomId,
            sender: user._id, // Ensure it's user._id so it shows on right side
            receiver: receiverId,
            message: messageText.trim(),
            createdAt: new Date().toISOString(),
            isTemp: true
        };

        dispatch(addReceivedMessage(optimisticMessage));

        const payload = {
            roomId: roomId,
            sender: user._id,
            receiver: receiverId,
            message: messageText.trim()
        };

        socketService.emit('sendMessage', payload);
        setMessageText('');
        if (Platform.OS === 'ios') {
            inputRef.current?.focus();
        }
    };

    const handleDeleteMessage = (id: string) => {
        dispatch(deleteMessage(id));
        setSelectedMessageId(null);
    };

    const handleClearChat = () => {
        if (roomId) {
            dispatch(clearChat(roomId));
            setIsMenuOpen(false);
        }
    };

    const renderMessage = ({ item }: { item: any }) => {
        // Robust check for sender - could be a string ID or a populated object
        const senderId = typeof item.sender === 'object' ? item.sender?._id : item.sender;
        const isMe = senderId?.toString() === user?._id?.toString();
        const dateStr = item.createdAt || new Date().toISOString();
        const time = new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const isSelected = selectedMessageId === item._id;

        return (
            <TouchableOpacity
                activeOpacity={1}
                onLongPress={() => isMe && setSelectedMessageId(item._id)}
                onPress={() => setSelectedMessageId(null)}
                style={[styles.messageRow, isMe ? styles.myRow : styles.otherRow]}
                key={item._id}
            >
                <View style={[styles.bubbleWrapper, isMe && styles.myBubbleWrapper]}>
                    <View style={[styles.bubble, isMe ? styles.myBubble : styles.otherBubble]}>
                        <Text style={[styles.msgText, isMe ? styles.myMsgText : styles.otherMsgText]}>
                            {item.message || item.text || ''}
                        </Text>
                        <Text style={[styles.timeText, isMe ? styles.myTimeText : styles.otherTimeText]}>
                            {time}
                        </Text>
                    </View>
                    {isSelected && isMe && (
                        <TouchableOpacity
                            style={styles.deleteBtn}
                            onPress={() => handleDeleteMessage(item._id)}
                        >
                            <View style={styles.trashContainer}>
                                <View style={styles.trashHandle} />
                                <View style={styles.trashLid} />
                                <View style={styles.trashBody}>
                                    <View style={styles.trashLinesContainer}>
                                        <View style={styles.trashLine} />
                                        <View style={styles.trashLine} />
                                        <View style={styles.trashLine} />
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.mainWrapper}>
            <View style={{ height: insets.top, backgroundColor: Colors.white }} />
            <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Image source={ICONS.backicon} style={styles.backIcon} resizeMode="contain" />
                </TouchableOpacity>
                <View style={styles.userInfo}>
                    <Image source={typeof avatar === 'string' ? { uri: avatar } : avatar} style={styles.avatar} />
                    <View style={styles.userTextInfo}>
                        <Text style={styles.username}>{name}</Text>
                    </View>
                </View>
                <TouchableOpacity onPress={() => setIsMenuOpen(true)} style={styles.menuBtn}>
                    <View style={styles.threeDotsContainer}>
                        <View style={styles.dot} />
                        <View style={styles.dot} />
                        <View style={styles.dot} />
                    </View>
                </TouchableOpacity>
            </View>

            <View style={styles.flex1}>
                <View style={styles.chatSection}>
                    {loading && currentMessages.length === 0 ? (
                        <View style={styles.loaderContainer}>
                            <ActivityIndicator size="large" color={Colors.primary} />
                        </View>
                    ) : (
                        <FlatList<any>
                            ref={flatListRef}
                            data={currentMessages}
                            extraData={[currentMessages, selectedMessageId]}
                            renderItem={renderMessage}
                            keyExtractor={item => item._id}
                            contentContainerStyle={styles.listContent}
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="handled"
                            onContentSizeChange={() => !selectedMessageId && flatListRef.current?.scrollToEnd({ animated: true })}
                        />
                    )}

                    <View style={[styles.inputWrapper, { paddingBottom: insets.bottom || verticalScale(8), marginBottom: keyboardHeight }]}>
                        <View style={styles.inputContainer}>
                            <TextInput
                                ref={inputRef}
                                style={[styles.input, { maxHeight: verticalScale(100) }]}
                                placeholder="Type a message"
                                placeholderTextColor={Colors.textSecondary}
                                value={messageText}
                                onChangeText={setMessageText}
                                multiline
                                onSubmitEditing={handleSend}
                                blurOnSubmit={false}
                            />
                            <TouchableOpacity
                                onPress={handleSend}
                                disabled={!messageText.trim()}
                                style={[styles.sendBtn, !messageText.trim() && styles.sendBtnDisabled]}
                            >
                                <Image source={ICONS.send} resizeMode='contain' style={styles.sendIcon} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>

            {/* Clear Chat Modal */}
            <Modal
                transparent
                visible={isMenuOpen}
                animationType="fade"
                onRequestClose={() => setIsMenuOpen(false)}
            >
                <Pressable style={styles.modalOverlay} onPress={() => setIsMenuOpen(false)}>
                    <View style={styles.bottomSheet}>
                        <TouchableOpacity style={styles.sheetItem} onPress={handleClearChat}>
                            <Text style={[styles.sheetText, { color: 'red' }]}>Clear Chat</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.sheetItem} onPress={() => setIsMenuOpen(false)}>
                            <Text style={styles.sheetText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    mainWrapper: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    flex1: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Theme.spacing.md,
        paddingVertical: Theme.spacing.sm,
        backgroundColor: Colors.white,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    backBtn: {
        padding: Theme.spacing.xs,
    },
    backIcon: {
        width: moderateScale(24),
        height: moderateScale(24),
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: Theme.spacing.sm,
        flex: 1,
    },
    avatar: {
        width: moderateScale(40),
        height: moderateScale(40),
        borderRadius: moderateScale(20),
        backgroundColor: '#f0f0f0',
    },
    userTextInfo: {
        marginLeft: Theme.spacing.sm,
        justifyContent: 'center',
    },
    username: {
        fontSize: moderateScale(16),
        fontFamily: Theme.fontFamily.bold,
        color: Colors.black,
        lineHeight: moderateScale(20),
    },
    menuBtn: {
        padding: Theme.spacing.xs,
    },
    threeDotsContainer: {
        width: moderateScale(24),
        height: moderateScale(24),
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: moderateScale(2),
    },
    dot: {
        width: moderateScale(3.5),
        height: moderateScale(3.5),
        borderRadius: moderateScale(2),
        backgroundColor: Colors.black,
    },
    chatSection: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        padding: Theme.spacing.md,
        paddingBottom: Theme.spacing.lg,
    },
    messageRow: {
        marginBottom: Theme.spacing.md,
        width: '100%',
    },
    myRow: {
        alignItems: 'flex-end',
    },
    otherRow: {
        alignItems: 'flex-start',
    },
    bubbleWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        maxWidth: '85%',
    },
    myBubbleWrapper: {
        flexDirection: 'row-reverse',
    },
    bubble: {
        paddingHorizontal: Theme.spacing.md,
        paddingTop: Theme.spacing.md,
        borderRadius: Theme.borderRadius.xl,
    },
    myBubble: {
        backgroundColor: Colors.skyBlue,
        borderBottomRightRadius: moderateScale(2),
    },
    otherBubble: {
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.border,
        borderBottomLeftRadius: moderateScale(2),
    },
    msgText: {
        fontSize: Theme.fontSize.xs + scale(1),
        fontFamily: Theme.fontFamily.medium,
        lineHeight: moderateScale(20),
    },
    myMsgText: {
        color: Colors.black,
    },
    otherMsgText: {
        color: Colors.text,
    },
    timeText: {
        fontSize: moderateScale(10),
        fontFamily: Theme.fontFamily.regular,
        color: Colors.textSecondary,
        marginVertical: verticalScale(4),
        marginHorizontal: moderateScale(4),
    },
    myTimeText: {
        textAlign: 'right',
    },
    otherTimeText: {
        textAlign: 'left',
    },
    deleteBtn: {
        width: moderateScale(32),
        height: moderateScale(32),
        borderRadius: moderateScale(16),
        backgroundColor: Colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: moderateScale(8),
        borderWidth: 1,
        borderColor: Colors.border,
        ...Theme.shadow.sm,
        elevation: 3,
    },
    trashContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    trashHandle: {
        width: moderateScale(5),
        height: moderateScale(2),
        borderTopWidth: 1.5,
        borderLeftWidth: 1.5,
        borderRightWidth: 1.5,
        borderColor: Colors.black,
        borderTopLeftRadius: 1,
        borderTopRightRadius: 1,
        marginBottom: -1,
    },
    trashLid: {
        width: moderateScale(14),
        height: moderateScale(2),
        backgroundColor: Colors.black,
        borderRadius: 1,
        marginBottom: 1,
    },
    trashBody: {
        width: moderateScale(12),
        height: moderateScale(13),
        borderWidth: 1.5,
        borderColor: Colors.black,
        borderBottomLeftRadius: 2,
        borderBottomRightRadius: 2,
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
    },
    trashLinesContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-evenly',
        paddingHorizontal: 1,
    },
    trashLine: {
        width: 1,
        height: moderateScale(7),
        backgroundColor: Colors.black,
        borderRadius: 0.5,
    },
    inputWrapper: {
        backgroundColor: Colors.white,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: Theme.spacing.md,
        marginVertical: verticalScale(5),
        paddingHorizontal: Theme.spacing.md,
        minHeight: verticalScale(43),
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: scale(20),
    },
    input: {
        flex: 1,
        paddingVertical: verticalScale(8),
        fontSize: Theme.fontSize.sm,
        color: Colors.text,
        fontFamily: Theme.fontFamily.medium,
    },
    sendBtn: {
        width: moderateScale(36),
        height: moderateScale(36),
        borderRadius: moderateScale(18),
        backgroundColor: Colors.skyBlue,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: Theme.spacing.xs,
    },
    sendBtnDisabled: {
        backgroundColor: Colors.lightGray,
    },
    sendIcon: {
        width: moderateScale(18),
        height: moderateScale(18),
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    bottomSheet: {
        backgroundColor: Colors.white,
        borderTopLeftRadius: moderateScale(20),
        borderTopRightRadius: moderateScale(20),
        paddingVertical: Theme.spacing.lg,

    },
    sheetItem: {
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
        paddingVertical: moderateScale(12),
        borderRadius: moderateScale(30),
        marginHorizontal: Theme.spacing.md,
        marginVertical: Theme.spacing.xs,
    },
    sheetText: {
        fontSize: moderateScale(16),
        fontFamily: Theme.fontFamily.semiBold,
        color: Colors.black,
    },
});

export default ChatScreen;