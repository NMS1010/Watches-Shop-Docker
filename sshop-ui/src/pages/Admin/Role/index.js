import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Loading from '../../../components/Loading';
import Table from '../../../components/Table';
import RoleForm from '../components/RoleForm';
import Alert from '../../../components/Alert';
import OutsideAlerter from '../../../components/OutsideAlerter';
import ModalWrapper from '../../../components/ModalWrapper';
import logoutHandler from '../../../utils/logoutHandler';
import * as authAction from '../../../redux/features/auth/authSlice';
import * as rolesAPI from '../../../services/rolesAPI';
import * as messageAction from '../../../redux/features/message/messageSlice';
import { BACKGROUND_COLOR_FAILED, BACKGROUND_COLOR_SUCCESS } from '../../../constants';
import messages from '../../../configs/messages';
const Role = () => {
    const hiddenColumns = [];
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [isOutClick, setIsOutClick] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);
    const [action, setAction] = useState({
        add: false,
        edit: false,
        delete: false,
    });
    const fetchAPI = useCallback(async () => {
        setLoading(true);
        let response = await rolesAPI.getAllRoles();
        if (!response || !response?.isSuccess) {
            setLoading(true);
            setRoles([]);
            dispatch(
                messageAction.setMessage({
                    id: Math.random(),
                    title: 'Role',
                    message: response?.errors || messages.admin.role.retrieve_err,
                    backgroundColor: BACKGROUND_COLOR_FAILED,
                    icon: '',
                }),
            );
        } else {
            setLoading(false);
            setRoles(response?.data?.items);
        }
    });
    useEffect(() => {
        fetchAPI();
    }, []);
    const handleAddRole = () => {
        setAction({ add: true, edit: false, delete: false });
        setIsOutClick(false);
    };
    const handleUpdateRole = (roleId) => {
        const role = roles.find((val) => val.roleId === roleId);
        setAction({ add: false, edit: true, delete: false });
        setSelectedRole(role);
        setIsOutClick(false);
    };
    const handleDeleteRole = (roleId) => {
        const role = roles.find((val) => val.roleId === roleId);
        setAction({ add: false, edit: false, delete: true });
        setSelectedRole(role);
        setIsOutClick(false);
    };
    const deleteRole = async () => {
        setButtonLoading(true);
        const response = await rolesAPI.deleteRole(selectedRole.roleId);
        setButtonLoading(false);
        setIsOutClick(true);
        if (!response || !response?.isSuccess) {
            if (response.status === 401) {
                await logoutHandler(dispatch, navigate, messageAction, authAction);
            }
            dispatch(
                messageAction.setMessage({
                    id: Math.random(),
                    title: 'Role',
                    message: response?.errors || messages.admin.role.delete_err,
                    backgroundColor: BACKGROUND_COLOR_FAILED,
                    icon: '',
                }),
            );
        } else {
            dispatch(
                messageAction.setMessage({
                    id: Math.random(),
                    title: 'Role',
                    message: messages.admin.role.delete_suc,
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
                        data={roles}
                        hiddenColumns={hiddenColumns}
                        uniqueField={'roleId'}
                        isAddNew={true}
                        handleAddNew={handleAddRole}
                        handleUpdateItem={handleUpdateRole}
                        handleDeleteItem={handleDeleteRole}
                    />
                    {action.add && !isOutClick && (
                        <ModalWrapper>
                            <OutsideAlerter setIsOut={setIsOutClick}>
                                <RoleForm setAction={setAction} roles={roles} getAllRoles={fetchAPI} />
                            </OutsideAlerter>
                        </ModalWrapper>
                    )}
                    {action.edit && !isOutClick && (
                        <ModalWrapper>
                            <OutsideAlerter setIsOut={setIsOutClick}>
                                <RoleForm
                                    roles={roles}
                                    role={selectedRole}
                                    getAllRoles={fetchAPI}
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
                                    content={'Do you want to remove this role ?'}
                                    cancelClick={() => setIsOutClick(true)}
                                    confirmClick={() => deleteRole()}
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

export default Role;
