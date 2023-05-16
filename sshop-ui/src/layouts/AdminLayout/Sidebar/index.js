import classNames from 'classnames/bind';
import { NavLink } from 'react-router-dom';

import SidebarItem from '../Sidebar/SidebarItem';
import styles from './Sidebar.module.scss';

import logo from '../../../assets/images/admin/logo.svg';
import config from '../../../configs';
import sideBarItemList from './itemList';
const cx = classNames.bind(styles);

const Sidebar = ({ setTitle, isHideContent = false }) => {
    return (
        <div className={cx('container')}>
            <div className={cx('icon')}>
                <NavLink to={config.routes.admin_home}>
                    <img src={logo} alt="logo" />
                </NavLink>
            </div>
            <div className={cx('content')}>
                {sideBarItemList.map((item, idx) => (
                    <SidebarItem
                        key={idx}
                        path={item.path}
                        setTitle={setTitle}
                        content={item.content}
                        icon={item.icon}
                        isHideContent={isHideContent}
                    />
                ))}
            </div>
        </div>
    );
};

export default Sidebar;
