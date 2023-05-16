import classNames from 'classnames/bind';
import styles from '../CommonCSSForm.module.scss';
import { useCallback, useEffect, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

import * as rolesAPI from '../../../../services/rolesAPI';
import * as usersAPI from '../../../../services/usersAPI';
import * as messageAction from '../../../../redux/features/message/messageSlice';
import * as authAction from '../../../../redux/features/auth/authSlice';
import { BACKGROUND_COLOR_FAILED, BACKGROUND_COLOR_SUCCESS } from '../../../../constants';
import messages from '../../../../configs/messages';

const animatedComponents = makeAnimated();
const cx = classNames.bind(styles);
const UserForm = ({ user, getAllUsers, setAction }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const userRoles = user?.roles?.map((val) => {
        return {
            label: val.roleName,
            value: val.roleId,
        };
    });
    const [inputFields, setInputFields] = useState({
        userId: user?.userId,
        roles: userRoles,
        status: user?.status,
    });
    const [allRoles, setAllRoles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [validated, setValidated] = useState(false);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputFields({ ...inputFields, [name]: value });
    };
    const fetchAPI = useCallback(async () => {
        setLoading(true);
        let response = await rolesAPI.getAllRoles();
        if (!response || !response.isSuccess) {
        } else {
            if (response.status === 401) {
                dispatch(await authAction.logout());
                navigate('/admin/login');
            }
            setAllRoles(
                response?.data?.items.map((val) => {
                    return {
                        label: val.roleName,
                        value: val.roleId,
                    };
                }),
            );
            setLoading(false);
        }
    });
    useEffect(() => {
        fetchAPI();
    }, []);
    const handleSubmit = (e) => {
        const form = e.currentTarget;
        e.preventDefault();
        if (!form.checkValidity() || inputFields?.roles?.length === 0) {
            e.stopPropagation();
            setValidated(true);
            return;
        }

        const handleUpdateUser = async () => {
            const roleIdsChosen = inputFields?.roles?.map((r) => {
                return r.value;
            });
            const userObj = {
                ...inputFields,
                roles: JSON.stringify(roleIdsChosen),
            };
            var form_data = new FormData();
            for (var key of Object.keys(userObj)) {
                form_data.append(key, userObj[key]);
            }
            setLoading(true);
            const response = await usersAPI.updateAdminUser(form_data);

            if (!response || !response.isSuccess) {
                if (response.status === 401) {
                    dispatch(await authAction.logout());
                    navigate('/admin/login');
                }
                dispatch(
                    messageAction.setMessage({
                        id: Math.random(),
                        title: 'Update',
                        message: messages.admin.user.update_profile_err,
                        backgroundColor: BACKGROUND_COLOR_FAILED,
                        icon: '',
                    }),
                );
            } else {
                dispatch(
                    messageAction.setMessage({
                        id: Math.random(),
                        title: 'Update',
                        message: messages.admin.user.update_profile_suc,
                        backgroundColor: BACKGROUND_COLOR_SUCCESS,
                        icon: '',
                    }),
                );
                setAction({ edit: false });
                await getAllUsers();
            }
            setLoading(false);
        };
        handleUpdateUser();
    };
    return (
        <div className={cx('container')}>
            <h1 className={cx('title')}>User</h1>
            <Form className={cx('form')} validated={validated} noValidate onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="validationRole">
                    <Form.Label>Roles</Form.Label>
                    <Select
                        styles={{
                            control: (baseStyles, state) => ({
                                ...baseStyles,
                                borderColor: inputFields?.roles?.length !== 0 ? 'grey' : '#dc3545',
                            }),
                        }}
                        name="userRoles"
                        onChange={(choices) => setInputFields({ ...inputFields, roles: choices })}
                        closeMenuOnSelect={false}
                        components={animatedComponents}
                        isMulti
                        defaultValue={userRoles}
                        options={allRoles}
                        isClearable={false}
                    />
                    {inputFields?.roles?.length === 0 && (
                        <small style={{ color: '#dc3545' }}>Please choose your roles</small>
                    )}
                </Form.Group>
                <Form.Group className="mb-3" controlId="validationStatus">
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                        onChange={(e) => handleChange(e)}
                        name="status"
                        className="fs-2"
                        value={inputFields?.status}
                    >
                        <option value={0}>Inactive</option>
                        <option value={1}>Active</option>
                    </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                    <div className="text-center mt-5">
                        <Button variant="outline-info" type="submit" className="fs-3 rounded-4 p-3 w-25">
                            Update
                        </Button>
                    </div>
                </Form.Group>
            </Form>
        </div>
    );
};

export default UserForm;
