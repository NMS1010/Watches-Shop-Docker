import { Checkbox, InputNumber, Spin } from 'antd';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BACKGROUND_COLOR_FAILED } from '../../../../constants';
import ModalWrapper from '../../../../components/ModalWrapper';
import Alert from '../../../../components/Alert';
import * as authUtil from '../../../../utils/authUtils';
import * as cartsAPI from '../../../../services/cartsAPI';
import * as cartAction from '../../../../redux/features/cart/cartSlice';
import * as messageAction from '../../../../redux/features/message/messageSlice';
import formatter from '../../../../utils/numberFormatter';

const CartItem = ({ cartItem, cartItems, setCartItems, setSelectedItem, selectedItems }) => {
    let { currentCartAmount } = useSelector((state) => state?.cart);
    const [quantity, setQuantity] = useState(cartItem.quantity);
    const [btnLoading, setBtnLoading] = useState(false);
    const [deleteAlert, setDeleteAlert] = useState(false);
    const dispatch = useDispatch();

    const onRemoveCartItem = async () => {
        setBtnLoading(true);
        const res = await dispatch(cartAction.removeCartItem({ cartItemId: cartItem.cartItemId }));
        if (res?.payload?.isSuccess) {
            setCartItems(cartItems.filter((c) => c.cartItemId !== cartItem.cartItemId));
            if (cartItem.status === 1) {
                setSelectedItem({
                    totalItem: selectedItems.totalItem - 1,
                    totalPayment: selectedItems.totalPayment - cartItem.totalPrice,
                });
            }
        }
        await dispatch(cartAction.setCartAmount(currentCartAmount - 1));
        setBtnLoading(false);
        setDeleteAlert(false);
    };
    const onUpdateCartItem = async (cartItem) => {
        setBtnLoading(true);
        const response = await cartsAPI.updateCartItem(cartItem);
        if (!response || !response.isSuccess) {
            dispatch(
                messageAction.setMessage({
                    id: Math.random(),
                    title: 'Cart',
                    message: response?.errors || 'Cannot connect to server',
                    backgroundColor: BACKGROUND_COLOR_FAILED,
                    icon: '',
                }),
            );
        } else {
            let items = cartItems;
            let index = cartItems.findIndex((c) => c.cartItemId === response.data.cartItem.cartItemId);
            items[index] = response.data.cartItem;
            setCartItems([...items]);
        }
        setBtnLoading(false);
        return response;
    };
    const onChange = async (e) => {
        let isNum = Number.isInteger(e);
        let c = new FormData();
        c.append('userId', authUtil.getUserId());
        c.append('cartItemId', cartItem.cartItemId);
        c.append('quantity', isNum ? e : quantity);
        let status = 0;
        // checkbox is checked
        if (!isNum && e.target.checked) {
            status = 1;
        }
        // change value when checkbox is checked
        if (isNum && cartItem.status === 1) {
            status = 1;
        }
        c.append('status', status);
        let res = await onUpdateCartItem(c);
        if (res && res.isSuccess) {
            isNum && setQuantity(e);
            setSelectedItem({
                totalItem: res.data.totalSelectedItem,
                totalPayment: res.data.totalPaymentPrice,
            });
        }
    };
    return (
        <>
            <div className="mx-0 my-4 row items-center py-5 text-center bg-white rounded-lg">
                <div className="col col-1">
                    <Checkbox onChange={onChange} checked={cartItem.status} />
                </div>
                <div className="col col-3 flex items-center">
                    <img
                        src={`${process.env.REACT_APP_HOST}${cartItem.imageProduct}`}
                        alt="product"
                        className="w-1/4"
                    />
                    <p className="ml-4">{cartItem.productName}</p>
                </div>
                <div className="col col-2">
                    <p>{formatter.format(cartItem.unitPrice)}</p>
                </div>
                <div className="col col-2">
                    {btnLoading ? (
                        <Spin size="large" />
                    ) : (
                        <InputNumber
                            size="large"
                            min={1}
                            value={quantity}
                            defaultValue={cartItem.quantity}
                            onChange={onChange}
                        />
                    )}
                </div>
                <div className="col col-2">
                    <p>{formatter.format(cartItem.totalPrice)}</p>
                </div>
                <div className="col col-2">
                    <FontAwesomeIcon
                        className="text-4xl hover:text-red-500 cursor-pointer transition-all"
                        icon={faTrashCan}
                        onClick={() => {
                            setDeleteAlert(true);
                        }}
                    />
                </div>
            </div>
            {deleteAlert && (
                <ModalWrapper>
                    <Alert
                        title={'Remove Cart Item'}
                        content={'Do you want to remove this item ?'}
                        cancelClick={() => setDeleteAlert(false)}
                        confirmClick={() => {
                            onRemoveCartItem();
                        }}
                        loading={btnLoading}
                    />
                </ModalWrapper>
            )}
        </>
    );
};

export default CartItem;
