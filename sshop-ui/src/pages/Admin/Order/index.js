import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import Loading from '../../../components/Loading';
import Table from '../../../components/Table';
import Alert from '../../../components/Alert';
import OrderForm from '../components/OrderForm';
import OutsideAlerter from '../../../components/OutsideAlerter';
import ModalWrapper from '../../../components/ModalWrapper';
import logoutHandler from '../../../utils/logoutHandler';
import * as authAction from '../../../redux/features/auth/authSlice';
import * as messageAction from '../../../redux/features/message/messageSlice';
import * as ordersAPI from '../../../services/ordersAPI';
import { BACKGROUND_COLOR_FAILED, BACKGROUND_COLOR_SUCCESS } from '../../../constants';
import messages from '../../../configs/messages';

const Order = () => {
    const hiddenColumns = [
        'addressId',
        'discountId',
        'address',
        'orderItems',
        'orderStateId',
        'deliveryMethod',
        'paymentMethod',
        'userId',
        'totalItemPrice',
        'discountCode',
        'orderId',
        'discountValue',
    ];
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [orderStates, setOrderStates] = useState([]);
    const [isOutClick, setIsOutClick] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [action, setAction] = useState({
        add: false,
        edit: false,
        delete: false,
    });
    const fetchAPI = useCallback(async () => {
        setLoading(true);
        let response = await ordersAPI.getAllOrders();
        if (!response || !response?.isSuccess) {
            setLoading(true);
            setOrders([]);
            dispatch(
                messageAction.setMessage({
                    id: Math.random(),
                    title: 'Order',
                    message: response?.errors || messages.admin.order.retrieve_err,
                    backgroundColor: BACKGROUND_COLOR_FAILED,
                    icon: '',
                }),
            );
        } else {
            setOrders(response?.data?.items);
            response = await ordersAPI.getAllOrderStates();
            if (!response || !response?.isSuccess) {
                setLoading(true);
                setOrderStates([]);
                dispatch(
                    messageAction.setMessage({
                        id: Math.random(),
                        title: 'Order',
                        message: response?.errors || messages.admin.order.retrieve_err,
                        backgroundColor: BACKGROUND_COLOR_FAILED,
                        icon: '',
                    }),
                );
            } else {
                setLoading(false);
                setOrderStates(response?.data?.items);
            }
        }
    }, []);
    useEffect(() => {
        fetchAPI();
    }, []);
    const handleUpdateOrder = (orderId) => {
        const order = orders.find((val) => val.orderId === orderId);
        setAction({ add: false, edit: true, delete: false });
        setSelectedOrder(order);
        setIsOutClick(false);
    };
    return (
        <div>
            {loading ? (
                <Loading />
            ) : (
                <>
                    <Table
                        data={orders}
                        hiddenColumns={hiddenColumns}
                        uniqueField={'orderId'}
                        isSearch={true}
                        handleUpdateItem={handleUpdateOrder}
                    />
                    {action.edit && !isOutClick && (
                        <ModalWrapper>
                            <OutsideAlerter setIsOut={setIsOutClick}>
                                <OrderForm
                                    orderStates={orderStates}
                                    order={selectedOrder}
                                    getAllOrders={fetchAPI}
                                    setAction={setAction}
                                />
                            </OutsideAlerter>
                        </ModalWrapper>
                    )}
                </>
            )}
        </div>
    );
};

export default Order;
