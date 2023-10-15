import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as cartAction from '../../../../redux/features/cart/cartSlice';
import * as wishAction from '../../../../redux/features/wish/wishSlice';
import * as authUtil from '../../../../utils/authUtils';
import { useNavigate } from 'react-router-dom';
import formatter from '../../../../utils/numberFormatter';
import config from '../../../../configs';
const ProductCard = ({ product }) => {
    const [hide, setHide] = useState(true);
    const { currentUser, isLogin } = useSelector((state) => state?.auth);
    // const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const addCartItem = () => {
        if (!currentUser) {
            navigate(config.routes.auth);
        }
        const formData = new FormData();
        formData.append('productId', product.productId);
        formData.append('userId', authUtil.getUserId());
        dispatch(cartAction.addCartItem({ cartItem: formData }));
    };
    const addWishItem = () => {
        if (!currentUser) {
            navigate(config.routes.auth);
        }
        const formData = new FormData();
        formData.append('productId', product.productId);
        formData.append('userId', authUtil.getUserId());
        dispatch(wishAction.addWishItem({ wishItem: formData }));
    };
    const getProductDetail = () => {
        navigate(`/products/${product.productId}`);
    };
    return (
        <div
            onMouseEnter={() => setHide(product?.quantity === 0 ? true : false)}
            onMouseLeave={() => setHide(true)}
            className="w-full min-h-full max-w-lg m-auto text-2xl text-center hover:shadow-xl rounded-lg"
        >
            <div className="bg-gray-100 relative overflow-hidden">
                <div
                    className={
                        hide
                            ? 'ease-out duration-300 m-auto absolute right-0 left-0 bg-gray-300 hover:bg-cyan-300'
                            : 'ease-out duration-300 m-auto absolute right-0 left-0 bg-gray-300 hover:bg-cyan-300 top-0'
                    }
                    style={{
                        top: '-6rem',
                        display: 'flex',
                        justifyContent: 'center',
                        padding: '1rem',
                        cursor: 'pointer',
                    }}
                    onClick={addWishItem}
                >
                    <FontAwesomeIcon icon={faHeart} />
                    <p className="ml-2 -mt-1 mb-0">Yêu thích</p>
                </div>

                <img
                    className="m-auto h-80 rounded-t-lg w-fit cursor-pointer"
                    src={`${process.env.REACT_APP_HOST}${product?.imagePath}`}
                />
                {product?.quantity === 0 && (
                    <span className="absolute top-0 left-0 bg-gray-400 p-3 rounded-lg">Out of Stock</span>
                )}
                <div
                    className={
                        hide
                            ? 'ease-out duration-300 m-auto absolute right-0 left-0 bg-gray-300 hover:bg-cyan-300'
                            : 'ease-out duration-300 m-auto absolute right-0 left-0 bg-gray-300 hover:bg-cyan-300 bottom-0'
                    }
                    style={{
                        bottom: '-6rem',
                        display: 'flex',
                        justifyContent: 'center',
                        padding: '1rem',
                        cursor: 'pointer',
                    }}
                    onClick={addCartItem}
                >
                    <FontAwesomeIcon icon={faCartShopping} />
                    <p className="ml-2 -mt-1 mb-0">Thêm vào giỏ hàng</p>
                </div>
            </div>
            <div>
                <ul className="list-disc flex justify-evenly text-2sm mt-3 mb-3">
                    <li className=" cursor-pointer hover:text-cyan-500 ease-in duration-300 font-thin text-xl">{product?.brandName}</li>
                    <li className=" cursor-pointer hover:text-cyan-500 ease-in duration-300 font-thin text-xl">
                        {product?.categoryName}
                    </li>
                </ul>
                <div onClick={getProductDetail} className="text-3xl font-bold">
                    <span className="cursor-pointer font-normal text-2xl hover:text-cyan-500 ease-in duration-300">{product?.name}</span>
                </div>
                <p className="text-cyan-500 mt-3">{formatter.format(product?.price)}</p>
                <div className="flex items-center justify-center mt-2.5 mb-3">
                    <span className="bg-blue-100 text-blue-800 text-2sm font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ml-3">
                        {product?.averageRating || 0}
                    </span>
                    {Array.from(Array(5)).map((val, idx) => {
                        return idx < product?.averageRating ? (
                            <svg
                                aria-hidden="true"
                                className="h-8 text-yellow-300"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                            </svg>
                        ) : (
                            <svg
                                aria-hidden="true"
                                className="h-8 "
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                            </svg>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
