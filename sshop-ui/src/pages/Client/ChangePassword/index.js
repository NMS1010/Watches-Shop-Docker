import { useState } from 'react';
import Button from '../../../components/Button';
import { useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import config from '../../../configs';
import * as userAPI from '../../../services/usersAPI';
import * as messageAction from '../../../redux/features/message/messageSlice';
import messages from '../../../configs/messages';
import { useDispatch } from 'react-redux';
import { BACKGROUND_COLOR_FAILED, BACKGROUND_COLOR_SUCCESS } from '../../../constants';
const ChangePassword = () => {
    const [loading, setLoading] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const [inputFields, setInputFields] = useState({
        password: '',
        confirmPassword: '',
    });
    const [passwordMessage, setPasswordMessage] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleClick = async () => {
        if (inputFields.password.trim() === '' || inputFields.confirmPassword.trim() === '') {
            setPasswordMessage('Please enter this field');
            return;
        }
        if (inputFields.password !== inputFields.confirmPassword) {
            setPasswordMessage('Confirm password does not match');
            return;
        }
        const frmData = new FormData();
        frmData.append('email', searchParams.get('email'));
        frmData.append('token', searchParams.get('token'));
        frmData.append('password', inputFields.password);
        setLoading(true);
        const resp = await userAPI.resetPassword(frmData);
        let message = {
            id: Math.random(),
            title: 'Forgot password',
            message: resp?.errors || messages.client.reset.succ,
            backgroundColor: BACKGROUND_COLOR_SUCCESS,
            icon: '',
        };
        if (!resp?.isSuccess) {
            message.backgroundColor = BACKGROUND_COLOR_FAILED;
            message.message = resp?.errors || messages.client.reset.failed;
        }
        dispatch(messageAction.setMessage(message));
        setLoading(false);
        if (resp && resp.isSuccess) {
            navigate(config.routes.auth);
        }
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputFields({ ...inputFields, [name]: value });
    };
    return (
        <section className="grid h-screen place-content-center bg-slate-900 text-slate-300">
            <div className="mb-10 text-center text-indigo-400">
                <h1 className="text-3xl font-bold tracking-widest">CHANGE PASSWORD</h1>
                <p>
                    Please enter your new <span className="font-bold">Password</span> and
                    <span className="font-bold">Confirm</span> password
                </p>
            </div>
            <div className="flex flex-col items-center justify-center space-y-6">
                <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Password"
                    required
                    onChange={handleChange}
                    className="w-full text-xl py-4 appearance-none rounded-full border-0 bg-slate-800/50 p-2 px-4 focus:bg-slate-800 focus:ring-2 focus:ring-orange-500"
                />
                <div className="w-full">
                    <input
                        type="password"
                        required
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        onChange={handleChange}
                        className="w-full appearance-none text-xl py-4 rounded-full border-0 bg-slate-800/50 p-2 px-4 focus:bg-slate-800 focus:ring-2 focus:ring-orange-500"
                    />
                    <p id="validation" className="text-center text-orange-500 italic text-2xl mt-3">
                        {passwordMessage}
                    </p>
                </div>
                <Button
                    loading={loading}
                    className="rounded-full bg-indigo-500 p-2 px-4 text-white hover:bg-orange-500"
                    onClick={handleClick}
                >
                    Change Password
                </Button>
            </div>
        </section>
    );
};

export default ChangePassword;
