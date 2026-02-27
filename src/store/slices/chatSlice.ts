import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { postRequest, getRequest, deleteRequest } from '../../services/api/apiMethods';
import { URLS } from '../../services/api/urls';

interface ChatState {
    chatrooms: any[];
    currentMessages: any[];
    loading: boolean;
    error: string | null;
}

const initialState: ChatState = {
    chatrooms: [],
    currentMessages: [],
    loading: false,
    error: null,
};

export const createChatroom = createAsyncThunk<any, string>(
    'chat/createChatroom',
    async (targetUserId: string, { rejectWithValue }) => {
        try {
            console.log('--- Create Chatroom Thunk Request ---', targetUserId);
            const response = await postRequest<any>(URLS.CHAT.CREATE_CHATROOM, {
                user_id: targetUserId
            });
            console.log('--- Create Chatroom Thunk Success ---', response);
            return response;
        } catch (error: any) {
            console.log('--- Create Chatroom Thunk Error ---', error.response?.data || error.message);
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to create chatroom');
        }
    }
);

export const getChatList = createAsyncThunk<any, void>(
    'chat/getChatList',
    async (_, { rejectWithValue }) => {
        try {
            console.log('--- Get Chat List Thunk Request ---');
            const response = await getRequest<any>(URLS.CHAT.GET_CHATLIST);
            console.log('--- Get Chat List Thunk Success ---', response);
            return response.data; // The array is in .data
        } catch (error: any) {
            console.log('--- Get Chat List Thunk Error ---', error.response?.data || error.message);
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch chat list');
        }
    }
);

export const getMessages = createAsyncThunk<any, string>(
    'chat/getMessages',
    async (roomId: string, { rejectWithValue }) => {
        try {
            console.log('--- Get Messages Thunk Request ---', roomId);
            const response = await getRequest<any>(`${URLS.CHAT.GET_MESSAGES}?roomId=${roomId}`);
            console.log('--- Get Messages Thunk Success ---', response);
            return response.data; // Adjusted to match API structure
        } catch (error: any) {
            console.log('--- Get Messages Thunk Error ---', error.response?.data || error.message);
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch messages');
        }
    }
);

export const deleteMessage = createAsyncThunk<any, string>(
    'chat/deleteMessage',
    async (messageId: string, { rejectWithValue }) => {
        try {
            console.log('--- Delete Message Thunk Request ---', messageId);
            const response = await deleteRequest<any>(`${URLS.CHAT.DELETE_MESSAGE}?messageId=${messageId}`);
            console.log('--- Delete Message Thunk Success ---', response);
            return { messageId, response };
        } catch (error: any) {
            console.log('--- Delete Message Thunk Error ---', error.response?.data || error.message);
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to delete message');
        }
    }
);

export const clearChat = createAsyncThunk<any, string>(
    'chat/clearChat',
    async (roomId: string, { rejectWithValue }) => {
        try {
            console.log('--- Clear Chat Thunk Request ---', roomId);
            const response = await deleteRequest<any>(URLS.CHAT.CLEAR_CHAT, {
                data: { room_id: roomId }
            });
            console.log('--- Clear Chat Thunk Success ---', response);
            return response;
        } catch (error: any) {
            console.log('--- Clear Chat Thunk Error ---', error.response?.data || error.message);
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to clear chat');
        }
    }
);

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        clearChatError: (state) => {
            state.error = null;
        },
        clearMessages: (state) => {
            state.currentMessages = [];
        },
        addReceivedMessage: (state, action) => {
            const newMessage = action.payload;

            // 1. Check if this exact message already exists (by real _id)
            const exists = state.currentMessages.find(msg => msg._id === newMessage._id);
            if (exists) return;

            // 2. If it's a real message from socket, check if it's a match for an optimistic/temp message
            if (!newMessage.isTemp) {
                // Find a temporary message with same content and sender from last 30 seconds
                // Use toString() to ensure safe comparison
                const tempIndex = state.currentMessages.findIndex(msg => {
                    const msgSenderId = typeof msg.sender === 'object' ? msg.sender?._id : msg.sender;
                    const newSenderId = typeof newMessage.sender === 'object' ? newMessage.sender?._id : newMessage.sender;
                    return msg.isTemp &&
                        msg.message === newMessage.message &&
                        msgSenderId?.toString() === newSenderId?.toString();
                });

                if (tempIndex !== -1) {
                    // Replace temp message with the official one from server
                    state.currentMessages[tempIndex] = newMessage;
                    return;
                }
            }

            // 3. Otherwise, append to list
            state.currentMessages = [...state.currentMessages, newMessage];
        },
        deleteMessageFromState: (state, action) => {
            state.currentMessages = state.currentMessages.filter(msg => msg._id !== action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createChatroom.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createChatroom.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(createChatroom.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(getChatList.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getChatList.fulfilled, (state, action) => {
                state.loading = false;
                state.chatrooms = action.payload;
            })
            .addCase(getChatList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(getMessages.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getMessages.fulfilled, (state, action) => {
                state.loading = false;
                state.currentMessages = action.payload;
            })
            .addCase(getMessages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(deleteMessage.fulfilled, (state, action) => {
                state.currentMessages = state.currentMessages.filter(msg => msg._id !== action.payload.messageId);
            })
            .addCase(clearChat.fulfilled, (state) => {
                state.currentMessages = [];
            });
    },
});

export const { clearChatError, clearMessages, addReceivedMessage, deleteMessageFromState } = chatSlice.actions;
export default chatSlice.reducer;
