import * as baseAPI from './baseAPI';

export const getAllAddresses = async (params = {}) => {
    return await baseAPI.getData('addresses/all', params);
};
export const getAddressById = async (id) => {
    return await baseAPI.getData(`addresses/${id}`);
};
export const getAddressByUserId = async (userId) => {
    return await baseAPI.getData(`addresses/address/${userId}`);
};
export const createAddress = async (address) => {
    return await baseAPI.createFormData('addresses/add', address);
};
export const updateAddress = async (address) => {
    return await baseAPI.updateFormData('addresses/update', address);
};
export const deleteAddress = async (id) => {
    return await baseAPI.deleteData(`addresses/delete/${id}`);
};
