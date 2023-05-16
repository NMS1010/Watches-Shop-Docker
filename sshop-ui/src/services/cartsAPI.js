import * as baseAPI from './baseAPI';

export const getCartByUserId = async (id, status = -1) => {
    const formData = new FormData();
    formData.append('userId', id);
    formData.append('status', status);
    return await baseAPI.createFormData(`carts/all`, formData);
};
export const addCartItem = async (cartItem) => {
    return await baseAPI.createFormData('carts/add', cartItem);
};
export const updateCartItem = async (cartItem) => {
    return await baseAPI.updateFormData('carts/update', cartItem);
};
export const updateStatusAllCartItem = async (data) => {
    return await baseAPI.updateFormData('carts/update/all', data);
};
export const deleteCartItem = async (cartItemId) => {
    return await baseAPI.deleteData(`carts/delete/${cartItemId}`);
};
export const deleteSelectedCartItem = async (userId) => {
    return await baseAPI.deleteData(`carts/delete/all/${userId}`);
};
