import * as ordersAPI from '../../../services/ordersAPI';
import * as messageAction from '../../../redux/features/message/messageSlice';
import message from '../../../configs/messages';
import { useState } from 'react';
import { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { BACKGROUND_COLOR_FAILED } from '../../../constants';
import Loading from '../../../components/Loading';
import { useEffect } from 'react';
import OrderState from '../components/OrderState';
import RatingForm from '../components/RatingForm';
import ModalWrapper from '../../../components/ModalWrapper';
import { ORDER_STATE } from '../../../utils/orderStateUtils';
import formatter from '../../../utils/numberFormatter';
const OrderItem = () => {
    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState(null);
    const { currentUser } = useSelector((state) => state?.auth);
    const [review, setReview] = useState({
        click: false,
        productId: -1,
    });
    const { orderId } = useParams();
    const dispatch = useDispatch();
    const fetchOrderDetail = useCallback(async () => {
        setLoading(true);
        const response = await ordersAPI.getOrderById(orderId);
        if (!response?.isSuccess) {
            dispatch(
                messageAction.setMessage({
                    id: Math.random(),
                    title: 'Order',
                    message: response?.errors?.join('\n'),
                    backgroundColor: BACKGROUND_COLOR_FAILED,
                    icon: '',
                }),
            );
            return;
        }
        setLoading(false);
        setOrder(response.data);
    }, [orderId]);
    useEffect(() => {
        fetchOrderDetail();
    }, [orderId]);
    return loading ? (
        <Loading />
    ) : (
        <div>
            <div className="py-14 px-4 md:px-6 2xl:px-20  max-w-screen-xl mx-auto">
                <div className="flex justify-start item-start space-y-2 flex-col">
                    <h1 className="text-3xl dark:text-white lg:text-4xl font-semibold leading-7 lg:leading-9 text-gray-800">
                        Order #{order.orderId}
                    </h1>
                    <p className="text-xl dark:text-gray-300 font-medium leading-6 text-gray-600">
                        {new Date(order.dateCreated).toLocaleString()}
                    </p>
                </div>
                <OrderState order={order} />
                <div className="mt-10 flex flex-col xl:flex-row jusitfy-center items-stretch w-full xl:space-x-8 space-y-4 md:space-y-6 xl:space-y-0">
                    <div className="flex flex-col justify-start items-start w-full space-y-4 md:space-y-6 xl:space-y-8">
                        <div className="flex flex-col justify-start items-start dark:bg-gray-800 bg-gray-50 px-4 py-4 md:py-6 md:p-6 xl:p-8 w-full">
                            <p className="text-lg md:text-2xl dark:text-white font-semibold leading-6 xl:leading-5 text-gray-800">
                                Order's Detail
                            </p>
                            {order.orderItems.items.map((oi) => {
                                return (
                                    <div className="mt-4 md:mt-6 flex flex-col md:flex-row justify-start items-start md:items-center md:space-x-6 xl:space-x-8 w-full">
                                        <div className="pb-4 md:pb-8 w-full md:w-40">
                                            <img
                                                className="w-full hidden md:block"
                                                src={`${process.env.REACT_APP_HOST}${oi.productImage}`}
                                                alt="dress"
                                            />
                                            <img
                                                className="w-full md:hidden"
                                                src={`${process.env.REACT_APP_HOST}${oi.productImage}`}
                                                alt="dress"
                                            />
                                        </div>
                                        <div className="border-b border-gray-200 md:flex-row flex-col flex justify-between items-start w-full pb-8 space-y-4 md:space-y-0">
                                            <div className="w-full flex flex-col justify-start items-start space-y-8">
                                                <h3 className="text-xl dark:text-white xl:text-3xl font-semibold leading-6 text-gray-800">
                                                    {oi.productName}
                                                </h3>
                                                <div className="flex justify-start items-start flex-col space-y-2">
                                                    <p className="text-xl dark:text-white leading-none text-gray-800">
                                                        <span className="dark:text-gray-400 text-gray-300">
                                                            Brand:{' '}
                                                        </span>{' '}
                                                        {oi.productBrand}
                                                    </p>
                                                    <p className="text-xl dark:text-white leading-none text-gray-800">
                                                        <span className="dark:text-gray-400 text-gray-300">
                                                            Category:{' '}
                                                        </span>{' '}
                                                        {oi.productCategory}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex justify-between space-x-8 items-start w-full">
                                                <p className="text-xl dark:text-white xl:text-2xl leading-6">
                                                    {formatter.format(oi.unitPrice)}
                                                </p>
                                                <p className="text-xl dark:text-white xl:text-2xl leading-6 text-gray-800">
                                                    {formatter.format(oi.quantity)}
                                                </p>
                                                <p className="text-xl dark:text-white xl:text-2xl font-semibold leading-6 text-gray-800">
                                                    {formatter.format(oi.totalPrice)}
                                                </p>
                                            </div>
                                        </div>
                                        {order.orderStateName === ORDER_STATE.DELIVERED && (
                                            <button
                                                onClick={() => {
                                                    setReview({
                                                        click: true,
                                                        productId: oi.productId,
                                                    });
                                                }}
                                                className="py-3 w-1/12  text-xl bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl text-white"
                                            >
                                                Rate now
                                            </button>
                                        )}

                                        {review.click && (
                                            <ModalWrapper>
                                                <RatingForm
                                                    productId={review.productId}
                                                    setReview={setReview}
                                                    orderItem={oi}
                                                />
                                            </ModalWrapper>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                        <div className="flex justify-center md:flex-row flex-col items-stretch w-full space-y-4 md:space-y-0 md:space-x-6 xl:space-x-8">
                            <div className="flex flex-col px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 dark:bg-gray-800 space-y-6">
                                <h3 className="text-2xl dark:text-white font-semibold leading-5 text-gray-800">
                                    Summary
                                </h3>
                                <div className="flex justify-center items-center w-full space-y-4 flex-col border-gray-200 border-b pb-4">
                                    <div className="flex justify-between w-full">
                                        <p className="text-xl dark:text-white leading-4 text-gray-800">Subtotal</p>
                                        <p className="text-xl dark:text-gray-300 leading-4 text-gray-600">
                                            {formatter.format(order.totalItemPrice)}
                                        </p>
                                    </div>
                                    <div className="flex justify-between items-center w-full">
                                        <p className="text-xl dark:text-white leading-4 text-gray-800">
                                            Discount{' '}
                                            <span className="bg-gray-200 p-1 text-xs font-medium dark:bg-white dark:text-gray-800 leading-3 text-gray-800">
                                                STUDENT
                                            </span>
                                        </p>
                                        <p className="text-xl dark:text-gray-300 leading-4 text-gray-600"></p>
                                    </div>
                                    <div className="flex justify-between items-center w-full">
                                        <p className="text-xl dark:text-white leading-4 text-gray-800">Shipping</p>
                                        <p className="text-xl dark:text-gray-300 leading-4 text-gray-600">
                                            {formatter.format(order.deliveryMethod.deliveryMethodPrice)}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center w-full">
                                    <p className="text-xl dark:text-white font-semibold leading-4 text-gray-800">
                                        Total
                                    </p>
                                    <p className="text-xl dark:text-gray-300 font-semibold leading-4 text-gray-600">
                                        {formatter.format(order.totalPrice)}
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col justify-center px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 dark:bg-gray-800 space-y-6">
                                <h3 className="text-2xl dark:text-white font-semibold leading-5 text-gray-800">
                                    Shipping
                                </h3>
                                <div className="flex justify-between items-start w-full">
                                    <div className="flex justify-center items-center space-x-4">
                                        <div className="w-20 h-20">
                                            <img
                                                className="w-full h-full"
                                                alt="logo"
                                                src={`${process.env.REACT_APP_HOST}${order.deliveryMethod.image}`}
                                            />
                                        </div>
                                        <div className="flex flex-col justify-start items-center">
                                            <p className="text-xl leading-6 dark:text-white font-semibold text-gray-800">
                                                {order.deliveryMethod.deliveryMethodName}
                                                <br />
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-xl font-semibold leading-6 dark:text-white text-gray-800">
                                        {formatter.format(order.deliveryMethod.deliveryMethodPrice)}
                                    </p>
                                </div>
                                <h3 className="text-2xl dark:text-white font-semibold leading-5 text-gray-800">
                                    Payment
                                </h3>
                                <div className="flex justify-between items-start w-full">
                                    <div className="flex justify-center items-center space-x-4">
                                        <div className="w-20 h-20">
                                            <img
                                                className="w-full h-full"
                                                alt="logo"
                                                src={`${process.env.REACT_APP_HOST}${order.paymentMethod.image}`}
                                            />
                                        </div>
                                        <div className="flex flex-col justify-start items-center">
                                            <p className="text-xl leading-6 dark:text-white font-semibold text-gray-800">
                                                {order.paymentMethod.paymentMethodName}
                                                <br />
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 w-full xl:w-96 flex justify-between items-center md:items-start px-4 py-6 md:p-6 xl:p-8 flex-col">
                        <h3 className="text-2xl dark:text-white font-semibold leading-5 text-gray-800">Customer</h3>
                        <div className="flex flex-col md:flex-row xl:flex-col justify-start items-stretch h-full w-full md:space-x-6 lg:space-x-8 xl:space-x-0">
                            <div className="flex flex-col justify-start items-start flex-shrink-0">
                                <div className="flex justify-center w-full md:justify-start items-center space-x-4 py-8 border-b border-gray-200">
                                    <img
                                        src={`${process.env.REACT_APP_HOST}${currentUser.avatar}`}
                                        alt="avatar"
                                        className="w-20 h-20 rounded-full"
                                    />
                                    <div className="flex justify-start items-start flex-col space-y-2">
                                        <p className="text-2xl dark:text-white font-semibold leading-4 text-left text-gray-800">
                                            {`${currentUser.firstName}`}
                                        </p>
                                        <p className="text-2xl dark:text-white font-semibold leading-4 text-left text-gray-800">
                                            {`${currentUser.lastName}`}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex justify-center w-full md:justify-start items-center space-x-4 py-8 border-b border-gray-200">
                                    <div className="flex justify-start items-start flex-col space-y-2">
                                        <p className="text-xl dark:text-white font-semibold leading-4 text-left text-gray-800">
                                            Receiver
                                        </p>
                                        <p className="text-2xl dark:text-white font-semibold leading-4 text-left text-gray-600">
                                            {`${order.address.firstName} ${order.address.lastName}`}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex justify-center text-gray-800 dark:text-white md:justify-start items-center space-x-4 py-4 border-b border-gray-200 w-full">
                                    <svg
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5Z"
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M3 7L12 13L21 7"
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                    <p className="cursor-pointer text-xl leading-5 mt-3">{order.address.phone}</p>
                                </div>
                            </div>
                            <div className="flex justify-between xl:h-full items-stretch w-full flex-col mt-6 md:mt-0">
                                <div className="flex justify-center md:justify-start xl:flex-col flex-col md:space-x-6 lg:space-x-8 xl:space-x-0 space-y-4 xl:space-y-12 md:space-y-0 md:flex-row items-center md:items-start">
                                    <div className="flex justify-center md:justify-start items-center md:items-start flex-col space-y-4 xl:mt-8">
                                        <p className="text-xl dark:text-white font-semibold leading-4 text-center md:text-left text-gray-800">
                                            Shipping Address
                                        </p>
                                        <p className="w-48 lg:w-full dark:text-gray-300 text-center md:text-left text-xl leading-7 text-gray-600">
                                            {`${order.address.specificAddress}, ${order.address.wardName}, ${order.address.districtName}, ${order.address.provinceName}`}
                                        </p>
                                    </div>
                                    {order?.dateDone && (
                                        <div className="flex justify-center md:justify-start items-center md:items-start flex-col space-y-4">
                                            <p className="text-xl dark:text-white font-semibold leading-4 text-center md:text-left text-gray-800">
                                                Date done
                                            </p>
                                            <p className="w-48 lg:w-full dark:text-gray-300 text-center md:text-left text-xl leading-5 text-gray-600">
                                                {new Date(order.dateDone).toLocaleString()}
                                            </p>
                                        </div>
                                    )}
                                    {order?.datePaid && (
                                        <div className="flex justify-center md:justify-start items-center md:items-start flex-col space-y-4">
                                            <p className="text-xl dark:text-white font-semibold leading-4 text-center md:text-left text-gray-800">
                                                Date paid
                                            </p>
                                            <p className="w-48 lg:w-full dark:text-gray-300 text-center md:text-left text-xl leading-5 text-gray-600">
                                                {new Date(order.datePaid).toLocaleString()}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderItem;
