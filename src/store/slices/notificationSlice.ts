import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { URLS } from '../../services/api/urls';
import axiosInstance from '../../services/api/axiosInstance';

interface NotificationState {
    notifications: any[];
    loading: boolean;
    error: string | null;
}

const initialState: NotificationState = {
    notifications: [],
    loading: false,
    error: null,
};

export const getNotifications = createAsyncThunk(
    'notification/getNotifications',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(URLS.NOTIFICATION.GET_NOTIFICATIONS);
            console.log('--- Get Notifications Response ---', response.data);
            return response.data.data; 
        } catch (error: any) {
            console.error('--- Get Notifications Error ---', error.response?.data || error.message);
            return rejectWithValue(error.response?.data?.message || 'Network request failed');
        }
    }
);

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        resetNotificationStatus: (state) => {
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getNotifications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getNotifications.fulfilled, (state, action) => {
                state.loading = false;
                state.notifications = action.payload || [];
                state.error = null;
            })
            .addCase(getNotifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { resetNotificationStatus } = notificationSlice.actions;
export default notificationSlice.reducer;
