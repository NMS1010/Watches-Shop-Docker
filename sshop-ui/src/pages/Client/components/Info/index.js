import { Form, Button } from 'react-bootstrap';
import FileUploader from '../../../../components/FileUploader';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Info = ({
    handleSubmit,
    handleChange,
    validated,
    inputFields,
    currentUser,
    setFileSelected,
    setFileSelectedError,
    fileSelectedError,
}) => {
    return (
        <div className="bg-white p-3 shadow-sm rounded-sm">
            <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8">
                <FontAwesomeIcon icon={faUser} className="text-3xl" />
                <span className="tracking-wide text-2xl">About</span>
            </div>
            <div className="text-gray-700 mt-4">
                <Form className="grid md:grid-cols-2 text-2xl" noValidate validated={validated} onSubmit={handleSubmit}>
                    <Form.Group className="grid grid-cols-2 px-4 my-4" controlId="validationFirstName">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            placeholder="First Name"
                            value={inputFields?.firstName}
                            name="firstName"
                            onChange={(e) => handleChange(e)}
                            style={{ fontSize: '1.5rem' }}
                        />
                        <Form.Control.Feedback type="invalid">Please enter your first name</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="grid grid-cols-2 px-4 my-4" controlId="validationLastName">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            placeholder="Last Name"
                            value={inputFields?.lastName}
                            name="lastName"
                            onChange={(e) => handleChange(e)}
                            style={{ fontSize: '1.5rem' }}
                        />
                        <Form.Control.Feedback type="invalid">Please enter your last name</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="grid grid-cols-2 px-4 my-4" controlId="validationEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            disabled
                            type="email"
                            placeholder="Email"
                            value={inputFields?.email}
                            name="email"
                            onChange={(e) => handleChange(e)}
                            style={{ fontSize: '1.5rem' }}
                        />
                        <Form.Control.Feedback type="invalid">Please enter your email</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="grid grid-cols-2 px-4 my-4" controlId="validationPhone">
                        <Form.Label>Phone</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            placeholder="Phone"
                            value={inputFields?.phoneNumber}
                            name="phoneNumber"
                            pattern="[0-9]{10}"
                            onChange={(e) => handleChange(e)}
                            style={{ fontSize: '1.5rem' }}
                        />
                        <Form.Control.Feedback type="invalid">Please enter your phone number</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="grid grid-cols-2 px-4 my-4" controlId="validationDob">
                        <Form.Label>Birthday</Form.Label>
                        <Form.Control
                            required
                            type="date"
                            value={inputFields?.dob}
                            name="dob"
                            onChange={(e) => handleChange(e)}
                            style={{ fontSize: '1.5rem' }}
                        />
                        <Form.Control.Feedback type="invalid">Please enter your birthday</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="grid grid-cols-2 px-4 my-4" controlId="validationGender">
                        <Form.Label>Gender</Form.Label>
                        <Form.Select
                            onChange={(e) => handleChange(e)}
                            style={{ fontSize: '1.5rem' }}
                            name="gender"
                            value={inputFields?.gender}
                        >
                            <option value={'Nam'}>Male</option>
                            <option value={'Nữ'}>Female</option>
                            <option value={'Khác'}>Other</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="grid grid-cols-2 px-4 my-4" controlId="validationUsername">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                            disabled
                            name="userName"
                            type="text"
                            value={inputFields?.userName}
                            onChange={(e) => handleChange(e)}
                            style={{ fontSize: '1.5rem' }}
                        />
                        <Form.Control.Feedback type="invalid">Please enter your user name</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="grid grid-cols-2 px-4 my-4" controlId="validationStatus">
                        <Form.Label>Status</Form.Label>
                        <Form.Select
                            disabled
                            onChange={(e) => handleChange(e)}
                            style={{ fontSize: '1.5rem' }}
                            name="status"
                            value={inputFields?.status}
                        >
                            <option value={0}>Inactive</option>
                            <option value={1}>Active</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group style={{ width: '200%' }} className="my-5" controlId="validationAvatar">
                        <div className="text-center" style={{ width: '30%', margin: 'auto' }}>
                            <FileUploader
                                imgUrl={currentUser?.avatar}
                                setFileSelected={setFileSelected}
                                setFileSelectedError={setFileSelectedError}
                            />
                            <small>{fileSelectedError}</small>
                        </div>
                        <div className="text-center mt-5">
                            <Button variant="outline-info" type="submit" className="fs-3 rounded-4 px-3 py-1 w-50">
                                Update
                            </Button>
                        </div>
                    </Form.Group>
                </Form>
            </div>
        </div>
    );
};
export default Info;
