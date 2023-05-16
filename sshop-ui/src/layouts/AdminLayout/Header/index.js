import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-regular-svg-icons';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import { useState } from 'react';
import * as authAction from '../../../redux/features/auth/authSlice';
import * as messageAction from '../../../redux/features/message/messageSlice';
import { useSelector, useDispatch } from 'react-redux';
import logoutHandler from '../../../utils/logoutHandler';
import config from '../../../configs';
import { Dropdown, Space } from 'antd';
import { useMemo } from 'react';

const cx = classNames.bind(styles);

const Header = ({ title, setIsHideContent, isHideContent }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentUser } = useSelector((state) => state?.auth);
    const items = useMemo(() => {
        return [
            {
                key: '1',
                label: (
                    <Link to={config.routes.admin_profile}>
                        <span>My profile</span>
                    </Link>
                ),
            },
            {
                key: '2',
                label: (
                    <Link onClick={async () => await logoutHandler(dispatch, navigate, messageAction, authAction)}>
                        Logout
                    </Link>
                ),
            },
        ];
    }, [dispatch, navigate]);
    const [isShowNotify, setIsShowNotify] = useState(false);
    const [isShowUserOption, setIsShowUserOption] = useState(false);
    const handleShowNotify = () => {
        setIsShowNotify(!isShowNotify);
        setIsShowUserOption(false);
    };
    // const handleShowUserOption = () => {
    //     setIsShowUserOption(!isShowUserOption);
    // };
    return (
        <header className={cx('container')}>
            <div className={cx('info')}>
                <div
                    className={cx('bar')}
                    onClick={() => setIsHideContent(!isHideContent)}
                    style={{ cursor: 'pointer' }}
                >
                    <FontAwesomeIcon icon={faBars} />
                </div>
                <p className={cx('title')}>{title}</p>
            </div>
            <div className={cx('action')}>
                <div className={cx('notify')}>
                    <FontAwesomeIcon icon={faBell} onClick={() => handleShowNotify()} />
                </div>
                <div className={cx('user-detail')}>
                    <Dropdown className=" hover:cursor-pointer" menu={{ items }}>
                        <Space>
                            <div class="w-14 h-14 ml-5">
                                <img
                                    class="rounded-full h-full border border-gray-100 shadow-sm"
                                    src={`${process.env.REACT_APP_HOST}${currentUser.avatar}`}
                                    alt="user image"
                                />
                            </div>
                            <p className="mt-3 text-3xl">{currentUser.userName}</p>
                        </Space>
                    </Dropdown>
                </div>
            </div>
        </header>
    );
};

export default Header;
