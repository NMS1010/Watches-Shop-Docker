import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import classNames from 'classnames/bind';
import styles from '../CommonCSSForm.module.scss';

import Button from '../../../../components/Button';

import * as rolesAPI from '../../../../services/rolesAPI';
import * as messageAction from '../../../../redux/features/message/messageSlice';
import * as authAction from '../../../../redux/features/auth/authSlice';
import logoutHandler from '../../../../utils/logoutHandler';
import { BACKGROUND_COLOR_FAILED, BACKGROUND_COLOR_SUCCESS } from '../../../../constants';
import messages from '../../../../configs/messages';

const cx = classNames.bind(styles);

const RoleForm = ({ setAction = () => {}, role = null, roles = [], getAllRoles = () => {} }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [inputFields, setInputFields] = useState({
        roleName: role?.roleName,
        roleId: role?.roleId,
    });
    const [validationMessage, setValidationMessage] = useState({
        roleName: '',
    });

    const validation = useCallback(() => {
        let errors = { ...validationMessage };
        inputFields.roleName?.trim() ? (errors.roleName = '') : (errors.roleName = 'Role name is required');
        setValidationMessage(errors);
    });
    useEffect(() => {
        validation();
    }, [inputFields]);
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
        const roleObj = new FormData();
        roleObj.append('roleName', inputFields?.roleName);
        if (role) {
            roleObj.append('roleId', role?.roleId);
        }
        const handleRole = async () => {
            setLoading(true);
            let response = role !== null ? await rolesAPI.updateRole(roleObj) : await rolesAPI.createRole(roleObj);

            if (!response || !response.isSuccess) {
                if (response.status === 401) {
                    await logoutHandler(dispatch, navigate, messageAction, authAction);
                }
                dispatch(
                    messageAction.setMessage({
                        id: Math.random(),
                        title: 'Role',
                        message: response?.errors || messages.admin.role.handling_err,
                        backgroundColor: BACKGROUND_COLOR_FAILED,
                        icon: '',
                    }),
                );
            } else {
                dispatch(
                    messageAction.setMessage({
                        id: Math.random(),
                        title: 'Role',
                        message: messages.admin.role.handling_suc,
                        backgroundColor: BACKGROUND_COLOR_SUCCESS,
                        icon: '',
                    }),
                );
                setAction({ add: false, edit: false, delete: false });
                await getAllRoles();
            }
            setLoading(false);
        };
        handleRole();
    };
    return (
        <div className={cx('container')} style={{ height: '30vh' }}>
            <h1 className={cx('title')}>Role</h1>
            <form className={cx('form')} onSubmit={handleSubmit}>
                <div className={cx('form-group')}>
                    <label htmlFor="roleName">Name</label>
                    <input name="roleName" value={inputFields.roleName} type={'text'} onChange={handleChange} />
                    <small>{validationMessage.roleName}</small>
                </div>
                <div className={cx('action-btn')}>
                    <Button className={cx('submit-btn')} type="submit" loading={loading}>
                        {role ? 'Update' : 'Create'}
                    </Button>
                </div>
            </form>
        </div>
    );
};
export default RoleForm;
