import * as baseAPI from './baseAPI';

export const getAllDeliveryMethods = async (params = {}) => {
    return await baseAPI.getData('deliveryMethods/all', params);
};
export const getDeliveryMethodById = async (id) => {
    return await baseAPI.getData(`deliveryMethods/${id}`);
};
export const createDeliveryMethod = async (deliveryMethod) => {
    return await baseAPI.createFormData('deliveryMethods/add', deliveryMethod);
};
export const updateDeliveryMethod = async (deliveryMethod) => {
    return await baseAPI.updateFormData('deliveryMethods/update', deliveryMethod);
};
export const deleteDeliveryMethod = async (id) => {
    return await baseAPI.deleteData(`deliveryMethods/delete/${id}`);
};
