import { useCallback, useEffect, useState } from 'react';
import MultiRangeSlider from '../components/MultiRangeSlider';
import * as brandsAPI from '../../../services/brandsAPI';
import * as categoriesAPI from '../../../services/categoriesAPI';
import * as productsAPI from '../../../services/productsAPI';
import ProductLoading from '../components/ProductLoading';
import ProductCard from '../components/ProductCard';
import { InputGroup } from 'react-bootstrap';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useDebounce from '../../../hooks/useDebounce';
import {
    PAGE_SIZE,
    SORT_PRODUCTS,
    DEFAULT_PAGE_SIZE,
    MAX_FILTER_PRICE,
    MIN_FILTER_PRICE,
    STEP_FILTER_PRICE,
} from '../../../constants';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import useNavigateSearch from '../../../hooks/useNavigateSearch';
import { Checkbox, FormControlLabel } from '@mui/material';
import formatter from '../../../utils/numberFormatter';

const Shop = () => {
    const [searchVal, setSearchVal] = useState('');
    const [sortVal, setSortVal] = useState({ key: 0, value: 'Name A-Z', param: 'name_a_z' });
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [paging, setPaging] = useState({
        pageIndex: 1,
        pageSize: DEFAULT_PAGE_SIZE,
        totalItem: null,
        totalPage: null,
    });
    const [filters, setFilters] = useState({
        categoryIds: [],
        brandIds: [],
        minPrice: MIN_FILTER_PRICE,
        maxPrice: MAX_FILTER_PRICE,
    });
    const fetchAll = useCallback((getFunc, setFunc) => {
        return (async () => {
            const response = await getFunc();
            if (response && response.isSuccess) {
                setFunc(response.data.items);
            }
        })();
    }, []);
    useEffect(() => {
        fetchAll(brandsAPI.getAllBrands, setBrands);
        fetchAll(categoriesAPI.getAllCategories, setCategories);
    }, []);

    const debouncedSearchVal = useDebounce(searchVal);
    const debouncedFiltersVal = useDebounce(filters);
    const navigateSearch = useNavigateSearch();
    useEffect(() => {
        setLoading(true);
        (async () => {
            const params = new URLSearchParams();
            params.append('keyword', debouncedSearchVal);
            params.append('sortBy', sortVal.key);
            params.append('pageIndex', debouncedSearchVal ? 1 : paging.pageIndex);
            params.append('pageSize', paging.pageSize);
            filters.categoryIds.forEach((id) => params.append('categoryIds', id));
            filters.brandIds.forEach((id) => params.append('brandIds', id));
            params.append('minPrice', filters.minPrice);
            params.append('maxPrice', filters.maxPrice);

            const response = await productsAPI.getAllProducts(params);
            if (response && response.isSuccess) {
                setProducts(response.data.items);
                setPaging({
                    ...paging,
                    totalItem: response.data.totalItem,
                    totalPage: Math.ceil(response.data.totalItem / paging.pageSize),
                });
                setLoading(false);
            }
        })();
    }, [debouncedSearchVal, sortVal, paging.pageIndex, paging.pageSize, debouncedFiltersVal]);
    const handleChange = (e) => {
        setSearchVal(e.target.value);
    };
    return (
        <div className=" max-w-screen-xl m-auto bg-white rounded-lg">
            <div className="row p-5">
                <div className="col-3">
                    <div className="flex items-center justify-between">
                        <h2 className="capitalize p-8 text-2xl">Filters</h2>
                        <a className="cursor-pointer text-2xl mb-1 text-yellow-600">Clear all</a>
                    </div>
                    <div>
                        <h2 className="text-yellow-600 capitalize p-8 text-2xl border-t-2 mt-5">Price</h2>
                        <MultiRangeSlider
                            step={STEP_FILTER_PRICE}
                            min={MIN_FILTER_PRICE}
                            max={MAX_FILTER_PRICE}
                            onChange={({ min, max }) => {
                                setFilters({ ...filters, maxPrice: max, minPrice: min });
                            }}
                        />
                        <div className="flex mt-5 justify-evenly text-xl text-center">
                            <div className="bg-red-300 p-3 rounded-xl">
                                <span>FROM</span>
                                <br></br>
                                <span className="font-bold">{formatter.format(filters.minPrice)}</span>
                            </div>
                            <div className="bg-red-300 p-3 rounded-xl">
                                <span>TO </span>
                                <br></br>
                                <span className="font-bold">{formatter.format(filters.maxPrice)}</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-yellow-600 capitalize p-8 text-2xl border-t-2 mt-5">Categories</h2>
                        <div className="flex flex-col ml-8">
                            {categories.map((category) => {
                                return (
                                    <FormControlLabel
                                        value="end"
                                        sx={{
                                            '& .MuiSvgIcon-root': { fontSize: 20 },
                                            '& .MuiTypography-root': { fontSize: 14 },
                                        }}
                                        control={
                                            <Checkbox
                                                className="text-3xl"
                                                color="warning"
                                                onClick={(e) => {
                                                    let categoryIds;
                                                    if (e.target.checked) {
                                                        categoryIds = [...filters.categoryIds, category.categoryId];
                                                    } else {
                                                        categoryIds = filters.categoryIds.filter(
                                                            (id) => id !== category.categoryId,
                                                        );
                                                    }
                                                    setFilters({
                                                        ...filters,
                                                        categoryIds: [...categoryIds],
                                                    });
                                                }}
                                            />
                                        }
                                        label={`${category.name} (${category.totalProduct})`}
                                        labelPlacement="end"
                                    />
                                );
                            })}
                        </div>
                    </div>
                    <div>
                        <h2 className="text-yellow-600 capitalize p-8 text-2xl border-t-2 mt-5">Brands</h2>
                        <div className="flex flex-col ml-8">
                            {brands.map((brand) => {
                                return (
                                    <FormControlLabel
                                        value="end"
                                        sx={{
                                            '& .MuiSvgIcon-root': { fontSize: 20 },
                                            '& .MuiTypography-root': { fontSize: 14 },
                                        }}
                                        control={
                                            <Checkbox
                                                className="text-3xl"
                                                color="warning"
                                                onClick={(e) => {
                                                    let brandIds;
                                                    if (e.target.checked) {
                                                        brandIds = [...filters.brandIds, brand.brandId];
                                                    } else {
                                                        brandIds = filters.brandIds.filter(
                                                            (id) => id !== brand.brandId,
                                                        );
                                                    }
                                                    setFilters({
                                                        ...filters,
                                                        brandIds: [...brandIds],
                                                    });
                                                }}
                                            />
                                        }
                                        label={`${brand.brandName} (${brand.totalProduct})`}
                                        labelPlacement="end"
                                    />
                                );
                            })}
                        </div>
                    </div>
                </div>
                <div className="col-9 px-5">
                    <h1 className="mb-5">Products</h1>
                    <div className="flex pb-5 justify-between ">
                        <InputGroup className="mb-3 w-1/2">
                            <InputGroup.Text className="bg-white">
                                <FontAwesomeIcon className="p-3 text-2xl" icon={faSearch} />
                            </InputGroup.Text>
                            <input
                                type={'text'}
                                className="border flex-grow-1 focus:ring-0 p-3 border-1 border-solid border-slate-500 rounded-r-lg text-xl"
                                placeholder="Search for product...."
                                onChange={handleChange}
                            />
                        </InputGroup>
                        <div className="flex ">
                            <div className="group inline-block relative w-max">
                                <button className="bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded inline-flex items-center">
                                    <span className="mr-1">{sortVal.value}</span>

                                    <svg
                                        className="fill-current h-4 w-4"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                    </svg>
                                </button>
                                <ul className="p-0 absolute hidden text-gray-700 pt-1 group-hover:block z-10 text-center w-full">
                                    {SORT_PRODUCTS.map((data) => {
                                        return (
                                            <li key={data.key} className="">
                                                <Link
                                                    className={`text-yellow-500 bg-gray-200 hover:bg-gray-400 py-2 px-4 block whitespace-no-wrap ${data.key ===
                                                        sortVal.key && 'bg-amber-500 text-white'}`}
                                                    onClick={() => {
                                                        setSortVal({
                                                            key: data.key,
                                                            value: data.value,
                                                            param: data.param,
                                                        });
                                                        setPaging({ ...paging, pageIndex: 1 });
                                                    }}
                                                >
                                                    {data.value}
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                            <div className="ml-3 mr-3"></div>
                            <div className="group inline-block relative">
                                <button className="bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded inline-flex items-center w-max">
                                    <span className="mr-1">{`Show ${paging.pageSize}`}</span>

                                    <svg
                                        className="fill-current h-4 w-4"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                    </svg>
                                </button>
                                <ul className="p-0 absolute hidden text-gray-700 pt-1 group-hover:block z-10 text-center w-full">
                                    {PAGE_SIZE.map((val) => {
                                        return (
                                            <li
                                                key={val}
                                                className={`cursor-pointer text-yellow-500 bg-gray-200 hover:bg-gray-400 py-2 px-4 block whitespace-no-wrap ${val ===
                                                    paging.pageSize && 'bg-amber-500 text-white'}`}
                                                onClick={() => {
                                                    setPaging({ ...paging, pageSize: val });
                                                }}
                                            >
                                                {val}
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        {loading
                            ? Array.from(Array(6)).map((val) => (
                                  <div key={val} className="col-4">
                                      <ProductLoading />
                                  </div>
                              ))
                            : products.map((product) => (
                                  <div key={product.productId} className="col-4">
                                      <ProductCard key={product.productId} product={product} />
                                  </div>
                              ))}
                    </div>
                    {products.length > 0 && (
                        <div className="flex flex-col items-center my-12">
                            <ReactPaginate
                                pageCount={paging.totalPage}
                                containerClassName={'flex text-gray-700'}
                                nextLabel=">"
                                breakLabel="..."
                                previousLabel="<"
                                pageLinkClassName={
                                    'mx-3 h-12 font-medium rounded-full bg-gray-200 w-12 md:flex justify-center items-center hidden  cursor-pointer leading-5 transition duration-150 ease-in  rounded-full'
                                }
                                previousLinkClassName={
                                    'h-12 w-12 mr-1 flex justify-center items-center rounded-full bg-gray-200 cursor-pointer'
                                }
                                nextLinkClassName={
                                    'h-12 w-12 ml-1 flex justify-center items-center rounded-full bg-gray-200 cursor-pointer'
                                }
                                activeLinkClassName={'bg-teal-600 text-white'}
                                pageRangeDisplayed={3}
                                marginPagesDisplayed={2}
                                onPageChange={(e) => setPaging({ ...paging, pageIndex: e.selected + 1 })}
                                forcePage={paging.pageIndex - 1}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Shop;
