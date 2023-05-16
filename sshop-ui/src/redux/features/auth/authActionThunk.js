import { createAsyncThunk } from '@reduxjs/toolkit';
import { BACKGROUND_COLOR_FAILED, BACKGROUND_COLOR_SUCCESS } from '../../../constants';
import * as authAPI from '../../../services/authAPI';
import * as usersAPI from '../../../services/usersAPI';
import * as authUtils from '../../../utils/authUtils';
import * as messageAction from '../message/messageSlice';

export const login = createAsyncThunk('auth/login', async (data, thunkAPI) => {
    let response = await authAPI.login(data.username, data.password);
    if (!response || !response?.isSuccess) {
        authUtils.clearToken();
        thunkAPI.dispatch(
            messageAction.setMessage({
                id: Math.random(),
                title: 'Login',
                message: response?.errors || 'Cannot connect to server',
                backgroundColor: BACKGROUND_COLOR_FAILED,
                icon: '',
            }),
        );
    } else {
        let { accessToken, refreshToken } = response.data;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        let userId = authUtils.getUserId();
        response = await usersAPI.getUserById(userId);
        if (!response || !response?.isSuccess) {
            authUtils.clearToken();
            thunkAPI.dispatch(
                messageAction.setMessage({
                    id: Math.random(),
                    title: 'Login',
                    message: 'Failed to login',
                    backgroundColor: BACKGROUND_COLOR_FAILED,
                    icon: '',
                }),
            );
        } else {
            thunkAPI.dispatch(
                messageAction.setMessage({
                    id: Math.random(),
                    title: 'Login',
                    message: 'Login successfully',
                    backgroundColor: BACKGROUND_COLOR_SUCCESS,
                    icon: '',
                }),
            );
        }
    }
    return response;
});
export const googleLogin = createAsyncThunk('auth/google-login', async (data, thunkAPI) => {
    let response = await authAPI.googleLogin(data.providerKey, data.email);
    if (!response || !response?.isSuccess) {
        authUtils.clearToken();
        thunkAPI.dispatch(
            messageAction.setMessage({
                id: Math.random(),
                title: 'Login',
                message: response?.errors || 'Cannot connect to server',
                backgroundColor: BACKGROUND_COLOR_FAILED,
                icon: '',
            }),
        );
    } else {
        let { accessToken, refreshToken } = response.data;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        let userId = authUtils.getUserId();
        response = await usersAPI.getUserById(userId);
        if (!response || !response?.isSuccess) {
            authUtils.clearToken();
            thunkAPI.dispatch(
                messageAction.setMessage({
                    id: Math.random(),
                    title: 'Login',
                    message: 'Failed to login',
                    backgroundColor: BACKGROUND_COLOR_FAILED,
                    icon: '',
                }),
            );
        } else {
            thunkAPI.dispatch(
                messageAction.setMessage({
                    id: Math.random(),
                    title: 'Login',
                    message: 'Login successfully',
                    backgroundColor: BACKGROUND_COLOR_SUCCESS,
                    icon: '',
                }),
            );
        }
    }
    return response;
});
export const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
    let userId = authUtils.getUserId();
    const response = await authAPI.revokeToken(userId);
    authUtils.clearToken();
    thunkAPI.dispatch(
        messageAction.setMessage({
            id: Math.random(),
            title: 'Login',
            message: 'Logout successfully',
            backgroundColor: BACKGROUND_COLOR_SUCCESS,
            icon: '',
        }),
    );
    return response;
});
export const getCurrentUser = createAsyncThunk('auth/getCurrentUser', async (_, thunkAPI) => {
    let userId = authUtils.getUserId();
    const response = await usersAPI.getUserById(userId);
    if (!response || !response?.isSuccess) {
        authUtils.clearToken();
        thunkAPI.dispatch(
            messageAction.setMessage({
                id: Math.random(),
                title: 'Login',
                message: response?.errors || 'Error while getting user profile',
                backgroundColor: BACKGROUND_COLOR_FAILED,
                icon: '',
            }),
        );
    }
    return response;
});
