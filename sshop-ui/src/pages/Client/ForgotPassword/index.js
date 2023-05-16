import { Link, useNavigate } from 'react-router-dom';
import config from '../../../configs';
import * as userAPI from '../../../services/usersAPI';
import * as messageAction from '../../../redux/features/message/messageSlice';
import messages from '../../../configs/messages';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { BACKGROUND_COLOR_FAILED, BACKGROUND_COLOR_SUCCESS } from '../../../constants';
import Button from '../../../components/Button';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [emailErr, setEmailErr] = useState('');
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleClick = async () => {
        if (!email || email.trim() === '') {
            setEmailErr('Please enter your email');
            return;
        }
        const frmData = new FormData();
        frmData.append('email', email);
        frmData.append('host', window.location.protocol + '//' + window.location.host);
        setLoading(true);
        const resp = await userAPI.forgotPassword(frmData);
        let message = {
            id: Math.random(),
            title: 'Forgot password',
            message: resp?.errors || messages.client.forgot.succ,
            backgroundColor: BACKGROUND_COLOR_SUCCESS,
            icon: '',
        };
        if (!resp?.isSuccess) {
            message.backgroundColor = BACKGROUND_COLOR_FAILED;
            message.message = resp?.errors || messages.client.forgot.failed;
        }
        dispatch(messageAction.setMessage(message));
        setLoading(false);
        if (resp && resp.isSuccess) {
            navigate(config.routes.auth);
        }
    };
    return (
        <div className="max-w-screen-xl mx-auto">
            <div className="flex justify-center px-6 my-12">
                <div className="w-full xl:w-3/4 lg:w-11/12 flex">
                    <div
                        className="w-full h-auto bg-gray-400 hidden lg:block lg:w-1/2 bg-cover rounded-l-lg"
                        style={{ backgroundImage: "url('https://source.unsplash.com/oWTW-jNGl9I/600x800')" }}
                    ></div>
                    <div className="w-full lg:w-1/2 bg-white p-5 rounded-lg lg:rounded-l-none">
                        <div className="px-8 mb-4 text-center">
                            <h3 className="pt-4 mb-4 text-5xl">Forgot Your Password?</h3>
                            <p className="mb-4 text-xl text-gray-700">
                                We get it, stuff happens. Just enter your email address below and we'll send you a link
                                to reset your password!
                            </p>
                        </div>
                        <form className="px-8 pt-6 pb-8 mb-4 bg-white rounded">
                            <div className="mb-4">
                                <label className="block mb-2 text-xl font-bold text-gray-700" for="email">
                                    Email
                                </label>
                                <input
                                    className="w-full py-4 text-xl leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                                    id="email"
                                    required
                                    onChange={(e) => setEmail(e.target.value)}
                                    type="email"
                                    placeholder="Enter Email Address..."
                                />
                            </div>
                            <p className="py-3">{emailErr}</p>
                            <div className="mb-6 text-center">
                                <Button
                                    loading={loading}
                                    className="w-full px-4 py-2 font-bold text-white bg-red-500 rounded-full hover:bg-red-700 focus:outline-none focus:shadow-outline"
                                    onClick={handleClick}
                                >
                                    Reset Password
                                </Button>
                            </div>
                            <hr className="mb-6 border-t" />
                            <div className="text-center">
                                <Link
                                    className="inline-block text-xl text-blue-500 align-baseline hover:text-blue-800"
                                    to={config.routes.signup}
                                >
                                    Create an Account!
                                </Link>
                            </div>
                            <div className="text-center">
                                <Link
                                    className="inline-block text-xl text-blue-500 align-baseline hover:text-blue-800"
                                    to={config.routes.auth}
                                >
                                    Already have an account? Login!
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
