import * as baseAPI from './baseAPI';

export const getAllRoles = async (params = {}) => {
    return await baseAPI.getData('roles/all', params);
};
export const getRoleById = async (id) => {
    return await baseAPI.getData(`roles/${id}`);
};
export const createRole = async (role) => {
    return await baseAPI.createFormData('roles/add', role);
};
export const updateRole = async (role) => {
    return await baseAPI.updateFormData('roles/update', role);
};
export const deleteRole = async (id) => {
    return await baseAPI.deleteData(`roles/delete/${id}`);
};
