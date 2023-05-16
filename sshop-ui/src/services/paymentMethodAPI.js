import * as baseAPI from './baseAPI';

export const getAllPaymentMethods = async (params = {}) => {
    return await baseAPI.getData('paymentMethods/all', params);
};
export const getPaymentMethodById = async (id) => {
    return await baseAPI.getData(`paymentMethods/${id}`);
};
export const createPaymentMethod = async (paymentMethod) => {
    return await baseAPI.createFormData('paymentMethods/add', paymentMethod);
};
export const updatePaymentMethod = async (paymentMethod) => {
    return await baseAPI.updateFormData('paymentMethods/update', paymentMethod);
};
export const deletePaymentMethod = async (id) => {
    return await baseAPI.deleteData(`paymentMethods/delete/${id}`);
};
