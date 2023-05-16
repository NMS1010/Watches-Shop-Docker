import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import * as usersAPI from '../../../services/usersAPI';
import { BACKGROUND_COLOR_FAILED, BACKGROUND_COLOR_SUCCESS } from '../../../constants';
import * as authAction from '../../../redux/features/auth/authSlice';
import * as messageAction from '../../../redux/features/message/messageSlice';
import messages from '../../../configs/messages';
import Loading from '../../../components/Loading';
import Info from '../components/Info';
import Address from '../components/Address';
const Profile = () => {
    const { currentUser } = useSelector((state) => state?.auth);
    const userRoles = currentUser?.roles?.map((val) => {
        return {
            label: val.roleName,
            value: val.roleId,
        };
    });
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [validated, setValidated] = useState(false);
    const [fileSelected, setFileSelected] = useState(null);
    const [fileSelectedError, setFileSelectedError] = useState('');
    const [inputFields, setInputFields] = useState({
        userId: currentUser?.userId,
        firstName: currentUser?.firstName,
        lastName: currentUser?.lastName,
        email: currentUser?.email,
        phoneNumber: currentUser?.phoneNumber,
        dob: currentUser?.dob,
        gender: currentUser?.gender,
        roles: userRoles,
        userName: currentUser?.userName,
        status: currentUser?.status,
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputFields({ ...inputFields, [name]: value });
    };
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
                avatar: fileSelected,
            };
            var form_data = new FormData();
            for (var key of Object.keys(userObj)) {
                form_data.append(key, userObj[key]);
            }
            setLoading(true);
            const response = await usersAPI.updateUser(form_data);

            if (!response?.isSuccess) {
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
                await dispatch(
                    messageAction.setMessage({
                        id: Math.random(),
                        title: 'Update',
                        message: messages.admin.user.update_profile_suc,
                        backgroundColor: BACKGROUND_COLOR_SUCCESS,
                        icon: '',
                    }),
                );

                await dispatch(authAction.getCurrentUser());
            }
            setLoading(false);
        };
        handleUpdateUser();
    };
    return loading ? (
        <Loading />
    ) : (
        <div className="p-5 max-w-screen-xl mx-auto bg-gray-100">
            <div className="md:flex no-wrap md:-mx-2 ">
                <div className="w-full md:w-3/12 md:mx-2">
                    <div className="bg-white p-3 border-t-4 border-green-400">
                        <div className="image overflow-hidden">
                            <img
                                className="h-auto w-full mx-auto"
                                src={`${process.env.REACT_APP_HOST}/${currentUser?.avatar}`}
                                alt=""
                            />
                        </div>
                        <h1 className="text-gray-900 font-bold text-center text-4xl my-3 leading-8">
                            {currentUser?.userName}
                        </h1>

                        <ul className="bg-gray-100 text-gray-600 hover:text-gray-700 hover:shadow py-2 px-3 mt-5 divide-y rounded shadow-sm">
                            <li className="flex items-center py-3">
                                <span>Status</span>
                                <span className="ml-auto">
                                    <span className="bg-green-500 py-1 px-2 rounded text-white text-xl">
                                        {currentUser.statusCode}
                                    </span>
                                </span>
                            </li>
                            <li className="flex items-center py-3">
                                <span>Member since</span>
                                <span className="ml-auto">{currentUser.dateCreated}</span>
                            </li>
                        </ul>
                        <div className="text-center">
                            <Button variant="danger" className="rounded-4 px-3 py-1 w-50">
                                Disabled Account
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="w-full md:w-9/12 mx-2">
                    <Info
                        handleSubmit={handleSubmit}
                        handleChange={handleChange}
                        validated={validated}
                        inputFields={inputFields}
                        currentUser={currentUser}
                        setFileSelected={setFileSelected}
                        setFileSelectedError={setFileSelectedError}
                        fileSelectedError={fileSelectedError}
                    />

                    <div className="my-4"></div>
                    <Address />
                </div>
            </div>
        </div>
    );
};
export default Profile;
