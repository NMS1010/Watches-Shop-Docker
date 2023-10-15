import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import Loading from '../../../components/Loading';
import Table from '../../../components/Table';
import Alert from '../../../components/Alert';
import OutsideAlerter from '../../../components/OutsideAlerter';
import ModalWrapper from '../../../components/ModalWrapper';
import logoutHandler from '../../../utils/logoutHandler';
import * as authAction from '../../../redux/features/auth/authSlice';
import * as messageAction from '../../../redux/features/message/messageSlice';
import * as reviewsAPI from '../../../services/reviewsAPI';
import { BACKGROUND_COLOR_FAILED, BACKGROUND_COLOR_SUCCESS } from '../../../constants';
import messages from '../../../configs/messages';

const Review = () => {
    const hiddenColumns = ['reviewItemId', 'productId', 'userId', 'userAvatar', 'status', 'dateCreated'];
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [isOutClick, setIsOutClick] = useState(false);
    const [selectedReview, setSelectedReview] = useState(null);
    const [action, setAction] = useState({
        add: false,
        edit: false,
        delete: false,
    });
    const fetchAPI = useCallback(async () => {
        setLoading(true);
        let response = await reviewsAPI.getAllReviews();
        if (!response || !response?.isSuccess) {
            setLoading(true);
            setReviews([]);
            dispatch(
                messageAction.setMessage({
                    id: Math.random(),
                    title: 'Review',
                    message: response?.errors || messages.admin.review.retrieve_err,
                    backgroundColor: BACKGROUND_COLOR_FAILED,
                    icon: '',
                }),
            );
        } else {
            setLoading(false);
            setReviews(response?.data?.items);
        }
    });
    useEffect(() => {
        fetchAPI();
    }, []);
    const handleDeleteReview = (reviewItemId) => {
        const review = reviews.find((val) => val.reviewItemId === reviewItemId);
        setAction({ add: false, edit: false, delete: true });
        setSelectedReview(review);
        setIsOutClick(false);
    };
    const deleteReview = async () => {
        setButtonLoading(true);
        const response = await reviewsAPI.changeStatusReview(selectedReview.reviewItemId);
        setButtonLoading(false);
        setIsOutClick(true);
        if (!response || !response?.isSuccess) {
            if (response.status === 401) {
                await logoutHandler(dispatch, navigate, messageAction, authAction);
            }
            dispatch(
                messageAction.setMessage({
                    id: Math.random(),
                    title: 'Review',
                    message: response?.errors || messages.admin.review.delete_err,
                    backgroundColor: BACKGROUND_COLOR_FAILED,
                    icon: '',
                }),
            );
        } else {
            dispatch(
                messageAction.setMessage({
                    id: Math.random(),
                    title: 'Review',
                    message: messages.admin.review.delete_suc,
                    backgroundColor: BACKGROUND_COLOR_SUCCESS,
                    icon: '',
                }),
            );
            await fetchAPI();
        }
    };
    return (
        <div>
            {loading ? (
                <Loading />
            ) : (
                <>
                    <Table
                        data={reviews}
                        hiddenColumns={hiddenColumns}
                        uniqueField={'reviewItemId'}
                        isAddNew={false}
                        handleDeleteItem={handleDeleteReview}
                    />
                    {action.delete && !isOutClick && (
                        <ModalWrapper>
                            <OutsideAlerter setIsOut={setIsOutClick}>
                                <Alert
                                    title={'Change confirmation'}
                                    content={'Do you want to change this review status?'}
                                    cancelClick={() => setIsOutClick(true)}
                                    confirmClick={() => deleteReview()}
                                    loading={buttonLoading}
                                />
                            </OutsideAlerter>
                        </ModalWrapper>
                    )}
                </>
            )}
        </div>
    );
};

export default Review;
