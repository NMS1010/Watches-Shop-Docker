import { useState } from 'react';
import { Form } from 'react-bootstrap';
const Account = ({ isContainRegisterValue, handleChange, registerFormInput, isPasswordMatch }) => {
    return (
        <div className="text-left">
            <Form.Group md="4" className="mb-5" controlId="validationCustom01">
                <Form.Label>Username</Form.Label>
                <Form.Control
                    name="userName"
                    style={{ fontSize: '1.6rem' }}
                    size="lg"
                    type="text"
                    required
                    onChange={handleChange}
                    value={registerFormInput.userName}
                />
                <Form.Control.Feedback type="invalid">Please enter your username.</Form.Control.Feedback>
                {isContainRegisterValue.username && (
                    <p className="text-red-500 text-2xl mt-2">Username has already exist</p>
                )}
            </Form.Group>
            <Form.Group md="4" className="mb-5" controlId="validationCustom02">
                <Form.Label>Password</Form.Label>
                <Form.Control
                    name="password"
                    style={{ fontSize: '1.6rem' }}
                    size="lg"
                    type="password"
                    required
                    onChange={handleChange}
                    value={registerFormInput.password}
                />
                <Form.Control.Feedback type="invalid">Please enter your password.</Form.Control.Feedback>
            </Form.Group>
            <Form.Group md="4" controlId="validationCustom03">
                <Form.Label>Confirm password</Form.Label>
                <Form.Control
                    style={{ fontSize: '1.6rem' }}
                    size="lg"
                    type="password"
                    name="confirmPassword"
                    required
                    onChange={handleChange}
                    value={registerFormInput.confirmPassword}
                />
                <Form.Control.Feedback type="invalid">Please enter your confirm password.</Form.Control.Feedback>
                {!isPasswordMatch && <p className="text-red-500">Password does not match</p>}
            </Form.Group>
        </div>
    );
};

export default Account;
