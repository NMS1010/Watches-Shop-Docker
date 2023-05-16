import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import config from '../../../configs';
import { nanoid } from '@reduxjs/toolkit';
const Google = () => {
    const navigate = useNavigate();

    const onSuccess = (credentialResponse) => {
        localStorage.setItem('googleCredential', JSON.stringify(credentialResponse));
        navigate(config.routes.auth, { state: nanoid() });
    };
    return (
        <GoogleLogin
            onSuccess={onSuccess}
            onError={() => {
                console.log('Login Failed');
            }}
        />
    );
};

export default Google;
