import axios from 'axios';
const axiosClient = () => {
    const axiosClient = axios.create({
        baseURL: 'https://provinces.open-api.vn/api/',
    });
    return axiosClient;
};
const getData = async (url, params = {}) => {
    try {
        const response = await axiosClient().get(url, {
            params,
        });
        return response.data;
    } catch (error) {
        return error?.response;
    }
};
export const getProvinces = async (params = {}) => {
    return await getData('', params);
};
export const getDistrictsByProvinceCode = async (id, params = {}) => {
    return await getData(`p/${id}`, params);
};
export const getWardsByDistrictCode = async (id, params = {}) => {
    return await getData(`d/${id}`, params);
};
