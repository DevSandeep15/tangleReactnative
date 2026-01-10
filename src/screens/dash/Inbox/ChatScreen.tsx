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

const ChatScreen: React.FC<ChatDetailScreenProps> = ({ navigation, route }) => {
    const insets = useSafeAreaInsets();
    const { name, avatar } = route.params;

    const [message, setMessage] = useState('');
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', text: 'from the community event', time: '10:32 AM', sender: 'me' },
        { id: '2', text: 'Oh nice! How was it?', time: '10:33 AM', sender: 'other' },
        { id: '3', text: 'It was amazing! Met so many neighbors. We should definitely organize more events like this 🎉', time: '10:35 AM', sender: 'me' },
        { id: '4', text: 'Absolutely! I was thinking about organizing a badminton tournament next month', time: '10:36 AM', sender: 'other' },
        { id: '5', text: 'That sounds perfect! Count me in 🏸', time: '10:37 AM', sender: 'me' },
        { id: '6', text: 'Great! Also, do you have the contact for that plumber you mentioned?', time: '10:38 AM', sender: 'other' },
        { id: '7', text: "Yes! Let me share it with you. His name is Vijay and he's excellent", time: '10:40 AM', sender: 'me' },
    ]);

    const flatListRef = useRef<FlatList<Message>>(null);
    const inputRef = useRef<TextInput>(null);

    // Handle keyboard show/hide for Android
    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
            (e: any) => {
                setKeyboardHeight(e.endCoordinates.height);
            }
        );

        const keyboardDidHideListener = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
            () => {
                setKeyboardHeight(0);
            }
        );

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    // Scroll to bottom when new message is added
    useEffect(() => {
        if (messages.length > 0) {
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);
        }
    }, [messages]);

    const handleSend = () => {
        if (!message.trim()) return;

        const newMsg: Message = {
            id: Date.now().toString(),
            text: message.trim(),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            sender: 'me',
        };

        setMessages(prev => [...prev, newMsg]);
        setMessage('');

        // Keep keyboard open after sending
        inputRef.current?.focus();
    };

    const renderMessage = ({ item }: { item: Message }) => {
        const isMe = item.sender === 'me';
        return (
            <View style={[styles.messageRow, isMe ? styles.myRow : styles.otherRow]}>
                <View style={[styles.bubble, isMe ? styles.myBubble : styles.otherBubble]}>
                    <Text style={[styles.msgText, isMe ? styles.myMsgText : styles.otherMsgText]}>
                        {item.text}
                    </Text>
                    <Text style={[styles.timeText, isMe ? styles.myTimeText : styles.otherTimeText]}>
                        {item.time}
                    </Text>
                </View>

            </View>
        );
    };

    return (
        <View style={styles.mainWrapper}>
            <View style={{ height: insets.top, backgroundColor: Colors.white }} />
            <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backBtn}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Image source={ICONS.backicon} style={styles.backIcon} resizeMode="contain" />
                </TouchableOpacity>
                <View style={styles.userInfo}>
                    <Image
                        source={typeof avatar === 'string' ? { uri: avatar } : avatar}
                        style={styles.avatar}
                    />
                    <View style={styles.userTextInfo}>
                        <Text style={styles.username}>{name}</Text>
                        <Text style={styles.onlineStatus}>online</Text>
                    </View>
                </View>
            </View>

            <View style={styles.flex1}>
                <View style={styles.chatSection}>
                    <FlatList<Message>
                        ref={flatListRef}
                        data={messages}
                        renderItem={renderMessage}
                        keyExtractor={item => item.id}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                    />

                    <View style={[
                        styles.inputWrapper,
                        {
                            paddingBottom: insets.bottom || verticalScale(8),
                            marginBottom: keyboardHeight
                        }
                    ]}>
                        <View style={styles.inputContainer}>
                            <TextInput
                                ref={inputRef}
                                style={styles.input}
                                placeholder="Type a message"
                                placeholderTextColor={Colors.textSecondary}
                                value={message}
                                onChangeText={setMessage}
                                multiline
                                maxHeight={verticalScale(100)}
                                onSubmitEditing={handleSend}
                                blurOnSubmit={false}
                            />
                            <TouchableOpacity
                                onPress={handleSend}
                                disabled={!message.trim()}
                                style={[styles.sendBtn, !message.trim() && styles.sendBtnDisabled]}
                                activeOpacity={0.7}
                            >
                                <Image source={ICONS.send} resizeMode='contain' style={styles.sendIcon} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
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
    onlineStatus: {
        fontSize: moderateScale(12),
        fontFamily: Theme.fontFamily.regular,
        color: '#4CAF50',
        lineHeight: moderateScale(16),
    },
    chatSection: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    listContent: {
        padding: Theme.spacing.md,
        paddingBottom: Theme.spacing.lg,
    },
    messageRow: {
        marginBottom: Theme.spacing.md,
        maxWidth: '80%',
    },
    myRow: {
        alignSelf: 'flex-end',
    },
    otherRow: {
        alignSelf: 'flex-start',
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
});

export default ChatScreen;