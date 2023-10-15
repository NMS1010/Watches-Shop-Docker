import { useCallback, useEffect, useState } from 'react';
import * as ordersAPI from '../../../services/ordersAPI';
import * as authUtil from '../../../utils/authUtils';
import Loading from '../../../components/Loading';
import { Link, NavLink, useLocation, useSearchParams } from 'react-router-dom';
import config from '../../../configs';
import { BACKGROUND_COLOR_FAILED } from '../../../constants';
import * as messageAction from '../../../redux/features/message/messageSlice';
import { useDispatch } from 'react-redux';
import formatter from '../../../utils/numberFormatter';
import { Breadcrumb } from 'antd';
import { HomeOutlined } from '@mui/icons-material';
const Order = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [orders, setOrders] = useState([]);
    const [orderStates, setOrderStates] = useState([]);
    const fetchOrders = useCallback(async () => {
        setLoading(true);
        let response = await ordersAPI.getAllUserOrders({
            userId: authUtil.getUserId(),
            orderStateId: searchParams.get('type'),
        });
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

        setOrders(response.data?.items);
        response = await ordersAPI.getAllOrderStates();
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
        setOrderStates(response.data.items);
        setLoading(false);
    }, [searchParams]);
    useEffect(() => {
        fetchOrders();
    }, [searchParams]);

    return loading ? (
        <Loading />
    ) : (
        <div className=" max-w-screen-xl mx-auto">
            <Breadcrumb
                className="text-3xl ml-5 mb-5 "
                items={[
                    {
                        title: (
                            <NavLink to={config.routes.home}>
                                <HomeOutlined className="text-4xl text-black" />
                            </NavLink>
                        ),
                    },
                    {
                        title: (
                            <NavLink className={'text-cyan-500'} to={config.routes.orders}>
                                Đơn hàng
                            </NavLink>
                        ),
                    },
                ]}
            />
            <div className="py-8 sm:py-8 bg-white">
                <div className="w-full my-5 p-5 mx-auto mb-3 flex overflow-hidden sticky t-0 bg-white rounded-t-sm">
                    <NavLink
                        className={`cursor-pointer select-none p-4 text-2xl text-black text-center  border-b-2 flex flex-1 overflow-hidden justify-center transition-colors ' +
                        ${
                            location.search === `?type=0` || !location.search.includes('type')
                                ? 'bg-red-300'
                                : 'bg-white'
                        }`}
                        to={`/user/purchase/orders?type=0`}
                    >
                        Tất cả
                    </NavLink>
                    {orderStates.map((os) => {
                        return (
                            <NavLink
                                key={os.orderStateId}
                                className={`cursor-pointer select-none p-4 text-2xl text-black text-center  border-b-2 flex flex-1 overflow-hidden justify-center transition-colors ' +
                                    ${location.search === `?type=${os.orderStateId}` ? 'bg-red-300' : 'bg-white'}`}
                                to={`/user/purchase/orders?type=${os.orderStateId}`}
                            >
                                {os.orderStateName}
                            </NavLink>
                        );
                    })}
                </div>
                {orders.map((order) => {
                    return (
                        <div key={order.orderId} className="mt-16">
                            <div className=" mx-auto sm:px-4 lg:px-8">
                                <div className=" mx-auto space-y-8 sm:px-4 lg:px-0">
                                    <div className="bg-white border-t border-b border-gray-200 shadow-sm sm:rounded-lg sm:border">
                                        <h3 className="sr-only">
                                            Order placed on{' '}
                                            <time dateTime="2021-07-06">{order.dateCreated.split('T')[0]}</time>
                                        </h3>

                                        <div className="flex items-center p-4 border-b border-gray-200 sm:p-6 sm:grid sm:grid-cols-4 sm:gap-x-6">
                                            <dl className="flex-1 grid grid-cols-2 gap-x-6 text-xl sm:col-span-3 sm:grid-cols-3 lg:col-span-2">
                                                <div>
                                                    <dt className="font-medium text-green-600">Order number</dt>
                                                    <dd className="mt-1 text-gray-500">#{order.orderId}</dd>
                                                </div>
                                                <div className="hidden sm:block">
                                                    <dt className="font-medium text-green-600">Date placed</dt>
                                                    <dd className="mt-1 text-gray-500">
                                                        {order.dateCreated.split('T')[0]}
                                                    </dd>
                                                </div>
                                                <div>
                                                    <dt className="font-medium text-green-600">Total amount</dt>
                                                    <dd className="mt-1 font-medium text-gray-900">
                                                        {formatter.format(order.totalPrice)}
                                                    </dd>
                                                </div>
                                            </dl>
                                            <div className="relative flex justify-end lg:hidden">
                                                <div className="flex items-center">
                                                    <button
                                                        type="button"
                                                        className="-m-2 p-2 flex items-center text-gray-400 hover:text-gray-500"
                                                        id="menu-0-button"
                                                        aria-expanded="false"
                                                        aria-haspopup="true"
                                                    >
                                                        <span className="sr-only">
                                                            Options for order #{order.orderId}
                                                        </span>
                                                        <svg
                                                            className="w-6 h-6"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                            aria-hidden="true"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="2"
                                                                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                                                            />
                                                        </svg>
                                                    </button>
                                                </div>
                                                <div
                                                    className="origin-bottom-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                                                    role="menu"
                                                    aria-orientation="vertical"
                                                    aria-labelledby="menu-0-button"
                                                    tabIndex="-1"
                                                >
                                                    <div className="py-1" role="none">
                                                        <Link
                                                            to={`${order.orderId}`}
                                                            className="text-gray-700 block px-4 py-2 text-xl"
                                                        >
                                                            View Detail
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="hidden lg:col-span-2 lg:flex lg:items-center lg:justify-end lg:space-x-4">
                                                <Link
                                                    to={`${order.orderId}`}
                                                    className="flex items-center justify-center bg-white py-2 px-2.5 border border-gray-300 rounded-md shadow-sm text-xl font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                >
                                                    <span>View Detail</span>
                                                    <span className="sr-only">#{order.orderId}</span>
                                                </Link>
                                            </div>
                                            <span className="bg-green-500 py-1 px-2 rounded text-white text-xl w-1/3">
                                                {order.orderStateName}
                                            </span>
                                        </div>

                                        <h4 className="sr-only">Items</h4>
                                        <ul role="list" className="divide-y divide-gray-200">
                                            <li className="p-4 sm:p-6">
                                                <div className="flex items-center sm:items-start">
                                                    <div className="flex-shrink-0 w-20 h-20 bg-gray-200 rounded-lg overflow-hidden sm:w-40 sm:h-40">
                                                        <img
                                                            src={`${process.env.REACT_APP_HOST}${order.orderItems.items[0].productImage}`}
                                                            alt=""
                                                            className="w-full h-full object-center object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex-1 ml-6 text-xl">
                                                        <div className="font-medium text-gray-900 sm:flex sm:justify-between">
                                                            <Link
                                                                to={`/products/${order.orderItems.items[0].productId}`}
                                                                className="text-3xl text-black"
                                                            >
                                                                {order.orderItems.items[0].productName}
                                                            </Link>
                                                            <p className="mt-2 sm:mt-0">
                                                                Total:{' '}
                                                                {formatter.format(order.orderItems.items[0].totalPrice)}
                                                            </p>
                                                        </div>
                                                        <p className="hidden text-gray-500 sm:block sm:mt-2">
                                                            X{' '}
                                                            <span className="text-2xl">
                                                                {order.orderItems.items[0].quantity}
                                                            </span>
                                                        </p>
                                                        <p className="hidden text-gray-500 sm:block sm:mt-2">
                                                            Unit Price:{' '}
                                                            {formatter.format(order.orderItems.items[0].unitPrice)}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="mt-6 sm:flex items-end sm:justify-between">
                                                    {order.dateDone && (
                                                        <div className="flex items-center">
                                                            <svg
                                                                className="w-5 h-5 text-green-500"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                viewBox="0 0 20 20"
                                                                fill="currentColor"
                                                                aria-hidden="true"
                                                            >
                                                                <path
                                                                    fillRule="evenodd"
                                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                                    clipRule="evenodd"
                                                                />
                                                            </svg>
                                                            <p className="ml-2 mt-3 text-xl font-medium text-gray-500">
                                                                Delivered on {new Date(order.dateDone).toLocaleString()}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="text-center text-xl">
                                                    <Link to={`${order.orderId}`} className="">
                                                        See more
                                                    </Link>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Order;
