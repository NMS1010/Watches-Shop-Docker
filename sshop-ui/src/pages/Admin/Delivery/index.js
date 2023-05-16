import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import Loading from '../../../components/Loading';
import Table from '../../../components/Table';
import DeliveryForm from '../components/DeliveryForm';
import Alert from '../../../components/Alert';
import OutsideAlerter from '../../../components/OutsideAlerter';
import ModalWrapper from '../../../components/ModalWrapper';
import logoutHandler from '../../../utils/logoutHandler';
import * as authAction from '../../../redux/features/auth/authSlice';
import * as messageAction from '../../../redux/features/message/messageSlice';
import * as deliveryMethodsAPI from '../../../services/deliveryMethodAPI';
import { BACKGROUND_COLOR_FAILED, BACKGROUND_COLOR_SUCCESS } from '../../../constants';
import messages from '../../../configs/messages';

const Delivery = () => {
    const hiddenColumns = [];
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [deliveryMethods, setDeliveryMethods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [isOutClick, setIsOutClick] = useState(false);
    const [selectedDelivery, setSelectedDelivery] = useState(null);
    const [action, setAction] = useState({
        add: false,
        edit: false,
        delete: false,
    });
    const fetchAPI = useCallback(async () => {
        setLoading(true);
        let response = await deliveryMethodsAPI.getAllDeliveryMethods();
        if (!response || !response?.isSuccess) {
            setLoading(true);
            setDeliveryMethods([]);
            dispatch(
                messageAction.setMessage({
                    id: Math.random(),
                    title: 'Delivery',
                    message: response?.errors || messages.admin.delivery.retrieve_err,
                    backgroundColor: BACKGROUND_COLOR_FAILED,
                    icon: '',
                }),
            );
        } else {
            setLoading(false);
            setDeliveryMethods(response?.data?.items);
        }
    });
    useEffect(() => {
        fetchAPI();
    }, []);
    const handleAddDelivery = () => {
        setAction({ add: true, edit: false, delete: false });
        setIsOutClick(false);
    };
    const handleUpdateDelivery = (deliveryId) => {
        const delivery = deliveryMethods.find((val) => val.deliveryMethodId === deliveryId);
        setAction({ add: false, edit: true, delete: false });
        setSelectedDelivery(delivery);
        setIsOutClick(false);
    };
    const handleDeleteDelivery = (deliveryId) => {
        const delivery = deliveryMethods.find((val) => val.deliveryMethodId === deliveryId);
        setAction({ add: false, edit: false, delete: true });
        setSelectedDelivery(delivery);
        setIsOutClick(false);
    };
    const deleteDelivery = async () => {
        setButtonLoading(true);
        const response = await deliveryMethodsAPI.deleteDeliveryMethod(selectedDelivery.deliveryMethodId);
        setButtonLoading(false);
        setIsOutClick(true);
        if (!response || !response?.isSuccess) {
            if (response.status === 401) {
                await logoutHandler(dispatch, navigate, messageAction, authAction);
            }
            dispatch(
                messageAction.setMessage({
                    id: Math.random(),
                    title: 'Delivery',
                    message: response?.errors || messages.admin.delivery.delete_err,
                    backgroundColor: BACKGROUND_COLOR_FAILED,
                    icon: '',
                }),
            );
        } else {
            dispatch(
                messageAction.setMessage({
                    id: Math.random(),
                    title: 'Delivery',
                    message: messages.admin.delivery.delete_suc,
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
                        data={deliveryMethods}
                        hiddenColumns={hiddenColumns}
                        uniqueField={'deliveryMethodId'}
                        isAddNew={true}
                        handleAddNew={handleAddDelivery}
                        handleUpdateItem={handleUpdateDelivery}
                        handleDeleteItem={handleDeleteDelivery}
                    />
                    {action.add && !isOutClick && (
                        <ModalWrapper>
                            <OutsideAlerter setIsOut={setIsOutClick}>
                                <DeliveryForm
                                    setAction={setAction}
                                    deliveryMethods={deliveryMethods}
                                    getAllDeliveryMethods={fetchAPI}
                                />
                            </OutsideAlerter>
                        </ModalWrapper>
                    )}
                    {action.edit && !isOutClick && (
                        <ModalWrapper>
                            <OutsideAlerter setIsOut={setIsOutClick}>
                                <DeliveryForm
                                    deliveryMethods={deliveryMethods}
                                    deliveryMethod={selectedDelivery}
                                    getAllDeliveryMethods={fetchAPI}
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
                                    content={'Do you want to remove this delivery ?'}
                                    cancelClick={() => setIsOutClick(true)}
                                    confirmClick={() => deleteDelivery()}
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

export default Delivery;
