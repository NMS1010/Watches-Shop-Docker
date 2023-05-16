import axios from 'axios';
import * as authAPI from './authAPI';
import * as authUtil from '../utils/authUtils';
const axiosClient = () => {
    const axiosClient = axios.create({
        baseURL: process.env.REACT_APP_API_URL,
    });
    axiosClient.interceptors.request.use(onRequestSuccess);
    axiosClient.interceptors.response.use(onResponseSuccess, onResponseError);
    return axiosClient;
};

const onRequestSuccess = (config) => {
    const auth = localStorage.getItem('accessToken');
    if (auth) {
        config.headers = {
            Authorization: 'Bearer ' + auth,
        };
    }

    return config;
};
const onResponseSuccess = (response) => {
    return response;
};
const onResponseError = (error) => {
    if (error.response?.status !== 401) {
        return Promise.reject(error);
    }
    return refreshToken(error);
};

const refreshToken = async (error) => {
    try {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await authAPI.refreshToken(accessToken, refreshToken);
        if (!response?.data) {
            // authUtil.clearToken();
            return axios(error.config);
        }
        localStorage.setItem('accessToken', response?.data.accessToken);
        localStorage.setItem('refreshToken', response?.data.refreshToken);
        error.config.headers = {
            Authorization: 'Bearer ' + response?.data.accessToken,
        };
        return axios(error.config);
    } catch (error) {
        return error;
    }
};
export default axiosClient;
