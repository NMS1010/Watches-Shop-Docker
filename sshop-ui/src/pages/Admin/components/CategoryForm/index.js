import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import classNames from 'classnames/bind';
import styles from '../CommonCSSForm.module.scss';

import FileUploader from '../../../../components/FileUploader';
import Button from '../../../../components/Button';

import * as categoriesAPI from '../../../../services/categoriesAPI';
import * as messageAction from '../../../../redux/features/message/messageSlice';
import * as authAction from '../../../../redux/features/auth/authSlice';
import logoutHandler from '../../../../utils/logoutHandler';
import { BACKGROUND_COLOR_FAILED, BACKGROUND_COLOR_SUCCESS } from '../../../../constants';
import messages from '../../../../configs/messages';

const cx = classNames.bind(styles);

const CategoryForm = ({ setAction = () => {}, category = null, categories = [], getAllCategories = () => {} }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [inputFields, setInputFields] = useState({
        name: category?.name,
        content: category?.content,
        parentCategory: category?.parentCategory,
    });
    const [fileSelected, setFileSelected] = useState(null);
    const [fileSelectedError, setFileSelectedError] = useState('');
    const [validationMessage, setValidationMessage] = useState({
        name: '',
        content: '',
        parentCategory: '',
        image: null,
    });

    const validation = useCallback(() => {
        let errors = { ...validationMessage };
        inputFields.name?.trim() ? (errors.name = '') : (errors.name = 'Name is required');
        inputFields.content?.trim() ? (errors.content = '') : (errors.content = 'Content is required');
        !fileSelected && !category?.image ? (errors.image = 'Image is required') : (errors.image = '');
        setValidationMessage(errors);
    });
    useEffect(() => {
        validation();
    }, [inputFields, fileSelected]);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputFields({ ...inputFields, [name]: value });
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        let isValidateErrors = Object.keys(validationMessage).some((err) => {
            return validationMessage[err] !== '';
        });
        if (isValidateErrors) return;
        const categoryObj = new FormData();
        categoryObj.append('categoryId', category?.categoryId);
        categoryObj.append('name', inputFields?.name);
        categoryObj.append('content', inputFields?.content);
        categoryObj.append('image', fileSelected);
        if (inputFields.parentCategory && inputFields.parentCategory !== '0') {
            categoryObj.append('parentCategoryId', inputFields.parentCategory);
        }
        const handleCategory = async () => {
            setLoading(true);
            let response =
                category !== null
                    ? await categoriesAPI.updateCategory(categoryObj)
                    : await categoriesAPI.createCategory(categoryObj);

            if (!response || !response.isSuccess) {
                if (response.status === 401) {
                    await logoutHandler(dispatch, navigate, messageAction, authAction);
                }
                dispatch(
                    messageAction.setMessage({
                        id: Math.random(),
                        title: 'Category',
                        message: response?.errors || messages.admin.category.handling_err,
                        backgroundColor: BACKGROUND_COLOR_FAILED,
                        icon: '',
                    }),
                );
            } else {
                dispatch(
                    messageAction.setMessage({
                        id: Math.random(),
                        title: 'Category',
                        message: messages.admin.category.handling_suc,
                        backgroundColor: BACKGROUND_COLOR_SUCCESS,
                        icon: '',
                    }),
                );
                setAction({ add: false, edit: false, delete: false });
                await getAllCategories();
            }
            setLoading(false);
        };
        handleCategory();
    };
    return (
        <div className={cx('container')}>
            <h1 className={cx('title')}>Catogory</h1>
            <form className={cx('form')} onSubmit={handleSubmit}>
                <div className={cx('form-group')}>
                    <label htmlFor="name">Name</label>
                    <input name="name" value={inputFields.name} type={'text'} onChange={handleChange} />
                    <small>{validationMessage.name}</small>
                </div>
                <div className={cx('form-group')}>
                    <label htmlFor="content">Content</label>
                    <textarea name="content" onChange={handleChange} value={inputFields.content}></textarea>
                    <small>{validationMessage.content}</small>
                </div>
                <div className={cx('form-group')}>
                    <label htmlFor="parentCategory">Parent Category</label>
                    <select name="parentCategory" onChange={handleChange}>
                        <option selected={true} value={0}>
                            No parent Category
                        </option>
                        {categories.map((cate) => {
                            if (cate?.categoryId === category?.categoryId) {
                                return;
                            }
                            return (
                                <option
                                    selected={cate?.categoryId === category?.parentCategoryId}
                                    value={cate?.categoryId}
                                    key={cate?.categoryId}
                                >
                                    {cate.name}
                                </option>
                            );
                        })}
                    </select>
                </div>
                <div className={cx('form-group')}>
                    <FileUploader
                        accept={'image/*'}
                        setFileSelected={setFileSelected}
                        setFileSelectedError={setFileSelectedError}
                        imgUrl={category?.image}
                    />
                    <small>{fileSelectedError}</small>
                    <small>{validationMessage.image}</small>
                </div>
                <div className={cx('action-btn')}>
                    <Button className={cx('submit-btn')} type="submit" loading={loading}>
                        {category ? 'Update' : 'Create'}
                    </Button>
                </div>
            </form>
        </div>
    );
};
export default CategoryForm;
