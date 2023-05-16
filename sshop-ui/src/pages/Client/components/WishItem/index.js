import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ModalWrapper from '../../../../components/ModalWrapper';
import Alert from '../../../../components/Alert';
import * as wishAction from '../../../../redux/features/wish/wishSlice';
import * as cartAction from '../../../../redux/features/cart/cartSlice';
import * as authUtil from '../../../../utils/authUtils';
import formatter from '../../../../utils/numberFormatter';

const WishItem = ({ wishItem, wishItems, setWishItems }) => {
    const [btnLoading, setBtnLoading] = useState(false);
    const [deleteAlert, setDeleteAlert] = useState(false);
    let { currentWishAmount } = useSelector((state) => state?.wish);
    const dispatch = useDispatch();

    const onRemoveWishItem = async () => {
        setBtnLoading(true);
        const res = await dispatch(wishAction.removeWishItem({ wishItemId: wishItem.wishItemId }));
        if (res?.payload?.isSuccess) {
            setWishItems(wishItems.filter((w) => w.wishItemId !== wishItem.wishItemId));
        }
        await dispatch(wishAction.setWishAmount(currentWishAmount - 1));
        setBtnLoading(false);
        setDeleteAlert(false);
    };
    const onAddToCart = async () => {
        setBtnLoading(true);
        const formData = new FormData();
        formData.append('productId', wishItem.productId);
        formData.append('userId', authUtil.getUserId());
        await dispatch(cartAction.addCartItem({ cartItem: formData }));
        setBtnLoading(false);
    };
    return (
        <>
            <div className="mx-0 my-4 row items-center py-5 text-center bg-white rounded-lg">
                <div className="col col-3 flex items-center justify-center">
                    <img
                        src={`${process.env.REACT_APP_HOST}${wishItem.productImage}`}
                        alt="product"
                        className="w-1/4"
                    />
                    <p className="ml-4">{wishItem.productName}</p>
                </div>
                <div className="col col-3">
                    <p>{formatter.format(wishItem.unitPrice)}</p>
                </div>
                <div className="col col-3">
                    <p>{wishItem.productStatus}</p>
                </div>
                <div className="col col-3 flex justify-evenly">
                    <FontAwesomeIcon
                        className="text-4xl hover:text-red-500 cursor-pointer transition-all"
                        icon={faTrashCan}
                        onClick={() => {
                            setDeleteAlert(true);
                        }}
                    />
                    <FontAwesomeIcon
                        className="text-4xl hover:text-green-500 cursor-pointer transition-all"
                        icon={faShoppingCart}
                        onClick={() => {
                            onAddToCart();
                        }}
                    />
                </div>
            </div>
            {deleteAlert && (
                <ModalWrapper>
                    <Alert
                        title={'Remove Wish Item'}
                        content={'Do you want to remove this item ?'}
                        cancelClick={() => setDeleteAlert(false)}
                        confirmClick={() => {
                            onRemoveWishItem();
                        }}
                        loading={btnLoading}
                    />
                </ModalWrapper>
            )}
        </>
    );
};

export default WishItem;
