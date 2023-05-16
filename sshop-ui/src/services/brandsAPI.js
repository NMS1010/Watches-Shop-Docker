import * as baseAPI from './baseAPI';

export const getAllBrands = async (params = {}) => {
    return await baseAPI.getData('brands/all', params);
};
export const getBrandById = async (id) => {
    return await baseAPI.getData(`brands/${id}`);
};
export const createBrand = async (brand) => {
    return await baseAPI.createFormData('brands/add', brand);
};
export const updateBrand = async (brand) => {
    return await baseAPI.updateFormData('brands/update', brand);
};
export const deleteBrand = async (id) => {
    return await baseAPI.deleteData(`brands/delete/${id}`);
};
