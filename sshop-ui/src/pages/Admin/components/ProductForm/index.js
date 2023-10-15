import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import classNames from 'classnames/bind';
import styles from './ProductForm.module.scss';

import FileUploader from '../../../../components/FileUploader';
import Loading from '../../../../components/Loading';

import * as productsAPI from '../../../../services/productsAPI';
import * as brandsAPI from '../../../../services/brandsAPI';
import * as categoriesAPI from '../../../../services/categoriesAPI';
import * as messageAction from '../../../../redux/features/message/messageSlice';
import * as authAction from '../../../../redux/features/auth/authSlice';

import { Button, Col, Form, Row } from 'react-bootstrap';
import logoutHandler from '../../../../utils/logoutHandler';
import ProductImages from '../../Product/ProductImages';
import { BACKGROUND_COLOR_FAILED, BACKGROUND_COLOR_SUCCESS } from '../../../../constants';
import messages from '../../../../configs/messages';
import { Editor } from '@tinymce/tinymce-react';
import config from '../../../../configs';

const cx = classNames.bind(styles);

const ProductForm = () => {
    const { productId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(false);
    const [inputFields, setInputFields] = useState({
        name: '',
        price: '',
        quantity: '',
        description: '',
        status: '',
        origin: '',
        categoryId: '',
        brandId: '',
    });
    const [mainImage, setMainImage] = useState(null);
    const [subImage, setSubImage] = useState(null);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [fileSelectedError, setFileSelectedError] = useState('');
    const [validated, setValidated] = useState(false);
    const [editImage, setEditImage] = useState(false);
    useEffect(() => {
        setLoading(true);
        if (!productId) navigate(config.routes.admin_products);
        const fetchProduct = async () => {
            let response = await productsAPI.getProductById(productId);
            if (!response || !response.isSuccess) {
                dispatch(
                    messageAction.setMessage({
                        id: Math.random(),
                        title: 'Product',
                        message: response?.errors || 'Error while retrieving products',
                        backgroundColor: BACKGROUND_COLOR_FAILED,
                        icon: '',
                    }),
                );
            } else {
                let productResp = response?.data;
                setProduct(productResp);
                setInputFields({
                    name: productResp?.name,
                    price: productResp?.price,
                    quantity: productResp?.quantity,
                    description: productResp?.description,
                    status: productResp?.status,
                    origin: productResp?.origin,
                    categoryId: productResp?.categoryId,
                    brandId: productResp?.brandId,
                });
            }
        };
        const fetchBrands = async () => {
            const response = await brandsAPI.getAllBrands();
            if (!response || !response.isSuccess) {
                dispatch(
                    messageAction.setMessage({
                        id: Math.random(),
                        title: 'Brand',
                        message: response?.errors || 'Error while retrieving brands',
                        backgroundColor: BACKGROUND_COLOR_FAILED,
                        icon: '',
                    }),
                );
            } else {
                setBrands(response?.data?.items);
            }
        };
        const fetchCategories = async () => {
            const response = await categoriesAPI.getAllCategories();
            if (!response || !response.isSuccess) {
                dispatch(
                    messageAction.setMessage({
                        id: Math.random(),
                        title: 'Category',
                        message: response?.errors || 'Error while retrieving categories',
                        backgroundColor: BACKGROUND_COLOR_FAILED,
                        icon: '',
                    }),
                );
            } else {
                setCategories(response?.data?.items);
                setLoading(false);
            }
        };
        if (productId !== 'add') fetchProduct();
        fetchBrands();
        fetchCategories();
    }, [productId, editImage]);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputFields({ ...inputFields, [name]: value });
    };
    const handleSubmit = (e) => {
        const form = e.currentTarget;
        e.preventDefault();
        if (form.checkValidity() === false || (!product && (!subImage || !mainImage)) || !inputFields.description) {
            e.stopPropagation();
            setValidated(true);
            return;
        }
        const formData = new FormData();
        formData.append('Name', inputFields.name);
        formData.append('Price', inputFields.price);
        formData.append('Quantity', inputFields.quantity);
        formData.append('Description', inputFields.description);
        formData.append('Status', inputFields.status || 0);
        formData.append('Origin', inputFields.origin);
        formData.append('CategoryId', inputFields.categoryId || categories[0].categoryId);
        formData.append('BrandId', inputFields.brandId || brands[0].brandId);
        if (mainImage) formData.append('Image', mainImage, mainImage.name);
        if (subImage) formData.append('SubImages', subImage, subImage.name);
        if (product) {
            formData.append('ProductId', product?.productId);
        }
        const handleProduct = async () => {
            setLoading(true);
            let response =
                product !== null
                    ? await productsAPI.updateProduct(formData)
                    : await productsAPI.createProduct(formData);
            if (response.status === 401) {
                await logoutHandler(dispatch, navigate, messageAction, authAction);
            }
            if (!response || !response.isSuccess) {
                dispatch(
                    messageAction.setMessage({
                        id: Math.random(),
                        title: 'Product',
                        message: response?.errors || messages.admin.product.handling_err,
                        backgroundColor: BACKGROUND_COLOR_FAILED,
                        icon: '',
                    }),
                );
            } else {
                dispatch(
                    messageAction.setMessage({
                        id: Math.random(),
                        title: 'Product',
                        message: messages.admin.product.handling_suc,
                        backgroundColor: BACKGROUND_COLOR_SUCCESS,
                        icon: '',
                    }),
                );
                navigate(config.routes.admin_products);
            }
            setLoading(false);
        };
        handleProduct();
    };
    return (
        <>
            {loading ? (
                <Loading />
            ) : !editImage ? (
                <>
                    <div className={`${cx('container')}`}>
                        <Form className="my-4 text-3xl" validated={validated} noValidate onSubmit={handleSubmit}>
                            <Row>
                                <Form.Group as={Col} md="6" className="mb-3" controlId="validationName">
                                    <Form.Label>Product Name</Form.Label>
                                    <Form.Control
                                        required
                                        type="text"
                                        className="h-16 text-3xl"
                                        value={inputFields?.name}
                                        name="name"
                                        onChange={(e) => handleChange(e)}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please enter your product name
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group as={Col} md="6" className="mb-3" controlId="validationOrigin">
                                    <Form.Label>Origin</Form.Label>
                                    <Form.Control
                                        required
                                        type="text"
                                        className="h-16 text-3xl"
                                        value={inputFields?.origin}
                                        name="origin"
                                        onChange={(e) => handleChange(e)}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please enter your product origin
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Row>
                            <Row>
                                <Form.Group as={Col} md="6" className="mb-3" controlId="validationPrice">
                                    <Form.Label>Price</Form.Label>
                                    <Form.Control
                                        required
                                        type="number"
                                        className="h-16 text-3xl"
                                        value={inputFields?.price}
                                        name="price"
                                        onChange={(e) => handleChange(e)}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please enter your product price
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group as={Col} md="6" className="mb-3" controlId="validationQuantity">
                                    <Form.Label>Quantity</Form.Label>
                                    <Form.Control
                                        required
                                        type="number"
                                        className="h-16 text-3xl"
                                        value={inputFields?.quantity}
                                        name="quantity"
                                        onChange={(e) => handleChange(e)}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please enter your product quantity
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Row>
                            <Row>
                                <Form.Group as={Col} md="4" className="mb-3" controlId="validationCategory">
                                    <Form.Label>Category</Form.Label>
                                    <Form.Select
                                        className="h-16 text-3xl"
                                        onChange={(e) => handleChange(e)}
                                        name="categoryId"
                                        value={inputFields?.categoryId}
                                    >
                                        {categories.map((val) => {
                                            return (
                                                <option selected key={val.categoryId} value={val.categoryId}>
                                                    {val.name}
                                                </option>
                                            );
                                        })}
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                        Please enter product category
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group as={Col} md="4" className="mb-3" controlId="validationBrand">
                                    <Form.Label>Brand</Form.Label>
                                    <Form.Select
                                        onChange={(e) => handleChange(e)}
                                        name="brandId"
                                        className="h-16 text-3xl"
                                        value={inputFields?.brandId}
                                    >
                                        {brands.map((val) => {
                                            return (
                                                <option selected key={val.brandId} value={val.brandId}>
                                                    {val.brandName}
                                                </option>
                                            );
                                        })}
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                        Please enter product brand
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group as={Col} md="4" className="mb-3" controlId="validationStatus">
                                    <Form.Label>Status</Form.Label>
                                    <Form.Select
                                        onChange={(e) => handleChange(e)}
                                        name="status"
                                        className="h-16 text-3xl"
                                        value={inputFields?.status}
                                    >
                                        <option value={0}>In stock</option>
                                        <option value={1}>Out stock</option>
                                        <option value={2}>Suspended</option>
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                        Please enter product status
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Row>
                            <Row>
                                <Form.Group as={Col} md="12" className="mb-3" controlId="validationDescription">
                                    <Form.Label>Description</Form.Label>
                                    <Editor
                                        apiKey="84w83hexvzs2omzevvvtabd1qjetnmfyhywg4u9xye5ym8j7"
                                        initialValue={inputFields?.description}
                                        init={{
                                            branding: false,
                                            height: 1000,
                                            menubar: true,
                                            plugins:
                                                'print preview paste searchreplace autolink directionality visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern',
                                            toolbar:
                                                'formatselect | bold italic underline strikethrough | forecolor backcolor blockquote | link image media | alignleft aligncenter alignright alignjustify | numlist bullist outdent indent | removeformat',
                                            image_advtab: true,
                                        }}
                                        onChange={(e) => {
                                            setInputFields({ ...inputFields, description: e.target.getContent() });
                                        }}
                                    />
                                    <p style={{ color: 'rgb(220, 53, 69)' }}>
                                        {validated && 'Please enter product description'}
                                    </p>
                                </Form.Group>
                            </Row>

                            <Row>
                                <Col md="6">
                                    {!product ? (
                                        <Row className="mt-3">
                                            <p
                                                title="Can add more images later, after created product"
                                                className="mb-0 mr-3"
                                            >
                                                Sub Image
                                            </p>
                                            <div className="flex">
                                                <FileUploader
                                                    setFileSelected={setSubImage}
                                                    setFileSelectedError={setFileSelectedError}
                                                    imgUrl={subImage ? URL.createObjectURL(subImage) : ''}
                                                />
                                            </div>
                                            {!subImage ? (
                                                <p style={{ color: '#dc3545' }}>Please choose sub product image</p>
                                            ) : (
                                                <p style={{ color: '#dc3545' }}>{fileSelectedError}</p>
                                            )}
                                        </Row>
                                    ) : (
                                        <Row className="mt-3">
                                            <div className="d-flex align-items-center">
                                                <p className="mb-0">Sub Image </p>
                                                <Button
                                                    onClick={() => {
                                                        setEditImage(true);
                                                    }}
                                                    variant="success"
                                                    className="fs-4 rounded-4 ms-3"
                                                >
                                                    Edit Image
                                                </Button>
                                            </div>
                                            <div className="d-inline-flex flex-wrap mt-3">
                                                {product.subImages.items.map((item) => {
                                                    return (
                                                        !item.isDefault && (
                                                            <div
                                                                key={item.id}
                                                                className="col-md-3 m-2 d-inline-block text-center"
                                                            >
                                                                <img
                                                                    className="w-48 rounded-2xl"
                                                                    src={`${process.env.REACT_APP_HOST}${item.image}`}
                                                                />
                                                            </div>
                                                        )
                                                    );
                                                })}
                                            </div>
                                        </Row>
                                    )}
                                </Col>
                                <Col md="6">
                                    <p className="mt-3 mb-0">Image</p>
                                    <div className="flex">
                                        <FileUploader
                                            setFileSelected={setMainImage}
                                            setFileSelectedError={setFileSelectedError}
                                            imgUrl={product?.imagePath}
                                        />
                                    </div>
                                    {!mainImage && !product ? (
                                        <small style={{ color: '#dc3545' }}>Please choose product image</small>
                                    ) : (
                                        <small style={{ color: '#dc3545' }}>{fileSelectedError}</small>
                                    )}
                                </Col>
                            </Row>
                            <div className="text-center mt-5">
                                <Button variant="outline-info" type="submit" className="fs-3 mx-2 rounded-4 p-3 w-25">
                                    {product ? 'Update' : 'Create'}
                                </Button>
                                <Button
                                    onClick={() => navigate(config.routes.admin_products)}
                                    variant="outline-warning"
                                    className="fs-3 rounded-4 mx-2 p-3 w-25"
                                >
                                    Back
                                </Button>
                            </div>
                        </Form>
                    </div>
                </>
            ) : (
                <ProductImages setEditImage={setEditImage} productId={product.productId} />
            )}
        </>
    );
};

export default ProductForm;
