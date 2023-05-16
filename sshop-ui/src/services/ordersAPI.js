import * as baseAPI from './baseAPI';

export const getAllUserOrders = async (params = {}) => {
    return await baseAPI.getData('orders/user-order', params);
};
export const getAllOrderStates = async (params = {}) => {
    return await baseAPI.getData('orderStates/all', params);
};
export const getAllOrders = async (params = {}) => {
    return await baseAPI.getData('orders/all', params);
};
export const getOrderById = async (id) => {
    return await baseAPI.getData(`orders/${id}`);
};
export const createOrder = async (order) => {
    return await baseAPI.createFormData('orders/add', order);
};

export const updateOrder = async (order) => {
    return await baseAPI.updateFormData('orders/update', order);
};
