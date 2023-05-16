import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import classNames from 'classnames/bind';
import styles from '../CommonCSSForm.module.scss';

import FileUploader from '../../../../components/FileUploader';
import Button from '../../../../components/Button';

import * as brandsAPI from '../../../../services/brandsAPI';
import * as messageAction from '../../../../redux/features/message/messageSlice';
import * as authAction from '../../../../redux/features/auth/authSlice';
import logoutHandler from '../../../../utils/logoutHandler';
import { BACKGROUND_COLOR_FAILED, BACKGROUND_COLOR_SUCCESS } from '../../../../constants';
import messages from '../../../../configs/messages';

const cx = classNames.bind(styles);

const BrandForm = ({ setAction = () => {}, brand = null, brands = [], getAllBrands = () => {} }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [inputFields, setInputFields] = useState({
        brandName: brand?.brandName,
        origin: brand?.origin,
    });
    const [fileSelected, setFileSelected] = useState(null);
    const [fileSelectedError, setFileSelectedError] = useState('');
    const [validationMessage, setValidationMessage] = useState({
        brandName: '',
        origin: '',
        image: null,
    });

    const validation = useCallback(() => {
        let errors = { ...validationMessage };
        inputFields.brandName?.trim() ? (errors.brandName = '') : (errors.brandName = 'Brand name is required');
        inputFields.origin?.trim() ? (errors.origin = '') : (errors.origin = 'Origin is required');
        !fileSelected && !brand?.image ? (errors.image = 'Image is required') : (errors.image = '');
        setValidationMessage(errors);
    });
    useEffect(() => {
        validation();
    }, [inputFields, fileSelected]);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputFields({ ...inputFields, [name]: value });
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        let isValidateErrors = Object.keys(validationMessage).some((err) => {
            return validationMessage[err] !== '';
        });
        if (isValidateErrors) return;
        // const brandObj = {
        //     brandId: brand?.brandId,
        //     brandName: inputFields?.brandName,
        //     origin: inputFields?.origin,
        //     image: fileSelected,
        // };
        const brandObj = new FormData();
        brandObj.append('brandId', brand?.brandId);
        brandObj.append('brandName', inputFields?.brandName);
        brandObj.append('origin', inputFields?.origin);
        brandObj.append('image', fileSelected);

        const handleBrand = async () => {
            setLoading(true);
            let response =
                brand !== null ? await brandsAPI.updateBrand(brandObj) : await brandsAPI.createBrand(brandObj);

            if (!response || !response.isSuccess) {
                if (response.status === 401) {
                    await logoutHandler(dispatch, navigate, messageAction, authAction);
                }
                dispatch(
                    messageAction.setMessage({
                        id: Math.random(),
                        title: 'Brand',
                        message: response?.errors || messages.admin.brand.handling_err,
                        backgroundColor: BACKGROUND_COLOR_FAILED,
                        icon: '',
                    }),
                );
            } else {
                dispatch(
                    messageAction.setMessage({
                        id: Math.random(),
                        title: 'Brand',
                        message: messages.admin.brand.handling_suc,
                        backgroundColor: BACKGROUND_COLOR_SUCCESS,
                        icon: '',
                    }),
                );
                setAction({ add: false, edit: false, delete: false });
                await getAllBrands();
            }
            setLoading(false);
        };
        handleBrand();
    };
    return (
        <div className={cx('container')}>
            <h1 className={cx('title')}>Brand</h1>
            <form className={cx('form')} onSubmit={handleSubmit}>
                <div className={cx('form-group')}>
                    <label htmlFor="brandName">Name</label>
                    <input name="brandName" value={inputFields.brandName} type={'text'} onChange={handleChange} />
                    <small>{validationMessage.brandName}</small>
                </div>
                <div className={cx('form-group')}>
                    <label htmlFor="origin">Origin</label>
                    <textarea name="origin" onChange={handleChange} value={inputFields.origin}></textarea>
                    <small>{validationMessage.origin}</small>
                </div>
                <div className={cx('form-group')}>
                    <FileUploader
                        accept={'image/*'}
                        setFileSelected={setFileSelected}
                        setFileSelectedError={setFileSelectedError}
                        imgUrl={brand?.image}
                    />
                    <small>{fileSelectedError}</small>
                    <small>{validationMessage.image}</small>
                </div>
                <div className={cx('action-btn')}>
                    <Button className={cx('submit-btn')} type="submit" loading={loading}>
                        {brand ? 'Update' : 'Create'}
                    </Button>
                </div>
            </form>
        </div>
    );
};
export default BrandForm;
