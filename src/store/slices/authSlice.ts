import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { getRequest, postRequest } from '../../services/api/apiMethods';
import { URLS } from '../../services/api/urls';

interface AuthState {
    token: string | null;
    isAuthenticated: boolean;
    user: any | null;
    loading: boolean;
    error: string | null;
    avatars: any[];
}

const initialState: AuthState = {
    token: null,
    isAuthenticated: false,
    user: null,
    loading: false,
    error: null,
    avatars: [],
};

// Async Thunks
export const login = createAsyncThunk<any, any>(
    'auth/login',
    async (credentials: any, { rejectWithValue }) => {
        try {
            console.log('--- Login Thunk Request ---', credentials);
            const response = await postRequest<any>(URLS.AUTH.LOGIN, credentials);
            console.log('--- Login Thunk Success ---', response);
            return response;
        } catch (error: any) {
            console.log('--- Login Thunk Error ---', error.response?.data || error.message);
            return rejectWithValue(error.response?.data?.message || error.message || 'Login failed');
        }
    }
);

export const sendSignupOtp = createAsyncThunk<any, string>(
    'auth/sendSignupOtp',
    async (email: string, { rejectWithValue }) => {
        try {
            console.log('--- Send OTP Thunk Request ---', email);
            const response = await postRequest<any>(URLS.AUTH.SIGNUP, { email });
            console.log('--- Send OTP Thunk Success ---', response);
            return response;
        } catch (error: any) {
            console.log('--- Send OTP Thunk Error ---', error.response?.data || error.message);
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to send OTP');
        }
    }
);

export const verifySignupOtp = createAsyncThunk<any, { email: string; otp: string }>(
    'auth/verifySignupOtp',
    async (data: { email: string; otp: string }, { rejectWithValue }) => {
        try {
            console.log('--- Verify OTP Thunk Request ---', data);
            const response = await postRequest<any>(URLS.AUTH.VERIFY_OTP, data);
            console.log('--- Verify OTP Thunk Success ---', response);
            return response;
        } catch (error: any) {
            console.log('--- Verify OTP Thunk Error ---', error.response?.data || error.message);
            return rejectWithValue(error.response?.data?.message || error.message || 'Verification failed');
        }
    }
);

export const registerUser = createAsyncThunk<any, any>(
    'auth/registerUser',
    async (userData: any, { rejectWithValue }) => {
        try {
            console.log('--- Register Thunk Request ---', userData);
            const response = await postRequest<any>(URLS.AUTH.COMPLETE_SIGNUP, userData);
            console.log('--- Register Thunk Success ---', response);
            return response;
        } catch (error: any) {
            console.log('--- Register Thunk Error ---', error.response?.data || error.message);
            return rejectWithValue(error.response?.data?.message || error.message || 'Registration failed');
        }
    }
);

export const getAvatars = createAsyncThunk<any, void>(
    'auth/getAvatars',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getRequest<any>(URLS.AUTH.GET_AVATARS);
            // getRequest returns response.data already.
            return response.data || response;
        } catch (error: any) {
            console.log('--- Avatars Thunk Error ---', error.response?.data || error.message);
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch avatars');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (
            state,
            action: PayloadAction<{ user: any; token: string }>
        ) => {
            const { user, token } = action.payload;
            state.user = user;
            state.token = token;
            state.isAuthenticated = true;
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
        },
        updateUser: (state, action: PayloadAction<any>) => {
            state.user = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                const data = action.payload.data || action.payload;
                console.log('--- Login Reducer Data ---', data);
                if (data.token) {
                    state.token = data.token;
                    state.user = data.user || action.payload.user || action.meta.arg;
                    state.isAuthenticated = true;
                    console.log('--- Auth State Updated: isAuthenticated = true ---');
                } else {
                    console.log('--- Auth State NOT Updated: No token found ---');
                }
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Signup (Only loading/error)
            .addCase(sendSignupOtp.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(sendSignupOtp.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(sendSignupOtp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Verify
            .addCase(verifySignupOtp.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verifySignupOtp.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(verifySignupOtp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Register
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                const data = action.payload.data || action.payload;
                if (data.token) {
                    state.token = data.token;
                    state.user = data.user || action.payload.user || action.meta.arg;
                    state.isAuthenticated = true;
                }
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Get Avatars
            .addCase(getAvatars.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAvatars.fulfilled, (state, action) => {
                state.loading = false;
                state.avatars = action.payload;
            })
            .addCase(getAvatars.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { setCredentials, logout, updateUser, clearError } = authSlice.actions;
export default authSlice.reducer;
