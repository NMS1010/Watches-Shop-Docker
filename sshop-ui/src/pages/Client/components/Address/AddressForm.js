import { useCallback } from 'react';
import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import * as addressOpenAPI from '../../../../services/openAPI/openAddress';
import * as addressAPI from '../../../../services/addressAPI';
import * as messageAction from '../../../../redux/features/message/messageSlice';
import * as authUtil from '../../../../utils/authUtils';
import config from '../../../../configs';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { BACKGROUND_COLOR_FAILED, BACKGROUND_COLOR_SUCCESS } from '../../../../constants';
import messages from '../../../../configs/messages';
const AddressForm = ({ setOpenForm, address }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [provinces, setProvinces] = useState([]);
    const [selectedProvinceCode, setSelectedProvinceCode] = useState(address?.provinceCode || 0);
    const [districts, setDistricts] = useState([]);
    const [selectedDistrictCode, setSelectedDistrictCode] = useState(address?.districtCode || 0);
    const [wards, setWards] = useState([]);
    const [selectedWardCode, setSelectedWardCode] = useState(address?.wardCode || 0);
    const [validated, setValidated] = useState(false);
    const [dataFields, setDataFields] = useState({
        firstName: address?.firstName,
        lastName: address?.lastName,
        phone: address?.phone,
        specificAddress: address?.specificAddress,
        wardName: address?.wardName,
        wardCode: address?.wardCode || 0,
        districtName: address?.districtName,
        districtCode: address?.districtCode || 0,
        provinceName: address?.provinceName,
        provinceCode: address?.provinceCode || 0,
        isDefault: address?.isDefault || false,
    });
    const fetchProvince = useCallback(async () => {
        const response = await addressOpenAPI.getProvinces({ depth: 1 });
        if (response) {
            if (response.length > 0) {
                let province = response.find((val) => val.code === selectedProvinceCode) || response[0];
                setSelectedProvinceCode(province.code);
                setDataFields({ ...dataFields, provinceCode: province.code, provinceName: province.name });
            }
            setProvinces(response);
        }
    }, []);
    const fetchDistrict = useCallback(async () => {
        if (selectedProvinceCode === 0) return;
        const response = await addressOpenAPI.getDistrictsByProvinceCode(selectedProvinceCode, { depth: 2 });
        if (response) {
            if (response.districts.length > 0) {
                let district =
                    response.districts.find((val) => val.code === selectedDistrictCode) || response.districts[0];

                setSelectedDistrictCode(district.code);
                setDataFields({
                    ...dataFields,
                    districtCode: district.code,
                    districtName: district.name,
                    provinceCode: response.code,
                    provinceName: response.name,
                });
            }
            setDistricts(response.districts);
        }
    }, [selectedProvinceCode]);
    const fetchWard = useCallback(async () => {
        if (selectedDistrictCode === 0) return;
        const response = await addressOpenAPI.getWardsByDistrictCode(selectedDistrictCode, { depth: 2 });
        if (response) {
            if (response.wards.length > 0) {
                let ward = response.wards.find((val) => val.code === selectedWardCode) || response.wards[0];
                setSelectedWardCode(ward.code);
                setDataFields({
                    ...dataFields,
                    wardCode: ward.code,
                    wardName: ward.name,
                    districtName: response.name,
                    districtCode: response.code,
                });
            }
            setWards(response.wards);
        }
    }, [selectedDistrictCode]);
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (e.target.type === 'checkbox') {
            setDataFields({ ...dataFields, isDefault: e.target.checked });
        } else setDataFields({ ...dataFields, [name]: value });
    };
    const handleSubmit = async (e) => {
        const form = e.currentTarget;
        e.preventDefault();
        if (!form.checkValidity()) {
            e.stopPropagation();
            setValidated(true);
            return;
        }
        let form_data = new FormData();
        form_data.append('userId', authUtil.getUserId());
        for (let key of Object.keys(dataFields)) {
            form_data.append(key, dataFields[key]);
        }
        if (address) {
            form_data.append('addressId', address.addressId);
            form_data.append('wardId', address.wardId);
            form_data.append('districtId', address.districtId);
            form_data.append('provinceId', address.provinceId);
        }
        const response = address
            ? await addressAPI.updateAddress(form_data)
            : await addressAPI.createAddress(form_data);
        if (!response?.isSuccess) {
            dispatch(
                messageAction.setMessage({
                    id: Math.random(),
                    title: 'Address',
                    message: response?.errors?.join('\n'),
                    backgroundColor: BACKGROUND_COLOR_FAILED,
                    icon: '',
                }),
            );
        } else {
            dispatch(
                messageAction.setMessage({
                    id: Math.random(),
                    title: 'Address',
                    message: messages.client.profile.address[!address ? 'add_success' : 'update_success'],
                    backgroundColor: BACKGROUND_COLOR_SUCCESS,
                    icon: '',
                }),
            );
            setOpenForm(false);
        }
    };
    useEffect(() => {
        fetchProvince();
    }, []);
    useEffect(() => {
        fetchDistrict();
    }, [selectedProvinceCode]);
    useEffect(() => {
        fetchWard();
    }, [selectedDistrictCode]);
    useEffect(() => {
        if (selectedWardCode === 0) return;
        const ward = wards.find((val) => val.code == selectedWardCode);
        setDataFields({
            ...dataFields,
            wardCode: ward?.code,
            wardName: ward?.name,
        });
    }, [selectedWardCode]);
    return (
        <div
            className="overflow-auto absolute top-1/2 left-1/2 w-1/2 rounded-3xl p-5"
            style={{
                transform: 'translate(-50%, -50%)',
                backgroundColor: 'rgb(255, 255, 255)',
                color: 'rgba(0, 0, 0, 0.87)',
            }}
        >
            <h1 className="text-center py-3">Address</h1>
            <Form className="grid md:grid-cols-2 text-2xl" noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group className="grid grid-cols-2 px-4 my-4" controlId="validationFirstName">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                        required
                        type="text"
                        placeholder="First Name"
                        value={dataFields?.firstName}
                        name="firstName"
                        onChange={(e) => handleChange(e)}
                        style={{ fontSize: '1.2rem' }}
                    />
                    <Form.Control.Feedback type="invalid">Please enter your first name</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="grid grid-cols-2 px-4 my-4" controlId="validationLastName">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                        required
                        type="text"
                        placeholder="Last Name"
                        value={dataFields?.lastName}
                        name="lastName"
                        onChange={(e) => handleChange(e)}
                        style={{ fontSize: '1.2rem' }}
                    />
                    <Form.Control.Feedback type="invalid">Please enter your last name</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="grid grid-cols-2 px-4 my-4" controlId="validationPhone">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                        required
                        type="text"
                        placeholder="Phone"
                        value={dataFields?.phone}
                        name="phone"
                        pattern="[0-9]{10}"
                        onChange={(e) => handleChange(e)}
                        style={{ fontSize: '1.2rem' }}
                    />
                    <Form.Control.Feedback type="invalid">Please enter your phone number</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="grid grid-cols-2 px-4 my-4" controlId="validationLastName">
                    <Form.Label>Street</Form.Label>
                    <Form.Control
                        required
                        type="text"
                        placeholder="Street"
                        value={dataFields?.specificAddress}
                        name="specificAddress"
                        onChange={(e) => handleChange(e)}
                        style={{ fontSize: '1.2rem' }}
                    />
                    <Form.Control.Feedback type="invalid">Please enter your street</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="grid grid-cols-2 px-4 my-4" controlId="validationGender">
                    <Form.Label>Province</Form.Label>
                    <Form.Select
                        onChange={(e) => {
                            setSelectedProvinceCode(e.target.value);
                            handleChange(e);
                        }}
                        style={{ fontSize: '1.5rem' }}
                        name="provinceCode"
                        value={selectedProvinceCode}
                    >
                        {provinces.map((p, idx) => (
                            <option value={p.code} key={idx}>
                                {p.name}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>
                <Form.Group className="grid grid-cols-2 px-4 my-4" controlId="validationGender">
                    <Form.Label>District</Form.Label>
                    <Form.Select
                        onChange={(e) => {
                            setSelectedDistrictCode(e.target.value);
                            handleChange(e);
                        }}
                        style={{ fontSize: '1.5rem' }}
                        name="districtCode"
                        value={selectedDistrictCode}
                    >
                        {districts.map((d, idx) => (
                            <option value={d.code} key={idx}>
                                {d.name}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>
                <Form.Group className="grid grid-cols-2 px-4 my-4" controlId="validationGender">
                    <Form.Label>Ward</Form.Label>
                    <Form.Select
                        onChange={(e) => {
                            setSelectedWardCode(e.target.value);
                            handleChange(e);
                        }}
                        style={{ fontSize: '1.5rem' }}
                        name="wardCode"
                        value={selectedWardCode}
                    >
                        {wards.map((w, idx) => (
                            <option value={w.code} key={idx}>
                                {w.name}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>
                <Form.Group className="grid grid-cols-2 px-4 my-4" controlId="validationGender">
                    <Form.Check
                        onChange={(e) => {
                            handleChange(e);
                        }}
                        checked={dataFields?.isDefault}
                        style={{ fontSize: '1.5rem' }}
                        label="Is Default ?"
                        name="isDefault"
                    />
                </Form.Group>
                <div className="text-center mt-5">
                    <Button variant="outline-info" type="submit" className="fs-3 rounded-4 px-3 py-1 w-50">
                        {address ? 'Update' : 'Create'}
                    </Button>
                </div>
                <div className="text-center mt-5">
                    <Button
                        variant="outline-danger"
                        onClick={() => setOpenForm(false)}
                        className="fs-3 rounded-4 px-3 py-1 w-50"
                    >
                        Cancel
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default AddressForm;
