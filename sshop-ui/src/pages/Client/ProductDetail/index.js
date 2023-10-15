import { useEffect } from 'react';
import { useCallback } from 'react';
import { useState } from 'react';
import { Link, NavLink, useNavigate, useParams } from 'react-router-dom';
import * as productsAPI from '../../../services/productsAPI';
import * as authUtil from '../../../utils/authUtils';
import { Breadcrumb, InputNumber, Menu } from 'antd';
import Loading from '../../../components/Loading';
import { useDispatch, useSelector } from 'react-redux';
import * as cartAction from '../../../redux/features/cart/cartSlice';
import * as wishAction from '../../../redux/features/wish/wishSlice';
import ReactHtmlParser from 'react-html-parser';
import formatter from '../../../utils/numberFormatter';
import config from '../../../configs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faAngleRight,
    faCartShopping,
    faCodeCommit,
    faRefresh,
    faRightLong,
    faShield,
    faTruck,
} from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { faFacebook, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { HomeOutlined, ShopOutlined, VerifiedUserOutlined } from '@mui/icons-material';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import sprite from '../../../assets/images/common/sprite.svg';

const NAV_KEY = {
    DESCRIPTION: 'description',
    REVIEW: 'review',
    DETAIL: 'detail',
};

const ProductDetail = () => {
    const { productId } = useParams();
    const { currentUser, isLogin } = useSelector((state) => state?.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [navSelectedKey, setNavSelectedKey] = useState(NAV_KEY.DESCRIPTION);
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
                let clss = 'bg-indigo-600 rounded-lg h-2 ';
                let obj = {
                    count: count,
                    percent: ((count / total) * 100).toPrecision(3),
                    widthClass: clss,
                };
                arr.push(obj);
            });
            setReviewStatistic(arr);
        }
    }, [loading]);
    const addToCart = () => {
        if (!currentUser) {
            navigate(config.routes.auth);
        }
        const formData = new FormData();
        formData.append('productId', productId);
        formData.append('quantity', quantity);
        formData.append('userId', authUtil.getUserId());
        dispatch(cartAction.addCartItem({ cartItem: formData }));
    };
    const addToWish = () => {
        if (!currentUser) {
            navigate(config.routes.auth);
        }
        const formData = new FormData();
        formData.append('productId', productId);
        formData.append('userId', authUtil.getUserId());
        dispatch(wishAction.addWishItem({ wishItem: formData }));
    };
    return loading ? (
        <Loading />
    ) : (
        <div className="max-w-screen-xl m-auto">
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
                            <NavLink className={'text-black'} to={config.routes.shop}>
                                Cửa hàng
                            </NavLink>
                        ),
                    },
                    {
                        title: <p className="text-black">{product.brandName}</p>,
                    },
                    {
                        title: <p className="text-cyan-600">{product.name}</p>,
                    },
                ]}
            />
            <div className="flex">
                <section className="text-gray-700 body-font overflow-hidden bg-white rounded-3xl">
                    <div className="container px-5 py-24 mx-auto">
                        <div className="mx-auto flex ">
                            {/* <Carousel className="w-1/2 p-5" activeIndex={index} onSelect={handleSelect} interval={1000}>
                                {product.subImages.items.map((p) => (
                                    <Carousel.Item>
                                        <img
                                            alt="img"
                                            className="object-cover object-center rounded border border-gray-200 w-full"
                                            src={`${process.env.REACT_APP_HOST}${p.image}`}
                                        />
                                    </Carousel.Item>
                                ))}
                            </Carousel> */}
                            <Carousel swipeable  className="w-1/2 p-5" autoPlay  useKeyboardArrows={true}>
                                {product.subImages.items.map((p, index) => (
                                    <div className="slide" key={index}>
                                        <img src={`${process.env.REACT_APP_HOST}${p.image}`} />
                                    </div>
                                ))}
                            </Carousel>
                            <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
                                <h1 className="text-gray-900 my-2 text-5xl title-font font-light">{product.name}</h1>
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
                                                    stroke="white"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    className="w-8 h-8 text-yellow-500"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                                                </svg>
                                            );
                                        })}

                                        <span className="text-red-600 ml-3">
                                            {product.productReview.items.length} đánh giá
                                        </span>
                                    </span>
                                </div>

                                <div className="flex mt-5 items-center">
                                    <span className="title-font font-medium text-5xl text-red-900">
                                        {formatter.format(product.price)}
                                    </span>
                                </div>
                                <div className="flex flex-col mt-5">
                                    <div className="flex items-center justify-start">
                                        <span className="font-thin text-2xl">Số lượng: </span>
                                        <InputNumber
                                            className="ml-8"
                                            size="large"
                                            min={1}
                                            value={quantity}
                                            defaultValue={1}
                                            onChange={(e) => setQuantity(e)}
                                        />
                                    </div>
                                    <div className="flex items-center mt-4">
                                        <button
                                            onClick={addToCart}
                                            className=" border border-cyan-400 text-cyan-600 font-thin py-3 px-6 focus:outline-none hover:bg-cyan-600 hover:text-white transition-all rounded-xl"
                                        >
                                            <FontAwesomeIcon className="mr-2" icon={faCartShopping} />
                                            Thêm vào giỏ hàng
                                        </button>
                                        <button
                                            onClick={addToWish}
                                            className="ml-16 bg-transparent p-0 border-0 inline-flex items-center justify-center hover:text-red-500 transition-all"
                                        >
                                            <FontAwesomeIcon
                                                className="hover:text-red-500 animate-pulse w-10 h-10 text-red-500"
                                                icon={faHeart}
                                            />
                                            <span className="font-thin ml-3">Thêm vào yêu thích</span>
                                        </button>
                                    </div>
                                </div>
                                <div className="mt-16 pt-8 border-t-2">
                                    <div className="flex items-center">
                                        <div className="flex items-center">
                                            <p className="text-2xl font-extralight">Phân loại: </p>
                                            <p className="text-2xl ml-3 cursor-pointer text-cyan-500 hover:text-cyan-500  ease-in duration-300 font-thin ">
                                                {product?.categoryName}
                                            </p>
                                        </div>
                                        <span className="before:content-baseline mx-2 mb-3">|</span>
                                        <div className="flex items-center">
                                            <p className="text-2xl font-extralight">Thương hiệu: </p>
                                            <p className="text-3xl ml-3 cursor-pointer text-cyan-500 hover:text-cyan-500  ease-in duration-300 font-thin ">
                                                {product?.brandName}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <p className="text-2xl mb-0 font-extralight">Chia sẻ: </p>
                                        <div className="flex">
                                            <div
                                                style={{ padding: '0.6rem' }}
                                                className="border mx-2 transition-all cursor-pointer hover:text-cyan-500 hover:border-cyan-500 w-16 h-16 rounded-full text-3xl"
                                            >
                                                <FontAwesomeIcon style={{ fontSize: '2.6rem' }} icon={faFacebook} />
                                            </div>
                                            <div
                                                style={{ padding: '0.6rem' }}
                                                className="border mx-2 transition-all cursor-pointer hover:text-cyan-500 hover:border-cyan-500 w-16 h-16 rounded-full text-3xl"
                                            >
                                                <FontAwesomeIcon style={{ fontSize: '2.6rem' }} icon={faTwitter} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="text-center">
                        <Menu
                            className="justify-center text-3xl border-b-0"
                            mode="horizontal"
                            selectedKeys={navSelectedKey}
                            onClick={(e) => setNavSelectedKey(e.key)}
                        >
                            <Menu.Item className="after:-bottom-3" key={NAV_KEY.DESCRIPTION}>
                                Mô tả sản phẩm
                            </Menu.Item>
                            <Menu.Item className="after:-bottom-3" key={NAV_KEY.DETAIL}>
                                Thông tin chi tiết
                            </Menu.Item>
                            <Menu.Item className="after:-bottom-3" key={NAV_KEY.REVIEW}>
                                Đánh giá ({product?.productReview?.items.length})
                            </Menu.Item>
                        </Menu>
                    </div>
                    <div>
                        {navSelectedKey === NAV_KEY.DESCRIPTION && (
                            <div className="mt-20 bg-white py-12 px-4 md:px-6 2xl:px-0 2xl:container 2xl:mx-auto flex justify-center items-center  rounded-3xl ">
                                <div className="flex  w-full space-y-8">
                                    <div className="mx-32 font-thin">{ReactHtmlParser(product.description)}</div>
                                </div>
                            </div>
                        )}
                        {navSelectedKey === NAV_KEY.DETAIL && (
                            <div className="mt-20 bg-white py-12 px-4 md:px-6 2xl:px-0 2xl:container 2xl:mx-auto flex justify-center items-center  rounded-3xl ">
                                <div className="flex justify-center w-full space-y-8">
                                    <p className="text-3xl text-red-300 ">Không có thông tin cho sản phẩm</p>
                                </div>
                            </div>
                        )}
                        {navSelectedKey === NAV_KEY.REVIEW && (
                            <div className="mt-20 bg-white py-12 px-4 md:px-6 2xl:px-0 2xl:container 2xl:mx-auto flex justify-center items-center  rounded-3xl ">
                                {product?.productReview?.items.length > 0 && (
                                    <div className="flex flex-col justify-start items-start w-full space-y-8">
                                        <div className="flex font-thin w-full justify-around">
                                            <div className="mx-10 bg-white shadow-lg rounded-lg px-4 py-4 w-1/2 ">
                                                <div className="mb-1 tracking-wide px-4 py-4">
                                                    <h2 className="text-gray-800 font-semibold mt-1 text-center">
                                                        {product.productReview.items.length} đánh giá
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
                                                                            <div
                                                                                style={{
                                                                                    width: `${
                                                                                        isNaN(val.percent)
                                                                                            ? 0
                                                                                            : val.percent
                                                                                    }%`,
                                                                                }}
                                                                                className={val.widthClass}
                                                                            ></div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="w-1/5 text-gray-700 pl-3">
                                                                        <span className="text-lg">
                                                                            {isNaN(val.percent) ? 0 : val.percent} %
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="ml-6 w-full flex justify-start items-start flex-col p-8">
                                                {product?.productReview?.items.map((productRv) => {
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
                                                                            {new Date(
                                                                                productRv.dateUpdated,
                                                                            ).toLocaleString()}
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
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {product?.productReview?.items.length === 0 && (
                                    <p className="text-3xl text-red-300 ">Không có đánh giá cho sản phẩm này</p>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="my-5">
                        <h2 className="p-8 text-center font-normal uppercase text-4xl">Có thể bạn quan tâm</h2>
                        <p className="text-center text-red-400 my-2">Comming soon....</p>
                    </div>
                </section>
                <section className="bg-white ml-9 rounded-3xl max-h-96">
                    <div className="m-3 p-3">
                        <h2 className="text-2xl font-normal">Chính sách bán hàng</h2>
                        <div className="flex items-center">
                            <FontAwesomeIcon className="text-cyan-600" icon={faTruck} />
                            <p className="font-thin ml-2 mb-0">Miễn phí giao hàng cho đơn hàng từ 5 triệu</p>
                        </div>
                        <div className="flex items-center my-4">
                            <FontAwesomeIcon className="text-cyan-600" icon={faShield} />
                            <p className="font-thin ml-2 mb-0">Cam kết hàng chính hãng 100% </p>
                        </div>
                        <div className="flex items-center">
                            <FontAwesomeIcon className="text-cyan-600" icon={faRefresh} />
                            <p className="font-thin ml-2 mb-0">Đổi trả trong vòng 10 ngày </p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};
export default ProductDetail;
