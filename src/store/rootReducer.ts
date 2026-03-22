import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import postReducer from './slices/postSlice';
import chatReducer from './slices/chatSlice';
import notificationReducer from './slices/notificationSlice';

const rootReducer = combineReducers({
    auth: authReducer,
    post: postReducer,
    chat: chatReducer,
    notification: notificationReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
