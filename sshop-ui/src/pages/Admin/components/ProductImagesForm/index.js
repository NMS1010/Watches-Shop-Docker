import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import classNames from 'classnames/bind';
import styles from '../CommonCSSForm.module.scss';

import FileUploader from '../../../../components/FileUploader';
import Button from '../../../../components/Button';

import * as productsAPI from '../../../../services/productsAPI';
import * as messageAction from '../../../../redux/features/message/messageSlice';
import logoutHandler from '../../../../utils/logoutHandler';
import * as authAction from '../../../../redux/features/auth/authSlice';
import { BACKGROUND_COLOR_FAILED, BACKGROUND_COLOR_SUCCESS } from '../../../../constants';
import messages from '../../../../configs/messages';

const cx = classNames.bind(styles);

const ProductImagesForm = ({
    setAction = () => {},
    productImage = null,
    productId,
    setIsOutClick,
    getAllProductImages = () => {},
}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    const [fileSelected, setFileSelected] = useState(null);
    const [fileSelectedError, setFileSelectedError] = useState('');
    const [validationMessage, setValidationMessage] = useState({});

    const validation = useCallback(() => {
        let errors = {};
        !fileSelected && !productImage?.image ? (errors.image = 'Image is required') : (errors.image = '');
        setValidationMessage(errors);
    });
    useEffect(() => {
        validation();
    }, [fileSelected]);

    const handleSubmit = (e) => {
        e.preventDefault();
        let isValidateErrors = Object.keys(validationMessage).some((err) => {
            return validationMessage[err] !== '';
        });
        if (isValidateErrors) return;
        const productImageObj = new FormData();
        productImageObj.append('productImageId', productImage?.id);
        productImageObj.append('productId', productId);
        productImageObj.append('image', fileSelected);
        const handleProductImages = async () => {
            setLoading(true);
            let response =
                productImage !== null
                    ? await productsAPI.updateProductImage(productImageObj)
                    : await productsAPI.createProductImage(productImageObj);

            if (!response || !response.isSuccess) {
                if (response.status === 401) {
                    await logoutHandler(dispatch, navigate, messageAction, authAction);
                }
                dispatch(
                    messageAction.setMessage({
                        id: Math.random(),
                        title: 'ProductImages',
                        message: response?.errors || messages.admin.product_images.handling_err,
                        backgroundColor: BACKGROUND_COLOR_FAILED,
                        icon: '',
                    }),
                );
            } else {
                dispatch(
                    messageAction.setMessage({
                        id: Math.random(),
                        title: 'ProductImages',
                        message: messages.admin.product_images.handling_suc,
                        backgroundColor: BACKGROUND_COLOR_SUCCESS,
                        icon: '',
                    }),
                );
                setAction({ add: false, edit: false, delete: false });
                await getAllProductImages();
            }
            setLoading(false);
        };
        handleProductImages();
    };
    return (
        <div className={cx('container')} style={{ textAlign: 'center', height: 'max-content' }}>
            <h1 className={cx('title')}>Product Images</h1>
            <form className={cx('form')} onSubmit={handleSubmit}>
                <div className={cx('form-group')}>
                    <FileUploader
                        accept={'image/*'}
                        setFileSelected={setFileSelected}
                        setFileSelectedError={setFileSelectedError}
                        imgUrl={productImage?.image}
                    />
                    <small>{fileSelectedError}</small>
                    <small>{validationMessage.image}</small>
                </div>
                <div className={cx('action-btn')}>
                    <Button className={cx('submit-btn')} type="submit" loading={loading}>
                        {productImage ? 'Update' : 'Create'}
                    </Button>
                    <Button className={cx('cancel-btn')} onClick={() => setIsOutClick(true)}>
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
};
export default ProductImagesForm;
