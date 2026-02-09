import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Platform } from 'react-native';
import { postRequest } from '../../services/api/apiMethods';
import { URLS } from '../../services/api/urls';
import axiosInstance from '../../services/api/axiosInstance';

interface PostState {
    posts: any[];
    loading: boolean;
    error: string | null;
    success: boolean;
}

const initialState: PostState = {
    posts: [],
    loading: false,
    error: null,
    success: false,
};

export interface CreatePostData {
    image: string[];
    post_type: string;
    desc: string;
    location: {
        latitude: number;
        longitude: number;
        address?: string;
    } | string;
    tags: string[];
    event_date: string;
    user_id: string;
}

export const getPosts = createAsyncThunk(
    'post/getPosts',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(URLS.POST.GET_POSTS);
            console.log('--- Get Posts Response ---', response.data);
            return response.data.data; // The array is in result.data
        } catch (error: any) {
            console.error('--- Get Posts Error ---', error.response?.data || error.message);
            return rejectWithValue(error.response?.data?.message || 'Network request failed');
        }
    }
);

export const toggleLike = createAsyncThunk(
    'post/toggleLike',
    async (postId: string, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(URLS.POST.LIKE_POST, { post_id: postId });
            console.log('--- Toggle Like Response ---', response.data);
            return { postId, ...response.data };
        } catch (error: any) {
            console.error('--- Toggle Like Error ---', error.response?.data || error.message);
            return rejectWithValue(error.response?.data?.message || 'Network request failed');
        }
    }
);

export const addComment = createAsyncThunk(
    'post/addComment',
    async ({ postId, comment }: { postId: string, comment: string }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(URLS.POST.ADD_COMMENT, {
                post_id: postId,
                comment: comment
            });
            console.log('--- Add Comment Response ---', response.data);
            return { postId, ...response.data };
        } catch (error: any) {
            console.error('--- Add Comment Error ---', error.response?.data || error.message);
            return rejectWithValue(error.response?.data?.message || 'Network request failed');
        }
    }
);

export const getComments = createAsyncThunk(
    'post/getComments',
    async (postId: string, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`${URLS.POST.GET_COMMENTS}?post_id=${postId}`);
            console.log('--- Get Comments Response ---', response.data);
            return { postId, comments: response.data.data };
        } catch (error: any) {
            console.error('--- Get Comments Error ---', error.response?.data || error.message);
            return rejectWithValue(error.response?.data?.message || 'Network request failed');
        }
    }
);

export const createPost = createAsyncThunk<any, any>(
    'post/createPost',
    async (postData, { getState, rejectWithValue }) => {
        try {
            const state: any = getState();
            const token = state.auth.token;

            console.log('--- Create Post (Direct Fetch) Request Start ---');

            const headers: any = {
                'Accept': 'application/json',
            };

            if (token) {
                headers['Authorization'] = token;
            }

            const response = await fetch(URLS.POST.ADD_POST, {
                method: 'POST',
                body: postData,
                headers: headers,
            });

            const result = await response.json();
            console.log('--- Create Post (Direct Fetch) Response ---', result);

            if (!response.ok) {
                return rejectWithValue(result.message || `Server error: ${response.status}`);
            }

            return result;
        } catch (error: any) {
            console.error('--- Create Post (Direct Fetch) Error ---', error);
            return rejectWithValue(error.message || 'Network request failed');
        }
    }
);

const postSlice = createSlice({
    name: 'post',
    initialState,
    reducers: {
        resetPostStatus: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder
            // getPosts
            .addCase(getPosts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getPosts.fulfilled, (state, action) => {
                state.loading = false;
                state.posts = action.payload;
                state.error = null;
            })
            .addCase(getPosts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(toggleLike.fulfilled, (state, action) => {
                const { postId } = action.payload;
                const post = state.posts.find(p => p._id === postId);
                if (post) {
                    // If your API returns the status, use it. For now, 
                    // we toggle or just assume success means it happened.
                    // We don't have isLiked in API, so we'll just 
                    // trust the local toggle for now, but update total_likes if provided.
                    if (action.payload.total_likes !== undefined) {
                        post.total_likes = action.payload.total_likes;
                    } else {
                        // Fallback logic if count isn't returned
                        // post.total_likes += 1; // Simplified
                    }
                }
                console.log(`--- Post ${postId} Like Toggled in State ---`);
            })
            .addCase(addComment.fulfilled, (state, action) => {
                const { postId } = action.payload;
                const post = state.posts.find(p => p._id === postId);
                if (post) {
                    post.total_comments = (post.total_comments || 0) + 1;
                }
                console.log(`--- Post ${postId} Comment Count Updated ---`);
            })
            // createPost
            .addCase(createPost.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(createPost.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
                state.error = null;
            })
            .addCase(createPost.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.success = false;
            });
    },
});

export const { resetPostStatus } = postSlice.actions;
export default postSlice.reducer;
