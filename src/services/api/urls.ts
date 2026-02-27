const BASE_URL = 'https://tangle-asy7.onrender.com';

export const URLS = {
    AUTH: {
        LOGIN: `${BASE_URL}/api/user/login`,
        SIGNUP: `${BASE_URL}/api/user/register-otp`,
        VERIFY_OTP: `${BASE_URL}/api/user/verify-register-otp`,
        FORGET_PASSWORD: `${BASE_URL}/api/user/forgot-password`,
        RESET_PASSWORD: `${BASE_URL}/api/user/reset-password`,
        COMPLETE_SIGNUP: `${BASE_URL}/api/user/register`,
        GET_AVATARS: `${BASE_URL}/api/user/get-emojis`,
        GET_PROFILE: `${BASE_URL}/api/user/get-profile`,
        GET_RECOMMENDED_USERS: `${BASE_URL}/api/user/sameinterest-users`,
        GET_OTHER_PROFILE: `${BASE_URL}/api/user/get-profile-user`,
    },
    CHAT: {
        CREATE_CHATROOM: `${BASE_URL}/api/user/create-chatroom`,
        GET_CHATLIST: `${BASE_URL}/api/user/get-chatlist`,
        GET_MESSAGES: `${BASE_URL}/api/user/get-messages`,
        DELETE_MESSAGE: `${BASE_URL}/api/user/delete-message`,
        CLEAR_CHAT: `${BASE_URL}/api/user/clear-chat`,
    },
    POST: {
        ADD_POST: `${BASE_URL}/api/user/add-post`,
        GET_POSTS: `${BASE_URL}/api/user/get-posts`,
        LIKE_POST: `${BASE_URL}/api/user/like-unlike-post`,
        ADD_COMMENT: `${BASE_URL}/api/user/add-comment`,
        GET_COMMENTS: `${BASE_URL}/api/user/get-post-comments`,
    },
};
