import { Button } from 'antd';
import { useEffect } from 'react';
import { useState } from 'react';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { BACKGROUND_COLOR_FAILED, BACKGROUND_COLOR_SUCCESS } from '../../../constants';
import WishItem from '../components/WishItem';
import * as wishsAPI from '../../../services/wishsAPI';
import * as authUtil from '../../../utils/authUtils';
import * as messageAction from '../../../redux/features/message/messageSlice';
import * as wishAction from '../../../redux/features/wish/wishSlice';
import messages from '../../../configs/messages';
import Loading from '../../../components/Loading';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ModalWrapper from '../../../components/ModalWrapper';
import Alert from '../../../components/Alert';
const WishList = () => {
    const [wishItems, setWishItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteAlert, setDeleteAlert] = useState(false);
    const [btnLoading, setBtnLoading] = useState(false);

    const dispatch = useDispatch();
    const fetchWish = useCallback(async () => {
        const response = await wishsAPI.getWishListByUserId(authUtil.getUserId());
        if (!response || !response?.isSuccess) {
            setLoading(true);
            setWishItems([]);
            dispatch(
                messageAction.setMessage({
                    id: Math.random(),
                    title: 'Wish',
                    message: response?.errors || messages.client.wish.retrieve_err,
                    backgroundColor: BACKGROUND_COLOR_FAILED,
                    icon: '',
                }),
            );
        } else {
            setLoading(false);
            setWishItems(response?.data?.items);
        }
    }, []);
    useEffect(() => {
        fetchWish();
    }, []);
    const onRemoveAllItem = async () => {
        setLoading(true);
        setBtnLoading(true);
        const response = await wishsAPI.deleteAllWishItem(authUtil.getUserId());
        if (!response || !response?.isSuccess) {
            dispatch(
                messageAction.setMessage({
                    id: Math.random(),
                    title: 'Wish',
                    message: response?.errors || messages.client.wish.remove_all_failed,
                    backgroundColor: BACKGROUND_COLOR_FAILED,
                    icon: '',
                }),
            );
        } else {
            dispatch(
                messageAction.setMessage({
                    id: Math.random(),
                    title: 'Wish',
                    message: messages.client.wish.remove_all_success,
                    backgroundColor: BACKGROUND_COLOR_SUCCESS,
                    icon: '',
                }),
            );
            setLoading(false);
            setBtnLoading(false);
            setDeleteAlert(false);
            setWishItems([]);
            dispatch(wishAction.setWishAmount(0));
        }
    };
    return (
        <>
            {loading ? (
                <Loading />
            ) : (
                <div>
                    <div className="max-w-screen-xl m-auto">
                        <Button type="primary" danger className="mb-3" onClick={() => setDeleteAlert(true)}>
                            <FontAwesomeIcon
                                className="text-4xl hover:text-red-500 cursor-pointer transition-all"
                                icon={faTrashCan}
                                onClick={() => {}}
                            />
                        </Button>
                        <div className="bg-white py-4 rounded-lg">
                            <div className="row mx-0 text-gray-300 items-center text-center">
                                <div className="col col-3">Name</div>
                                <div className="col col-3">Price</div>
                                <div className="col col-3">Status</div>
                                <div className="col col-3">Action</div>
                            </div>
                        </div>

                        {wishItems.map((wishItem) => (
                            <WishItem wishItem={wishItem} wishItems={wishItems} setWishItems={setWishItems} />
                        ))}
                    </div>
                </div>
            )}
            {deleteAlert && (
                <ModalWrapper>
                    <Alert
                        title={'Wish list'}
                        content={'Do you want to clear your wish list ?'}
                        cancelClick={() => setDeleteAlert(false)}
                        confirmClick={() => {
                            onRemoveAllItem();
                        }}
                        loading={btnLoading}
                    />
                </ModalWrapper>
            )}
        </>
    );
};
export default WishList;
