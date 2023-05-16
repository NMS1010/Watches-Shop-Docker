import * as baseAPI from './baseAPI';

export const getAllReviews = async (params = {}) => {
    return await baseAPI.getData('reviews/all', params);
};
export const getReviewById = async (id) => {
    return await baseAPI.getData(`reviews/${id}`);
};
export const getReviewByUser = async (params = {}) => {
    return await baseAPI.getData(`reviews/get-by-user`, params);
};
export const getReviewByProduct = async (params = {}) => {
    return await baseAPI.getData(`reviews/get-by-product`, params);
};
export const getReviewByOrderItem = async (params = {}) => {
    return await baseAPI.getData(`reviews/get-by-order-item`, params);
};
export const createReview = async (review) => {
    return await baseAPI.createFormData('reviews/add', review);
};
export const updateReview = async (review) => {
    return await baseAPI.updateFormData('reviews/update', review);
};
export const deleteReview = async (id) => {
    return await baseAPI.deleteData(`reviews/delete/${id}`);
};
export const changeStatusReview = async (id) => {
    return await baseAPI.updateData(`reviews/status/change/${id}`);
};
