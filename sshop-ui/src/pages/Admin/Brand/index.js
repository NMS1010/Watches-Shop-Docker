import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import Loading from '../../../components/Loading';
import Table from '../../../components/Table';
import BrandForm from '../components/BrandForm';
import Alert from '../../../components/Alert';
import OutsideAlerter from '../../../components/OutsideAlerter';
import ModalWrapper from '../../../components/ModalWrapper';
import logoutHandler from '../../../utils/logoutHandler';
import * as authAction from '../../../redux/features/auth/authSlice';
import * as messageAction from '../../../redux/features/message/messageSlice';
import * as brandsAPI from '../../../services/brandsAPI';
import { BACKGROUND_COLOR_FAILED, BACKGROUND_COLOR_SUCCESS } from '../../../constants';
import messages from '../../../configs/messages';

const Brand = () => {
    const hiddenColumns = [];
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [isOutClick, setIsOutClick] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [action, setAction] = useState({
        add: false,
        edit: false,
        delete: false,
    });
    const fetchAPI = useCallback(async () => {
        setLoading(true);
        let response = await brandsAPI.getAllBrands();
        if (!response || !response?.isSuccess) {
            setLoading(true);
            setBrands([]);
            dispatch(
                messageAction.setMessage({
                    id: Math.random(),
                    title: 'Brand',
                    message: response?.errors || messages.admin.brand.retrieve_err,
                    backgroundColor: BACKGROUND_COLOR_FAILED,
                    icon: '',
                }),
            );
        } else {
            setLoading(false);
            setBrands(response?.data?.items);
        }
    });
    useEffect(() => {
        fetchAPI();
    }, []);
    const handleAddBrand = () => {
        setAction({ add: true, edit: false, delete: false });
        setIsOutClick(false);
    };
    const handleUpdateBrand = (brandId) => {
        const brand = brands.find((val) => val.brandId === brandId);
        setAction({ add: false, edit: true, delete: false });
        setSelectedBrand(brand);
        setIsOutClick(false);
    };
    const handleDeleteBrand = (brandId) => {
        const brand = brands.find((val) => val.brandId === brandId);
        setAction({ add: false, edit: false, delete: true });
        setSelectedBrand(brand);
        setIsOutClick(false);
    };
    const deleteBrand = async () => {
        setButtonLoading(true);
        const response = await brandsAPI.deleteBrand(selectedBrand.brandId);
        setButtonLoading(false);
        setIsOutClick(true);
        if (!response || !response?.isSuccess) {
            if (response.status === 401) {
                await logoutHandler(dispatch, navigate, messageAction, authAction);
            }
            dispatch(
                messageAction.setMessage({
                    id: Math.random(),
                    title: 'Brand',
                    message: response?.errors || messages.admin.brand.delete_err,
                    backgroundColor: BACKGROUND_COLOR_FAILED,
                    icon: '',
                }),
            );
        } else {
            dispatch(
                messageAction.setMessage({
                    id: Math.random(),
                    title: 'Brand',
                    message: messages.admin.brand.delete_suc,
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
                        data={brands}
                        hiddenColumns={hiddenColumns}
                        uniqueField={'brandId'}
                        isAddNew={true}
                        handleAddNew={handleAddBrand}
                        handleUpdateItem={handleUpdateBrand}
                        handleDeleteItem={handleDeleteBrand}
                    />
                    {action.add && !isOutClick && (
                        <ModalWrapper>
                            <OutsideAlerter setIsOut={setIsOutClick}>
                                <BrandForm setAction={setAction} brands={brands} getAllBrands={fetchAPI} />
                            </OutsideAlerter>
                        </ModalWrapper>
                    )}
                    {action.edit && !isOutClick && (
                        <ModalWrapper>
                            <OutsideAlerter setIsOut={setIsOutClick}>
                                <BrandForm
                                    brands={brands}
                                    brand={selectedBrand}
                                    getAllBrands={fetchAPI}
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
                                    content={'Do you want to remove this brand ?'}
                                    cancelClick={() => setIsOutClick(true)}
                                    confirmClick={() => deleteBrand()}
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

export default Brand;
