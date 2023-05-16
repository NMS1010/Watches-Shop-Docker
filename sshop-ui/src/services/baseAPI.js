import axiosClient from './axiosInterceptor';

export const getData = async (url, params = {}) => {
    try {
        const response = await axiosClient().get(url, {
            params,
        });
        return response.data;
    } catch (error) {
        return error?.response;
    }
};

export const deleteData = async (url) => {
    try {
        const response = await axiosClient().delete(url);
        return response.data;
    } catch (error) {
        return error?.response;
    }
};
export const createFormData = async (url, formData) => {
    try {
        let response = await axiosClient().postForm(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        return error?.response;
    }
};
export const createData = async (url, obj) => {
    try {
        let response = await axiosClient().postForm(
            url,
            { ...obj },
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            },
        );
        return response.data;
    } catch (error) {
        return error?.response;
    }
};
export const updateFormData = async (url, formData) => {
    try {
        let response = await axiosClient().putForm(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        return error?.response;
    }
};
export const updateData = async (url, obj) => {
    try {
        let response = await axiosClient().putForm(
            url,
            { ...obj },
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            },
        );
        return response.data;
    } catch (error) {
        return error?.response;
    }
};
