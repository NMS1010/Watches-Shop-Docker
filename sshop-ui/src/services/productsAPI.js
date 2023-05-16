import * as baseAPI from './baseAPI';

export const getAllProducts = async (params = {}) => {
    return await baseAPI.getData('products/all', params);
};

export const getProductById = async (id) => {
    return await baseAPI.getData(`products/${id}`);
};
export const createProduct = async (productFormData) => {
    return await baseAPI.createFormData('products/add', productFormData);
};
export const updateProduct = async (productFormData) => {
    return await baseAPI.updateFormData('products/update', productFormData);
};
export const deleteProduct = async (id) => {
    return await baseAPI.deleteData(`products/delete/${id}`);
};

// Product Images
export const getAllProductImages = async (id, params = {}) => {
    return await baseAPI.getData(`products/${id}/images/all`, params);
};
export const createProductImage = async (productFormData) => {
    return await baseAPI.createFormData('products/image/add', productFormData);
};
export const updateProductImage = async (productFormData) => {
    return await baseAPI.updateFormData('products/images/update', productFormData);
};
export const deleteProductImage = async (id) => {
    return await baseAPI.deleteData(`products/images/delete/${id}`);
};
