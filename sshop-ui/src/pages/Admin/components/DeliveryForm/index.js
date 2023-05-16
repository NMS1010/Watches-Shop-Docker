import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import classNames from 'classnames/bind';
import styles from '../CommonCSSForm.module.scss';

import FileUploader from '../../../../components/FileUploader';
import Button from '../../../../components/Button';

import * as deliveryMethodsAPI from '../../../../services/deliveryMethodAPI';
import * as messageAction from '../../../../redux/features/message/messageSlice';
import * as authAction from '../../../../redux/features/auth/authSlice';
import logoutHandler from '../../../../utils/logoutHandler';
import { BACKGROUND_COLOR_FAILED, BACKGROUND_COLOR_SUCCESS } from '../../../../constants';
import messages from '../../../../configs/messages';

const cx = classNames.bind(styles);

const DeliveryForm = ({
    setAction = () => {},
    deliveryMethod = null,
    deliveryMethods = [],
    getAllDeliveryMethods = () => {},
}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [inputFields, setInputFields] = useState({
        deliveryMethodName: deliveryMethod?.deliveryMethodName,
        deliveryMethodPrice: deliveryMethod?.deliveryMethodPrice,
    });
    const [fileSelected, setFileSelected] = useState(null);
    const [fileSelectedError, setFileSelectedError] = useState('');
    const [validationMessage, setValidationMessage] = useState({
        deliveryMethodName: '',
        deliveryMethodPrice: '',
        image: null,
    });

    const validation = useCallback(() => {
        let errors = { ...validationMessage };
        inputFields.deliveryMethodName?.trim()
            ? (errors.deliveryMethodName = '')
            : (errors.deliveryMethodName = 'Delivery name is required');
        inputFields.deliveryMethodPrice
            ? (errors.deliveryMethodPrice = '')
            : (errors.deliveryMethodPrice = 'Price is required');
        !fileSelected && !deliveryMethod?.image ? (errors.image = 'Image is required') : (errors.image = '');
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
        const deliveryMethodObj = new FormData();
        deliveryMethodObj.append('deliveryMethodId', deliveryMethod?.deliveryMethodId);
        deliveryMethodObj.append('deliveryMethodName', inputFields?.deliveryMethodName);
        deliveryMethodObj.append('deliveryMethodPrice', inputFields?.deliveryMethodPrice);
        deliveryMethodObj.append('deliveryImage', fileSelected);

        const handleDelivery = async () => {
            setLoading(true);
            let response =
                deliveryMethod !== null
                    ? await deliveryMethodsAPI.updateDeliveryMethod(deliveryMethodObj)
                    : await deliveryMethodsAPI.createDeliveryMethod(deliveryMethodObj);

            if (!response || !response.isSuccess) {
                if (response.status === 401) {
                    await logoutHandler(dispatch, navigate, messageAction, authAction);
                }
                dispatch(
                    messageAction.setMessage({
                        id: Math.random(),
                        title: 'Delivery',
                        message: response?.errors || messages.admin.delivery.handling_err,
                        backgroundColor: BACKGROUND_COLOR_FAILED,
                        icon: '',
                    }),
                );
            } else {
                dispatch(
                    messageAction.setMessage({
                        id: Math.random(),
                        title: 'Delivery',
                        message: messages.admin.delivery.handling_suc,
                        backgroundColor: BACKGROUND_COLOR_SUCCESS,
                        icon: '',
                    }),
                );
                setAction({ add: false, edit: false, delete: false });
                await getAllDeliveryMethods();
            }
            setLoading(false);
        };
        handleDelivery();
    };
    return (
        <div className={cx('container')}>
            <h1 className={cx('title')}>Delivery</h1>
            <form className={cx('form')} onSubmit={handleSubmit}>
                <div className={cx('form-group')}>
                    <label htmlFor="deliveryMethodName">Name</label>
                    <input
                        name="deliveryMethodName"
                        value={inputFields.deliveryMethodName}
                        type={'text'}
                        onChange={handleChange}
                    />
                    <small>{validationMessage.deliveryMethodName}</small>
                </div>
                <div className={cx('form-group')}>
                    <label htmlFor="deliveryMethodPrice">Price</label>
                    <input
                        name="deliveryMethodPrice"
                        value={inputFields.deliveryMethodPrice}
                        type={'number'}
                        onChange={handleChange}
                    />
                    <small>{validationMessage.deliveryMethodPrice}</small>
                </div>
                <div className={cx('form-group')}>
                    <FileUploader
                        accept={'image/*'}
                        setFileSelected={setFileSelected}
                        setFileSelectedError={setFileSelectedError}
                        imgUrl={deliveryMethod?.image}
                    />
                    <small>{fileSelectedError}</small>
                    <small>{validationMessage.image}</small>
                </div>
                <div className={cx('action-btn')}>
                    <Button className={cx('submit-btn')} type="submit" loading={loading}>
                        {deliveryMethod ? 'Update' : 'Create'}
                    </Button>
                </div>
            </form>
        </div>
    );
};
export default DeliveryForm;
