import { useCallback, useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import * as productsAPI from '../../../services/productsAPI';
import ProductLoading from '../components/ProductLoading';
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
        <div className=" max-w-screen-xl m-auto rounded-lg bg-white">
            <h2 className="capitalize p-8 text-center text-4xl">Watches for you</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-20">
                {loading
                    ? Array.from(Array(8)).map((val, idx) => <ProductLoading key={idx} />)
                    : products.map((product) => <ProductCard key={product.productId} product={product} />)}
            </div>
        </div>
    );
};

export default Home;
