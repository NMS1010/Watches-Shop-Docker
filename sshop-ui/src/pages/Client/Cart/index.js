import { Button, Checkbox } from 'antd';
import { useEffect } from 'react';
import { useState } from 'react';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { BACKGROUND_COLOR_FAILED } from '../../../constants';
import CartItem from '../components/CartItem';
import * as cartsAPI from '../../../services/cartsAPI';
import * as authUtil from '../../../utils/authUtils';
import * as messageAction from '../../../redux/features/message/messageSlice';
import * as cartAction from '../../../redux/features/cart/cartSlice';
import messages from '../../../configs/messages';
import Loading from '../../../components/Loading';
import { Link } from 'react-router-dom';
import config from '../../../configs';
import formatter from '../../../utils/numberFormatter';
const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedItems, setSelectedItem] = useState({
        totalItem: 0,
        totalPayment: 0,
    });
    const dispatch = useDispatch();
    const fetchCart = useCallback(async () => {
        const response = await cartsAPI.getCartByUserId(authUtil.getUserId());
        if (!response || !response?.isSuccess) {
            setLoading(true);
            setCartItems([]);
            dispatch(
                messageAction.setMessage({
                    id: Math.random(),
                    title: 'Cart',
                    message: response?.errors || messages.client.cart.retrieve_err,
                    backgroundColor: BACKGROUND_COLOR_FAILED,
                    icon: '',
                }),
            );
        } else {
            setLoading(false);
            let totalSelected = 0;
            let totalPayment = 0;
            response?.data?.items.forEach((val) => {
                if (val.status === 1) {
                    totalPayment += val.totalPrice;
                    totalSelected += val.status;
                }
            });
            setCartItems(response?.data?.items);
            setSelectedItem({
                totalItem: totalSelected,
                totalPayment: totalPayment,
            });
        }
    }, []);
    useEffect(() => {
        fetchCart();
    }, []);
    const onChange = async (e) => {
        let dt = new FormData();
        dt.append('userId', authUtil.getUserId());
        dt.append('selectAll', e.target.checked);
        const res = await cartsAPI.updateStatusAllCartItem(dt);
        if (res && res.isSuccess) {
            setSelectedItem({
                totalItem: res.data.totalSelectedItem,
                totalPayment: res.data.totalPaymentPrice,
            });
            setCartItems(res.data.cartItems);
        }
    };
    const removeSelectedCartItem = async () => {
        const response = await cartsAPI.deleteSelectedCartItem(authUtil.getUserId());
        if (!response || !response.isSuccess) {
            dispatch(
                messageAction.setMessage({
                    id: Math.random(),
                    title: 'Cart',
                    message: response?.errors || messages.client.cart.retrieve_err,
                    backgroundColor: BACKGROUND_COLOR_FAILED,
                    icon: '',
                }),
            );
        } else {
            setSelectedItem({
                totalItem: response.data.totalSelectedItem,
                totalPayment: response.data.totalPaymentPrice,
            });
            setCartItems(response.data.cartItems);
            await dispatch(cartAction.setCartAmount(response.data.currentCartAmount));
        }
    };
    return (
        <>
            {loading ? (
                <Loading />
            ) : (
                <div>
                    <div className="max-w-screen-xl m-auto">
                        <div className="bg-white py-4 rounded-lg">
                            <div className="row mx-0 text-gray-300 items-center text-center">
                                <div className="col col-1">
                                    <Checkbox
                                        onChange={onChange}
                                        checked={selectedItems.totalItem === cartItems.length && cartItems.length > 0}
                                    />
                                </div>
                                <div className="col col-3">Name</div>
                                <div className="col col-2">Price</div>
                                <div className="col col-2">Quantity</div>
                                <div className="col col-2">Total Price</div>
                                <div className="col col-2">Action</div>
                            </div>
                        </div>

                        {cartItems.map((cartItem) => (
                            <CartItem
                                cartItem={cartItem}
                                cartItems={cartItems}
                                setCartItems={setCartItems}
                                setSelectedItem={setSelectedItem}
                                selectedItems={selectedItems}
                            />
                        ))}
                    </div>
                    {cartItems.length > 0 && (
                        <div className="sticky bottom-0 left-0 right-0 flex max-w-screen-xl m-auto justify-around p-5 border border-t-8 bg-white">
                            <Button className="mr-5" type="primary" danger onClick={() => removeSelectedCartItem()}>
                                Xoá
                            </Button>
                            <div className="flex">
                                <p className="mr-7">
                                    Tổng thanh toán <br />({selectedItems.totalItem} sản phẩm):
                                    <br /> <span>{formatter.format(selectedItems.totalPayment)}</span>
                                </p>
                                <Link to={config.routes.checkout}>
                                    <Button className="ml-7" type="primary" danger>
                                        Thanh toán
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default Cart;
