import * as baseAPI from './baseAPI';

export const getWishListByUserId = async (id) => {
    const formData = new FormData();
    formData.append('userId', id);
    return await baseAPI.createFormData(`wishs/all`, formData);
};
export const addWishItem = async (wishItem) => {
    return await baseAPI.createFormData('wishs/add', wishItem);
};
export const updateWishItem = async (wishItem) => {
    return await baseAPI.updateFormData('wishs/update', wishItem);
};
export const deleteWishItem = async (wishItemId) => {
    return await baseAPI.deleteData(`wishs/delete/${wishItemId}`);
};
export const deleteAllWishItem = async (userId) => {
    return await baseAPI.deleteData(`wishs/delete/all/${userId}`);
};
