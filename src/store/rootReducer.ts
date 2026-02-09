import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import postReducer from './slices/postSlice';

const rootReducer = combineReducers({
    auth: authReducer,
    post: postReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
