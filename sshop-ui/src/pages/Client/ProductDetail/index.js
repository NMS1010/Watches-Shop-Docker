import { useEffect } from 'react';
import { useCallback } from 'react';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import * as productsAPI from '../../../services/productsAPI';
import Carousel from 'react-bootstrap/Carousel';
import * as authUtil from '../../../utils/authUtils';
import { InputNumber } from 'antd';
import Loading from '../../../components/Loading';
import { useDispatch } from 'react-redux';
import * as cartAction from '../../../redux/features/cart/cartSlice';
import * as wishAction from '../../../redux/features/wish/wishSlice';
import ReactHtmlParser from 'react-html-parser';
import formatter from '../../../utils/numberFormatter';
const ProductDetail = () => {
    const { productId } = useParams();
    const dispatch = useDispatch();
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [product, setProduct] = useState(null);
    const [index, setIndex] = useState(0);
    const [reviewStatistic, setReviewStatistic] = useState([]);
    const handleSelect = (selectedIndex, e) => {
        setIndex(selectedIndex);
    };
    const fetchProduct = useCallback(async () => {
        setLoading(true);
        const response = await productsAPI.getProductById(productId);
        if (!response || !response.isSuccess) {
        } else {
            setLoading(false);
            setProduct(response.data);
        }
    }, [productId]);

    useEffect(() => {
        fetchProduct();
    }, [productId]);
    useEffect(() => {
        if (!loading) {
            let arr = [];
            const total = product.productReview.items.length;
            Array.from(Array(5)).forEach((val, idx) => {
                let count = product.productReview.items.filter((rv) => rv.rating === idx + 1).length;
                let width = Math.round((count * 12) / total);
                let clss = 'bg-indigo-600 rounded-lg h-2 ';
                let obj = {
                    count: count,
                    percent: ((count / total) * 100).toPrecision(3),
                    widthClass: width > 0 && clss + `w-${width}/12`,
                };
                arr.push(obj);
            });
            setReviewStatistic(arr);
        }
    }, [loading]);
    const addToCart = () => {
        const formData = new FormData();
        formData.append('productId', productId);
        formData.append('quantity', quantity);
        formData.append('userId', authUtil.getUserId());
        dispatch(cartAction.addCartItem({ cartItem: formData }));
    };
    const addToWish = () => {
        const formData = new FormData();
        formData.append('productId', productId);
        formData.append('userId', authUtil.getUserId());
        dispatch(wishAction.addWishItem({ wishItem: formData }));
    };
    return loading ? (
        <Loading />
    ) : (
        <div className="max-w-screen-xl m-auto">
            <section className="text-gray-700 body-font overflow-hidden bg-white rounded-3xl ">
                <div className="container px-5 py-24 mx-auto">
                    <div className="lg:w-4/5 mx-auto flex flex-wrap">
                        <Carousel className="w-1/2 p-5" activeIndex={index} onSelect={handleSelect} interval={1000}>
                            {product.subImages.items.map((p) => (
                                <Carousel.Item>
                                    <img
                                        alt="img"
                                        className="object-cover object-center rounded border border-gray-200 w-full"
                                        src={`${process.env.REACT_APP_HOST}${p.image}`}
                                    />
                                </Carousel.Item>
                            ))}
                        </Carousel>
                        <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
                            <h2 className="text-2xl title-font text-gray-500 tracking-widest mb-0">
                                {product.brandName}
                            </h2>
                            <h1 className="mb-3">
                                <Link className="text-blue-300 text-2xl tracking-widest">{product.categoryName}</Link>
                            </h1>
                            <h1 className="text-gray-900 text-5xl title-font font-medium mb-1">{product.name}</h1>
                            <div className="flex mb-4">
                                <span className="flex items-center">
                                    {Array.from(Array(5)).map((val, idx) => {
                                        let currentColor = '';
                                        if (idx < product.averageRating) {
                                            currentColor = 'currentColor';
                                        }
                                        return (
                                            <svg
                                                fill={currentColor}
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                className="w-6 h-6 text-yellow-500"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                                            </svg>
                                        );
                                    })}

                                    <span className="text-gray-600 ml-3">
                                        {product.productReview.items.length} reviews
                                    </span>
                                </span>
                            </div>

                            <div className="flex mt-5 items-center">
                                <span className="title-font font-medium text-2xl text-gray-900">
                                    {formatter.format(product.price)}
                                </span>
                                <button
                                    onClick={addToWish}
                                    className="rounded-full ml-auto w-20 h-20 bg-gray-200 p-0 border-0 inline-flex items-center justify-center text-gray-500"
                                >
                                    <svg
                                        fill="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        className="w-10 h-10"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path>
                                    </svg>
                                </button>
                            </div>
                            <div className="flex mt-5">
                                <InputNumber
                                    className="mr-5"
                                    size="large"
                                    min={1}
                                    value={quantity}
                                    defaultValue={1}
                                    onChange={(e) => setQuantity(e)}
                                />
                                <button
                                    onClick={addToCart}
                                    className=" text-white bg-red-500 border-0 py-2 px-6 focus:outline-none hover:bg-red-600 rounded"
                                >
                                    Add to cart
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <div className="mt-20 bg-white py-12 px-4 md:px-6 2xl:px-0 2xl:container 2xl:mx-auto flex justify-center items-center  rounded-3xl ">
                <div className="flex flex-col justify-start items-start w-full space-y-8">
                    <p className="w-full text-center text-3xl lg:text-4xl font-semibold leading-7 lg:leading-9 text-gray-800 dark:text-white ">
                        Description
                    </p>

                    <div className="w-full">{ReactHtmlParser(product.description)}</div>
                </div>
            </div>
            <div className="mt-20 bg-white py-12 px-4 md:px-6 2xl:px-0 2xl:container 2xl:mx-auto flex justify-center items-center  rounded-3xl ">
                <div className="flex flex-col justify-start items-start w-full space-y-8">
                    <p className="w-full text-center text-3xl lg:text-4xl font-semibold leading-7 lg:leading-9 text-gray-800 dark:text-white ">
                        Customer reviews
                    </p>

                    <div className="flex w-full justify-around">
                        <div className="mx-10 bg-white shadow-lg rounded-lg px-4 py-4 w-1/2 ">
                            <div className="mb-1 tracking-wide px-4 py-4">
                                <h2 className="text-gray-800 font-semibold mt-1 text-center">
                                    {product.productReview.items.length} reviews
                                </h2>
                                <div className="border-b -mx-8 px-8 pb-3">
                                    {reviewStatistic.map((val, idx) => {
                                        return (
                                            <div key={idx} className="flex items-center mt-1">
                                                <div className=" w-1/5 text-indigo-500 tracking-tighter">
                                                    <div className="flex">
                                                        <span>{idx + 1}</span>
                                                        <svg
                                                            className="ml-3 w-8 h-8 text-yellow-500"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor"
                                                        >
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="w-3/5">
                                                    <div className="bg-gray-300 w-full rounded-lg h-2">
                                                        <div className={val.widthClass}></div>
                                                    </div>
                                                </div>
                                                <div className="w-1/5 text-gray-700 pl-3">
                                                    <span className="text-lg">{val.percent} %</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                        <div className="ml-6 w-full flex justify-start items-start flex-col p-8">
                            {product.productReview.items.length > 0 ? (
                                product.productReview.items.map((productRv) => {
                                    return (
                                        <>
                                            <div className="flex flex-col md:flex-row justify-between w-full ">
                                                <div className="mt-6 flex justify-start items-center flex-row space-x-2.5">
                                                    <div>
                                                        <img
                                                            className="w-20 h-20 rounded-full "
                                                            src={`${process.env.REACT_APP_HOST}${productRv.userAvatar}`}
                                                            alt="avatar"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col justify-start items-start space-y-2">
                                                        <p className="text-3xl font-medium leading-none text-gray-800 dark:text-white">
                                                            {productRv.userName}
                                                        </p>
                                                        <p className="text-xl leading-none text-gray-600 dark:text-white">
                                                            {new Date(productRv.dateUpdated).toLocaleString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="cursor-pointer flex mt-2 md:mt-0">
                                                    {Array.from(Array(5)).map((val, idx) => {
                                                        return (
                                                            <svg
                                                                key={idx}
                                                                className={`w-12 h-12 ${
                                                                    idx < productRv.rating
                                                                        ? 'text-yellow-500'
                                                                        : 'text-gray-500'
                                                                }`}
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                viewBox="0 0 20 20"
                                                                fill="currentColor"
                                                            >
                                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                            </svg>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                            <div id="menu" className="md:block">
                                                <p className="mt-3 text-2xl leading-normal text-gray-600 dark:text-white w-full">
                                                    {productRv.content}
                                                </p>
                                            </div>
                                        </>
                                    );
                                })
                            ) : (
                                <h2 className="text-3xl">No reviews</h2>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default ProductDetail;
