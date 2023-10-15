import { useCallback, useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import * as productsAPI from '../../../services/productsAPI';
import ProductLoading from '../components/ProductLoading';
import { NavLink } from 'react-router-dom';
import config from '../../../configs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faForward, faRepeat, faRightLong } from '@fortawesome/free-solid-svg-icons';
const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const fetchProducts = useCallback(async () => {
        setLoading(true);
        const response = await productsAPI.getAllProducts({ pageSize: 8 });
        if (!response || !response?.isSuccess) {
            setLoading(true);
            setProducts([]);
        } else {
            setLoading(false);
            setProducts(response?.data?.items);
        }
    }, []);
    useEffect(() => {
        fetchProducts();
    }, []);
    return (
        <div className=" max-w-screen-xl m-auto rounded-lg bg-white p-5">
            <div>
                <h2 className="p-8 text-center font-thin uppercase text-4xl">Sản phẩm mới</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-20">
                    {loading
                        ? Array.from(Array(8)).map((val, idx) => <ProductLoading key={idx} />)
                        : products.map((product) => <ProductCard key={product.productId} product={product} />)}
                </div>
                <div className="text-center">
                    <NavLink
                        to={config.routes.shop}
                        className="p-4 text-2xl transition-all text-black bg-white border uppercase font-thin hover:bg-cyan-200"
                    >
                        Xem thêm sản phẩm
                        <FontAwesomeIcon className='ml-2' icon={faRepeat} />
                    </NavLink>
                </div>
            </div>
            <div>
                <h2 className="p-8 text-center font-bold uppercase text-4xl mt-5">Bài viết gần đây</h2>
                <p className="text-center text-red-400 my-2">Comming soon....</p>
                <div className="text-center mt-16">
                    <NavLink
                        to={config.routes.shop}
                        className="p-4 text-2xl transition-all text-black bg-white border uppercase font-thin hover:bg-cyan-200"
                    >
                        Xem thêm bài viết
                        <FontAwesomeIcon className='ml-2' icon={faRightLong} />
                    </NavLink>
                </div>
            </div>
        </div>
    );
};

export default Home;
