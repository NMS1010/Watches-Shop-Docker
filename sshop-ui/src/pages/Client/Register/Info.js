import { Col, Form, Row } from 'react-bootstrap';
import ReactDatePicker from 'react-datepicker';
import FileUploader from '../../../components/FileUploader';
const Info = ({
    avatar,
    handleChange,
    registerFormInput,
    setRegisterFormInput,
    setFileSelected,
    setFileSelectedError,
    fileSelectedError,
    isContainRegisterValue,
    googleUser = null,
}) => {
    return (
        <div className="text-left">
            <Row>
                <FileUploader
                    setFileSelected={setFileSelected}
                    setFileSelectedError={setFileSelectedError}
                    imageStyle={'w-1/4 m-auto rounded-2xl'}
                    imgUrl={avatar ? URL.createObjectURL(avatar) : ''}
                />
                <p className="text-red-400 text-center">{fileSelectedError}</p>
            </Row>
            <Row>
                <Form.Group as={Col} md="6" className="mb-5" controlId="validationCustom04">
                    <Form.Label>First name</Form.Label>
                    <Form.Control
                        name="firstName"
                        style={{ fontSize: '1.6rem' }}
                        size="lg"
                        type="text"
                        required
                        onChange={handleChange}
                        value={registerFormInput.firstName}
                    />
                    <Form.Control.Feedback type="invalid">Please enter your first name.</Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-5" controlId="validationCustom05">
                    <Form.Label>Last name</Form.Label>
                    <Form.Control
                        name="lastName"
                        style={{ fontSize: '1.6rem' }}
                        size="lg"
                        type="text"
                        required
                        onChange={handleChange}
                        value={registerFormInput.lastName}
                    />
                    <Form.Control.Feedback type="invalid">Please enter your last name.</Form.Control.Feedback>
                </Form.Group>
            </Row>
            <Row>
                <Form.Group md="6" as={Col} className="mb-5" controlId="validationCustom07">
                    <Form.Label>Birthday</Form.Label>
                    <ReactDatePicker
                        selected={new Date(registerFormInput.dob)}
                        onChange={(date) => {
                            setRegisterFormInput({
                                ...registerFormInput,
                                dob: date.toLocaleDateString(),
                            });
                        }}
                        // onSelect={(date) => {
                        //     setRegisterFormInput({ ...registerFormInput, dob: date });
                        // }}
                        name="dob"
                        className="text-3xl border border-slate-300 rounded-xl w-full"
                    />
                </Form.Group>
                <Form.Group md="6" as={Col} className="mb-5">
                    <Form.Label>Gender</Form.Label>
                    <Form.Select
                        name="gender"
                        style={{ fontSize: '1.6rem' }}
                        size="lg"
                        required
                        onChange={handleChange}
                        value={registerFormInput.gender}
                    >
                        <option value={'Nam'}>Nam</option>
                        <option value={'Nữ'}>Nữ</option>
                    </Form.Select>
                </Form.Group>
            </Row>
            <Row>
                <Form.Group md="6" className="mb-5" controlId="validationCustom06">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        name="email"
                        style={{ fontSize: '1.6rem' }}
                        size="lg"
                        type="email"
                        required
                        readOnly={googleUser ? true : false}
                        onChange={handleChange}
                        value={registerFormInput.email}
                    />
                    <Form.Control.Feedback type="invalid">Please enter your email.</Form.Control.Feedback>
                    {isContainRegisterValue.email && (
                        <p className="text-red-500 text-2xl mt-2">Email has already exist</p>
                    )}
                </Form.Group>
                <Form.Group md="6" className="mb-5" controlId="validationCustom07">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                        name="phoneNumber"
                        style={{ fontSize: '1.6rem' }}
                        size="lg"
                        type="text"
                        pattern="[0-9]{10}"
                        required
                        onChange={handleChange}
                        value={registerFormInput.phoneNumber}
                    />
                    <Form.Control.Feedback type="invalid">Please enter your phone number.</Form.Control.Feedback>
                    {isContainRegisterValue.phone && (
                        <p className="text-red-500 text-2xl mt-2">Phone number has already exist</p>
                    )}
                </Form.Group>
            </Row>
        </div>
    );
};
export default Info;
