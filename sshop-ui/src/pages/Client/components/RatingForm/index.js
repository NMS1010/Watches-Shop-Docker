import { useEffect, useState } from 'react';
import Button from '../../../../components/Button';
import { useCallback } from 'react';
import * as authUtil from '../../../../utils/authUtils';
import * as reviewsAPI from '../../../../services/reviewsAPI';
import * as messageAction from '../../../../redux/features/message/messageSlice';
import { useDispatch } from 'react-redux';
import { BACKGROUND_COLOR_FAILED, BACKGROUND_COLOR_SUCCESS } from '../../../../constants';
import messages from '../../../../configs/messages';
import { OilBarrel } from '@mui/icons-material';
const RatingForm = ({ productId, setReview, orderItem }) => {
    const [loading, setLoading] = useState(false);
    const [btnLoading, setBtnLoading] = useState(false);
    const [reviewItem, setReviewItem] = useState({
        content: '',
        rating: 1,
        reviewItemId: -1,
    });
    const dispatch = useDispatch();
    const [message, setMessage] = useState('');
    const fetchReviewItem = useCallback(async () => {
        setLoading(true);
        let response = await reviewsAPI.getReviewByOrderItem({
            orderItemId: orderItem.orderItemId,
        });
        if (response && response.isSuccess && response.data) {
            let ri = response.data;
            setReviewItem({
                rating: ri.rating,
                content: ri.content,
                reviewItemId: ri.reviewItemId,
            });
        }
        setLoading(false);
    }, []);
    useEffect(() => {
        fetchReviewItem();
    }, []);
    const handleRatingStar = () => {
        return Array.from(Array(5)).map((val, idx) => {
            return (
                <svg
                    key={idx}
                    className={`w-12 h-12 ${idx < reviewItem.rating ? 'text-yellow-500' : 'text-gray-500'}`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    onClick={() =>
                        setReviewItem({
                            ...reviewItem,
                            rating: idx + 1,
                        })
                    }
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            );
        });
    };
    const handleSubmit = async () => {
        if (reviewItem.content.trim() === '') {
            setMessage('Leave your reivew');
            return;
        }
        const reviewFrm = new FormData();
        if (reviewItem.reviewItemId !== -1) reviewFrm.append('reviewItemId', reviewItem.reviewItemId);
        else reviewFrm.append('orderItemId', orderItem.orderItemId);
        reviewFrm.append('productId', productId);
        reviewFrm.append('userId', authUtil.getUserId());
        reviewFrm.append('content', reviewItem.content);
        reviewFrm.append('rating', reviewItem.rating);
        setBtnLoading(true);
        const response =
            reviewItem.reviewItemId !== -1
                ? await reviewsAPI.updateReview(reviewFrm)
                : await reviewsAPI.createReview(reviewFrm);
        let msg = {
            id: Math.random(),
            title: 'Review',
            message: '',
            backgroundColor: '',
            icon: '',
        };
        if (!response?.isSuccess) {
            msg.message = response?.errors?.join('\n');
            msg.backgroundColor = BACKGROUND_COLOR_FAILED;
        } else {
            msg.message = messages.client.review.succ;
            msg.backgroundColor = BACKGROUND_COLOR_SUCCESS;

            setReview({
                productId: -1,
                click: false,
            });
        }
        dispatch(messageAction.setMessage(msg));
        setBtnLoading(false);
    };
    return (
        <div className="py-3 sm:max-w-xl sm:mx-auto">
            <div className="bg-white min-w-1xl flex flex-col rounded-xl shadow-lg">
                <div className="px-12 py-5">
                    <h2 className="text-gray-800 text-3xl font-semibold">Your opinion matters to us!</h2>
                </div>
                <div className="bg-gray-200 w-full flex flex-col items-center">
                    <div className="flex flex-col items-center py-6 space-y-3">
                        <span className="text-lg text-gray-800">How was quality of this product ?</span>
                        <div className="flex space-x-3">{handleRatingStar()}</div>
                    </div>
                    <div className="w-3/4 flex flex-col">
                        <textarea
                            rows="3"
                            className="p-4 text-gray-500 rounded-xl resize-none"
                            onChange={(e) => setReviewItem({ ...reviewItem, content: e.target.value })}
                            value={reviewItem.content}
                        >
                            {reviewItem.content}
                        </textarea>
                        <p className="my-4 text-red-400">{message}</p>
                        <Button
                            className="py-3 my-8 text-lg text-center bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl text-white"
                            loading={btnLoading}
                            onClick={handleSubmit}
                        >
                            Rate now
                        </Button>
                    </div>
                </div>
                <div className="h-20 flex items-center justify-center">
                    <button
                        className="text-gray-600"
                        onClick={() =>
                            setReview({
                                productId: -1,
                                click: false,
                            })
                        }
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RatingForm;
