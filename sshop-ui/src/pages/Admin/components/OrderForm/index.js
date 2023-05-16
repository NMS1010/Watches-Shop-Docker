import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import classNames from 'classnames/bind';
import styles from '../CommonCSSForm.module.scss';

import Button from '../../../../components/Button';

import * as ordersAPI from '../../../../services/ordersAPI';
import * as messageAction from '../../../../redux/features/message/messageSlice';
import * as authAction from '../../../../redux/features/auth/authSlice';
import logoutHandler from '../../../../utils/logoutHandler';
import { BACKGROUND_COLOR_FAILED, BACKGROUND_COLOR_SUCCESS } from '../../../../constants';
import messages from '../../../../configs/messages';

const cx = classNames.bind(styles);

const OrderForm = ({ setAction = () => {}, order = null, orderStates = [], getAllOrders = () => {} }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [inputFields, setInputFields] = useState({
        orderId: order?.orderId,
        orderStateId: order?.orderStateId,
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputFields({ ...inputFields, [name]: value });
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        const orderObj = new FormData();
        orderObj.append('orderId', order?.orderId);
        orderObj.append('orderStateId', inputFields?.orderStateId);
        const handleOrder = async () => {
            setLoading(true);
            let response = await ordersAPI.updateOrder(orderObj);

            if (!response || !response.isSuccess) {
                if (response.status === 401) {
                    await logoutHandler(dispatch, navigate, messageAction, authAction);
                }
                dispatch(
                    messageAction.setMessage({
                        id: Math.random(),
                        title: 'Order',
                        message: response?.errors || messages.admin.order.handling_err,
                        backgroundColor: BACKGROUND_COLOR_FAILED,
                        icon: '',
                    }),
                );
            } else {
                dispatch(
                    messageAction.setMessage({
                        id: Math.random(),
                        title: 'Order',
                        message: messages.admin.order.handling_suc,
                        backgroundColor: BACKGROUND_COLOR_SUCCESS,
                        icon: '',
                    }),
                );
                setAction({ add: false, edit: false, delete: false });
                await getAllOrders();
            }
            setLoading(false);
        };
        handleOrder();
    };
    return (
        <div className={cx('container')} style={{ height: 'max-content' }}>
            <h1 className={cx('title')}>Order State</h1>
            <form className={cx('form')} onSubmit={handleSubmit}>
                <div className={cx('form-group')}>
                    <label htmlFor="orderStateId">Order State</label>
                    <select name="orderStateId" onChange={handleChange}>
                        {orderStates.map((orderState) => {
                            return (
                                <option
                                    selected={orderState?.orderStateId === order?.orderStateId}
                                    value={orderState?.orderStateId}
                                    key={orderState?.orderStateId}
                                >
                                    {orderState.orderStateName}
                                </option>
                            );
                        })}
                    </select>
                </div>
                <div className={cx('action-btn')}>
                    <Button className={cx('submit-btn')} type="submit" loading={loading}>
                        {order ? 'Update' : 'Create'}
                    </Button>
                </div>
            </form>
        </div>
    );
};
export default OrderForm;
