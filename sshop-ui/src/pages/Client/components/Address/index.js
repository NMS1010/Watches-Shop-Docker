import { faAddressCard, faEdit } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { Button, Form } from 'react-bootstrap';
import { useCallback, useState } from 'react';
import * as addressAPI from '../../../../services/addressAPI';
import * as authUtil from '../../../../utils/authUtils';
import * as messageAction from '../../../../redux/features/message/messageSlice';
import { useDispatch } from 'react-redux';
import messages from '../../../../configs/messages';
import { BACKGROUND_COLOR_FAILED } from '../../../../constants';
import { useEffect } from 'react';
import ModalWrapper from '../../../../components/ModalWrapper';
import Loading from '../../../../components/Loading';
import AddressForm from './AddressForm';
const Address = () => {
    const [openForm, setOpenForm] = useState(false);
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const dispatch = useDispatch();
    const fetchAddress = useCallback(async () => {
        setLoading(true);
        const response = await addressAPI.getAddressByUserId(authUtil.getUserId());
        if (!response?.isSuccess) {
            dispatch(
                messageAction.setMessage({
                    id: Math.random(),
                    title: 'Address',
                    message: messages.client.profile.address.retrieve_err,
                    backgroundColor: BACKGROUND_COLOR_FAILED,
                    icon: '',
                }),
            );
        } else {
            setAddresses(response?.data?.items);
            setLoading(false);
        }
    }, []);
    useEffect(() => {
        if (!openForm) fetchAddress();
    }, [openForm]);
    const handleRemove = async (id) => {
        const response = await addressAPI.deleteAddress(id);
        if (!response?.isSuccess) {
            dispatch(
                messageAction.setMessage({
                    id: Math.random(),
                    title: 'Address',
                    message: response?.errors,
                    backgroundColor: BACKGROUND_COLOR_FAILED,
                    icon: '',
                }),
            );
        } else {
            await fetchAddress();
        }
    };
    return loading ? (
        <Loading />
    ) : (
        <>
            <div className="bg-white p-3 shadow-sm rounded-sm">
                <div>
                    <div className="flex items-center justify-between space-x-2 font-semibold text-gray-900 leading-8 mb-3">
                        <div>
                            <FontAwesomeIcon icon={faAddressCard} />
                            <span className="tracking-wide ml-4">My Address</span>
                        </div>
                        <Button
                            className="text-2xl"
                            onClick={() => {
                                setOpenForm(true);
                                setSelectedAddress(null);
                            }}
                        >
                            New Address
                        </Button>
                    </div>
                    <ul className="list-inside space-y-2">
                        {addresses.map((address) => {
                            return (
                                <li className="my-5 flex justify-between">
                                    <div>
                                        <div className="text-teal-600 text-4xl">
                                            {address.firstName} {address.lastName}
                                            <span className="text-gray-400 text-2xl"> | {address.phone}</span>
                                        </div>
                                        <div className="text-gray-400 text-2xl my-2">{address.specificAddress}</div>
                                        <div className="text-gray-400 text-2xl my-2">
                                            {`${address.wardName}, ${address.districtName}, ${address.provinceName}`}
                                        </div>
                                        {address.isDefault && (
                                            <div className="text-gray-500 text-xl my-4">
                                                <span className="border-2 border-rose-600 p-2 text-red-500">
                                                    Mặc định
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <div className="text-center">
                                            <Button
                                                variant="outline-success"
                                                className="mr-3"
                                                onClick={() => {
                                                    setOpenForm(true);
                                                    setSelectedAddress(address);
                                                }}
                                            >
                                                <FontAwesomeIcon icon={faEdit} />
                                            </Button>
                                            <Button
                                                variant="outline-danger"
                                                className="ml-3"
                                                onClick={() => {
                                                    handleRemove(address.addressId);
                                                }}
                                            >
                                                <FontAwesomeIcon icon={faTrash} />
                                            </Button>
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
            {openForm && (
                <ModalWrapper>
                    <AddressForm address={selectedAddress} setOpenForm={setOpenForm} />
                </ModalWrapper>
            )}
        </>
    );
};
export default Address;
