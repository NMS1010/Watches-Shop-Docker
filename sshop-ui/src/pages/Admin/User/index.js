import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Loading from '../../../components/Loading';
import Table from '../../../components/Table';
import * as messageAction from '../../../redux/features/message/messageSlice';
import * as authAction from '../../../redux/features/auth/authSlice';
import * as usersAPI from '../../../services/usersAPI';
import logoutHandler from '../../../utils/logoutHandler';
import { BACKGROUND_COLOR_FAILED, BACKGROUND_COLOR_SUCCESS } from '../../../constants';
import messages from '../../../configs/messages';
import ModalWrapper from '../../../components/ModalWrapper';
import OutsideAlerter from '../../../components/OutsideAlerter';
import UserForm from '../components/UserForm';

const User = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const hiddenColumns = [
        'dateUpdated',
        'password',
        'address',
        'email',
        'status',
        'totalBought',
        'totalWishItem',
        'totalCartItem',
        'totalOrders',
        'totalCost',
        'roleIds',
        'orders',
        'userId',
    ];
    const [users, setusers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isOutClick, setIsOutClick] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [action, setAction] = useState({
        edit: false,
    });
    const fetchAPI = useCallback(async () => {
        setLoading(true);
        let response = await usersAPI.getAllUsers();
        if (!response || !response?.isSuccess) {
            if (response?.status === 401) {
                await logoutHandler(dispatch, navigate, messageAction, authAction);
            }
            setLoading(true);
            setusers([]);
            dispatch(
                messageAction.setMessage({
                    id: Math.random(),
                    title: 'User',
                    message: response?.errors || messages.admin.user.retrieve_err,
                    backgroundColor: BACKGROUND_COLOR_FAILED,
                    icon: '',
                }),
            );
        } else {
            setLoading(false);
            setusers(response?.data?.items);
        }
    });
    useEffect(() => {
        fetchAPI();
    }, []);

    const handleUpdateUser = (userId) => {
        const user = users.find((val) => val.userId === userId);
        setAction({ edit: true });
        setSelectedUser(user);
        setIsOutClick(false);
    };
    // const handleDeleteUser = (userId) => {
    //     const user = users.find((val) => val.userId === userId);
    //     setAction({ edit: false, delete: true });
    //     setSelectedUser(user);
    //     setIsOutClick(false);
    // };
    // const deleteUser = async () => {
    //     setButtonLoading(true);
    //     const response = await usersAPI.deleteUser(selectedUser.userId);
    //     setButtonLoading(false);
    //     setIsOutClick(true);
    //     if (!response || !response?.isSuccess) {
    //         dispatch(
    //             messageAction.setMessage({
    //                 id: Math.random(),
    //                 title: 'User',
    //                 message: response?.errors || 'Error while deleting this User',
    //                 backgroundColor: BACKGROUND_COLOR_FAILED,
    //                 icon: '',
    //             }),
    //         );
    //     } else {
    //         dispatch(
    //             messageAction.setMessage({
    //                 id: Math.random(),
    //                 title: 'User',
    //                 message: 'Succeed in disabling this user',
    //                 backgroundColor: BACKGROUND_COLOR_SUCCESS,
    //                 icon: '',
    //             }),
    //         );
    //         await fetchAPI();
    //     }
    // };
    return (
        <div>
            {loading ? (
                <Loading />
            ) : (
                <>
                    <Table
                        data={users}
                        uniqueField={'userId'}
                        handleUpdateItem={handleUpdateUser}
                        // handleDeleteItem={handleDeleteUser}
                        hiddenColumns={hiddenColumns}
                    />
                    {action.edit && !isOutClick && (
                        <ModalWrapper>
                            <OutsideAlerter setIsOut={setIsOutClick}>
                                <UserForm user={selectedUser} getAllUsers={fetchAPI} setAction={setAction} />
                            </OutsideAlerter>
                        </ModalWrapper>
                    )}
                    {/* {action.delete && !isOutClick && (
                        <ModalWrapper>
                            <OutsideAlerter setIsOut={setIsOutClick}>
                                <Alert
                                    title={'Delete Confirmation'}
                                    content={'Do you want to change this user`s status ?'}
                                    cancelClick={() => setIsOutClick(true)}
                                    confirmClick={() => deleteUser()}
                                    loading={buttonLoading}
                                />
                            </OutsideAlerter>
                        </ModalWrapper>
                    )} */}
                </>
            )}
        </div>
    );
};
export default User;
