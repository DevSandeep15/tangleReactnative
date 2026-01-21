const BASE_URL = 'https://tangle-asy7.onrender.com';

export const URLS = {
    AUTH: {
        LOGIN: `${BASE_URL}/api/user/login`,
        SIGNUP: `${BASE_URL}/api/user/register-otp`,
        VERIFY_OTP: `${BASE_URL}/api/user/verify-register-otp`,
        FORGET_PASSWORD: `${BASE_URL}/api/user/forgot-password`,
        RESET_PASSWORD: `${BASE_URL}/api/user/reset-password`,
        COMPLETE_SIGNUP: `${BASE_URL}/api/user/register`,
    },

};
