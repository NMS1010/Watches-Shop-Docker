import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Loading from '../../../components/Loading';
import Table from '../../../components/Table';
import ProductForm from '../components/ProductForm';
import Alert from '../../../components/Alert';
import OutsideAlerter from '../../../components/OutsideAlerter';
import ModalWrapper from '../../../components/ModalWrapper';

import * as messageAction from '../../../redux/features/message/messageSlice';
import * as authAction from '../../../redux/features/auth/authSlice';
import * as productsAPI from '../../../services/productsAPI';
import logoutHandler from '../../../utils/logoutHandler';
import { BACKGROUND_COLOR_FAILED, BACKGROUND_COLOR_SUCCESS } from '../../../constants';
import messages from '../../../configs/messages';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import config from '../../../configs';

const Product = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const hiddenColumns = [
        'dateCreated',
        'categoryId',
        'brandId',
        'subImages',
        'productReview',
        'status',
        'statusClass',
        'description',
    ];
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [isOutClick, setIsOutClick] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [action, setAction] = useState({
        add: false,
        edit: false,
        delete: false,
        list: true,
    });
    const fetchAPI = useCallback(async () => {
        setLoading(true);
        let response = await productsAPI.getAllProducts();
        if (!response || !response?.isSuccess) {
            setLoading(true);
            setProducts([]);
            dispatch(
                messageAction.setMessage({
                    id: Math.random(),
                    title: 'Product',
                    message: response?.errors || messages.admin.product.retrieve_err,
                    backgroundColor: BACKGROUND_COLOR_FAILED,
                    icon: '',
                }),
            );
        } else {
            setLoading(false);
            setProducts(response?.data?.items);
        }
    });
    useEffect(() => {
        fetchAPI();
    }, [isOutClick]);
    const handleAddProduct = () => {
        navigate(`${config.routes.admin_products}/add`);
    };
    const handleUpdateProduct = (productId) => {
        navigate(`${config.routes.admin_products}/${productId}`);
    };
    const handleDeleteProduct = (productId) => {
        const product = products.find((val) => val.productId === productId);
        setAction({ add: false, edit: false, delete: true, list: true });
        setSelectedProduct(product);
        setIsOutClick(false);
    };
    const deleteProduct = async () => {
        setButtonLoading(true);
        const response = await productsAPI.deleteProduct(selectedProduct.productId);
        setButtonLoading(false);
        setIsOutClick(true);
        if (!response || !response?.isSuccess) {
            if (response.status === 401) {
                await logoutHandler(dispatch, navigate, messageAction, authAction);
            }
            dispatch(
                messageAction.setMessage({
                    id: Math.random(),
                    title: 'Product',
                    message: response?.errors || messages.admin.product.delete_err,
                    backgroundColor: BACKGROUND_COLOR_FAILED,
                    icon: '',
                }),
            );
        } else {
            dispatch(
                messageAction.setMessage({
                    id: Math.random(),
                    title: 'Product',
                    message: messages.admin.product.delete_suc,
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
                    {action.list && (
                        <Table
                            data={products}
                            hiddenColumns={hiddenColumns}
                            uniqueField={'productId'}
                            isAddNew={true}
                            handleAddNew={handleAddProduct}
                            handleUpdateItem={handleUpdateProduct}
                            handleDeleteItem={handleDeleteProduct}
                        />
                    )}
                    {action.add && <ProductForm />}
                    {action.edit && <ProductForm />}
                    {action.delete && !isOutClick && (
                        <ModalWrapper>
                            <Alert
                                title={'Delete Confirmation'}
                                content={'Do you want to remove this product ?'}
                                cancelClick={() => setIsOutClick(true)}
                                confirmClick={() => deleteProduct()}
                                loading={buttonLoading}
                            />
                        </ModalWrapper>
                    )}
                </>
            )}
        </div>
    );
};
export default Product;
