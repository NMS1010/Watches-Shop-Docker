import * as baseAPI from './baseAPI';

export const getAllUsers = async (params = {}) => {
    return await baseAPI.getData('users/all', params);
};
export const getUserById = async (id) => {
    return await baseAPI.getData(`users/${id}`);
};
export const updateUser = async (user) => {
    return await baseAPI.updateFormData('users/update', user);
};
export const updateAdminUser = async (user) => {
    return await baseAPI.updateFormData('users/admin-update', user);
};
export const deleteUser = async (id) => {
    return await baseAPI.deleteData(`users/delete/${id}`);
};

export const checkEmail = async (email) => {
    return await baseAPI.getData(`users/check-email?email=${email}`);
};
export const checkUsername = async (username) => {
    return await baseAPI.getData(`users/check-username?username=${username}`);
};
export const checkPhone = async (phone) => {
    return await baseAPI.getData(`users/check-phone?phone=${phone}`);
};

export const verifyToken = async (params) => {
    return await baseAPI.getData('users/register-confirm', params);
};

export const forgotPassword = async (frmData) => {
    return await baseAPI.createFormData('users/forgot-password', frmData);
};

export const resetPassword = async (frmData) => {
    return await baseAPI.createFormData('users/reset-password', frmData);
};
