import * as baseAPI from './baseAPI';

export const login = async (username, password) => {
    let formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    return await baseAPI.createFormData('users/login', formData);
};
export const googleLogin = async (providerKey, email) => {
    let formData = new FormData();
    formData.append('providerKey', providerKey);
    formData.append('email', email);
    formData.append('loginProvider', 'Google');
    return await baseAPI.createFormData('users/google-login', formData);
};
export const refreshToken = async (accessToken, refreshToken) => {
    let formData = new FormData();
    formData.append('accessToken', accessToken);
    formData.append('refreshToken', refreshToken);
    return await baseAPI.createFormData('users/refresh-token', formData);
};
export const revokeToken = async (userId) => {
    return await baseAPI.createData(`users/revoke-token/${userId}`, {});
};
export const register = async (formData) => {
    return await baseAPI.createFormData('users/register', formData);
};
