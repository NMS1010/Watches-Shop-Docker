import { Box, Button, FormControl, IconButton, Input, InputAdornment, InputLabel, TextField } from '@mui/material';
import { faFacebook, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRef, useState, useEffect } from 'react';
import { ArrowForward, ArrowBack } from '@mui/icons-material';
import { Col, Form, Row } from 'react-bootstrap';
import 'react-datepicker/dist/react-datepicker.css';
import Account from './Account';
import Info from './Info';
import * as usersAPI from '../../../services/usersAPI';
import * as authAPI from '../../../services/authAPI';
import * as messageAction from '../../../redux/features/message/messageSlice';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { BACKGROUND_COLOR_FAILED, BACKGROUND_COLOR_SUCCESS } from '../../../constants';
import messages from '../../../configs/messages';
import { useNavigate } from 'react-router-dom';
import configs from '../../../configs';
import Loading from '../../../components/Loading';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Google from '../Login/Google';
const Register = () => {
    const dispatch = useDispatch();
    const googleUser = JSON.parse(localStorage.getItem('googleUser'));
    const [loading, setLoading] = useState(false);
    const [nextFields, setNextFields] = useState(false);
    const [validated, setValidated] = useState(false);
    const [isPasswordMatch, setIsPasswordMatch] = useState(true);
    const navigate = useNavigate();
    const [isContainRegisterValue, setIsContainRegisterValue] = useState({
        username: false,
        phone: false,
        email: false,
    });
    const [isSubmit, setIsSubmit] = useState(true);
    const formRef = useRef(null);
    const [avatar, setAvatar] = useState(null);
    const [fileSelectedError, setFileSelectedError] = useState('');
    const [registerFormInput, setRegisterFormInput] = useState({
        userName: '',
        password: '',
        firstName: googleUser?.given_name || '',
        lastName: googleUser?.family_name || '',
        phoneNumber: '',
        email: googleUser?.email || '',
        gender: 'Nam',
        dob: new Date().toLocaleDateString(),
        confirmPassword: '',
        providerKey: googleUser ? googleUser['sub'] : '',
        loginProvider: googleUser ? 'Google' : '',
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setRegisterFormInput({ ...registerFormInput, [name]: value });
    };
    const validatedForm = () => {
        if (!formRef.current.checkValidity() || (avatar == null && nextFields)) {
            if (avatar == null && nextFields) {
                setFileSelectedError('Please choose an image');
            }
            setValidated(true);
            setIsSubmit(false);
            return false;
        }
        return true;
    };
    const checkUsername = useCallback(async () => {
        const response = await usersAPI.checkUsername(registerFormInput.userName);
        return response?.data;
    }, [registerFormInput.userName]);
    const checkEmail = useCallback(async () => {
        const response = await usersAPI.checkEmail(registerFormInput.email);
        return response?.data;
    }, [registerFormInput.email]);
    const checkPhone = useCallback(async () => {
        const response = await usersAPI.checkPhone(registerFormInput.phoneNumber);
        return response?.data;
    }, [registerFormInput.phoneNumber]);
    const handleNextField = async (e) => {
        e.preventDefault();
        if (!validatedForm()) {
            setIsContainRegisterValue({ ...isContainRegisterValue, username: false });
            return;
        }
        if (registerFormInput.confirmPassword !== registerFormInput.password) {
            setIsSubmit(false);
            setIsPasswordMatch(false);
            return;
        }
        setIsPasswordMatch(true);
        setLoading(true);
        const containUsername = await checkUsername();

        if (containUsername) {
            setIsContainRegisterValue({ ...isContainRegisterValue, username: containUsername });
            setNextFields(false);
            return;
        }
        setLoading(false);
        setIsContainRegisterValue({ ...isContainRegisterValue, username: false });
        setNextFields(!nextFields);
        setIsSubmit(true);
    };
    const handleSubmit = async () => {
        if (!isSubmit) return;

        if (!validatedForm()) {
            return;
        }
        setLoading(true);
        const containEmail = await checkEmail();
        const containPhone = await checkPhone();

        setIsContainRegisterValue({ ...isContainRegisterValue, email: containEmail, phone: containPhone });

        if (containEmail || containPhone) {
            setLoading(false);
            return;
        }
        const registerFormData = new FormData();
        const keys = Object.keys(registerFormInput);
        for (let key of keys) {
            registerFormData.append(key, registerFormInput[key]);
        }
        registerFormData.append('avatar', avatar);
        registerFormData.append('host', window.location.protocol + '//' + window.location.host);
        const response = await authAPI.register(registerFormData);
        let message = {
            id: Math.random(),
            title: 'Register',
            message: response?.errors,
            backgroundColor: BACKGROUND_COLOR_FAILED,
            icon: '',
        };
        if (response && response.isSuccess) {
            message.backgroundColor = BACKGROUND_COLOR_SUCCESS;
            message.message = messages.client.register.register_succ;
        }
        dispatch(messageAction.setMessage(message));
        setLoading(false);
        navigate(configs.routes.auth);
    };
    return loading ? (
        <Loading />
    ) : (
        <div className="mx-auto max-w-screen-xl text-center">
            <h2 className="text-center text-6xl font-bold">Register your account</h2>
            <div>
                <div class="flex items-center justify-center w-max m-auto">
                    <hr class="w-64 h-1 my-8 bg-gray-500 border-0 rounded dark:bg-gray-700" />
                    <p className="text-2xl mx-4 mt-2 text-slate-400">Or register</p>
                    <hr class="w-64 h-1 my-8 bg-gray-500 border-0 rounded dark:bg-gray-700" />
                </div>
                <div>
                    <Form
                        ref={formRef}
                        className="w-1/2 m-auto"
                        validated={validated}
                        noValidate
                        onSubmit={handleNextField}
                    >
                        {!nextFields ? (
                            <Account
                                isContainRegisterValue={isContainRegisterValue}
                                isPasswordMatch={isPasswordMatch}
                                handleChange={handleChange}
                                registerFormInput={registerFormInput}
                            />
                        ) : (
                            <Info
                                googleUser={googleUser}
                                avatar={avatar}
                                isContainRegisterValue={isContainRegisterValue}
                                fileSelectedError={fileSelectedError}
                                setFileSelected={setAvatar}
                                setFileSelectedError={setFileSelectedError}
                                handleChange={handleChange}
                                registerFormInput={registerFormInput}
                                setRegisterFormInput={setRegisterFormInput}
                            />
                        )}
                        <div className="flex justify-between">
                            <Button className="mt-5" variant="contained" type="submit">
                                {nextFields ? <ArrowBack /> : <ArrowForward />}
                            </Button>
                            {nextFields && (
                                <Button
                                    className="mt-5 text-2xl p-3"
                                    variant="contained"
                                    onClick={() => handleSubmit()}
                                >
                                    Register
                                </Button>
                            )}
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default Register;
