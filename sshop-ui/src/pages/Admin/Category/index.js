import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Loading from '../../../components/Loading';
import Table from '../../../components/Table';
import CategoryForm from '../components/CategoryForm';
import Alert from '../../../components/Alert';
import OutsideAlerter from '../../../components/OutsideAlerter';
import ModalWrapper from '../../../components/ModalWrapper';
import * as messageAction from '../../../redux/features/message/messageSlice';
import * as authAction from '../../../redux/features/auth/authSlice';
import * as categoriesAPI from '../../../services/categoriesAPI';
import logoutHandler from '../../../utils/logoutHandler';
import { BACKGROUND_COLOR_FAILED, BACKGROUND_COLOR_SUCCESS } from '../../../constants';
import messages from '../../../configs/messages';

const Category = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const hiddenColumns = ['parentCategoryId', 'parentCategoryName', 'content'];
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [isOutClick, setIsOutClick] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [action, setAction] = useState({
        add: false,
        edit: false,
        delete: false,
    });
    const fetchAPI = useCallback(async () => {
        setLoading(true);
        let response = await categoriesAPI.getAllCategories();
        if (!response || !response?.isSuccess) {
            setLoading(true);
            setCategories([]);
            dispatch(
                messageAction.setMessage({
                    id: Math.random(),
                    title: 'Category',
                    message: response?.errors || messages.admin.category.retrieve_err,
                    backgroundColor: BACKGROUND_COLOR_FAILED,
                    icon: '',
                }),
            );
        } else {
            setLoading(false);
            setCategories(response?.data?.items);
        }
    });
    useEffect(() => {
        fetchAPI();
    }, []);
    const handleAddCategory = () => {
        setAction({ add: true, edit: false, delete: false });
        setIsOutClick(false);
    };
    const handleUpdateCategory = (categoryId) => {
        const category = categories.find((val) => val.categoryId === categoryId);
        setAction({ add: false, edit: true, delete: false });
        setSelectedCategory(category);
        setIsOutClick(false);
    };
    const handleDeleteCategory = (categoryId) => {
        const category = categories.find((val) => val.categoryId === categoryId);
        setAction({ add: false, edit: false, delete: true });
        setSelectedCategory(category);
        setIsOutClick(false);
    };
    const deleteCategory = async () => {
        setButtonLoading(true);
        const response = await categoriesAPI.deleteCategory(selectedCategory.categoryId);
        setButtonLoading(false);
        setIsOutClick(true);
        if (!response || !response?.isSuccess) {
            if (response.status === 401) {
                await logoutHandler(dispatch, navigate, messageAction, authAction);
            }
            dispatch(
                messageAction.setMessage({
                    id: Math.random(),
                    title: 'Category',
                    message: response?.errors || messages.admin.category.delete_err,
                    backgroundColor: BACKGROUND_COLOR_FAILED,
                    icon: '',
                }),
            );
        } else {
            dispatch(
                messageAction.setMessage({
                    id: Math.random(),
                    title: 'Category',
                    message: messages.admin.category.delete_suc,
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
                    <Table
                        data={categories}
                        hiddenColumns={hiddenColumns}
                        uniqueField={'categoryId'}
                        isAddNew={true}
                        handleAddNew={handleAddCategory}
                        handleUpdateItem={handleUpdateCategory}
                        handleDeleteItem={handleDeleteCategory}
                    />
                    {action.add && !isOutClick && (
                        <ModalWrapper>
                            <OutsideAlerter setIsOut={setIsOutClick}>
                                <CategoryForm
                                    setAction={setAction}
                                    categories={categories}
                                    getAllCategories={fetchAPI}
                                />
                            </OutsideAlerter>
                        </ModalWrapper>
                    )}
                    {action.edit && !isOutClick && (
                        <ModalWrapper>
                            <OutsideAlerter setIsOut={setIsOutClick}>
                                <CategoryForm
                                    categories={categories}
                                    category={selectedCategory}
                                    getAllCategories={fetchAPI}
                                    setAction={setAction}
                                />
                            </OutsideAlerter>
                        </ModalWrapper>
                    )}
                    {action.delete && !isOutClick && (
                        <ModalWrapper>
                            <OutsideAlerter setIsOut={setIsOutClick}>
                                <Alert
                                    title={'Delete Confirmation'}
                                    content={'Do you want to remove this category ?'}
                                    cancelClick={() => setIsOutClick(true)}
                                    confirmClick={() => deleteCategory()}
                                    loading={buttonLoading}
                                />
                            </OutsideAlerter>
                        </ModalWrapper>
                    )}
                </>
            )}
        </div>
    );
};
export default Category;
