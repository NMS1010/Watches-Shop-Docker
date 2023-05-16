import * as baseAPI from './baseAPI';

export const getAllCategories = async (params = {}) => {
    return await baseAPI.getData('categories/all', params);
};
export const getCategoryById = async (id) => {
    return await baseAPI.getData(`categories/${id}`);
};
export const createCategory = async (category) => {
    return await baseAPI.createFormData('categories/add', category);
};
export const updateCategory = async (category) => {
    return await baseAPI.updateFormData('categories/update', category);
};
export const deleteCategory = async (id) => {
    return await baseAPI.deleteData(`categories/delete/${id}`);
};
