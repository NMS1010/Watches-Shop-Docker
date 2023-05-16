import classNames from 'classnames/bind';
import styles from './SidebarItem.module.scss';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
const cx = classNames.bind(styles);

const SidebarItem = ({ icon, path, content, setTitle, isHideContent = false }) => {
    return (
        <NavLink
            to={path}
            onClick={() => setTitle(content)}
            className={({ isActive }) => cx('container') + ' ' + (isActive ? cx('active') : undefined)}
        >
            <img src={icon} alt="image" className={cx('icon')} />
            {!isHideContent && <div className={cx('content')}>{content}</div>}
        </NavLink>
    );
};
SidebarItem.propTypes = {
    icon: PropTypes.any.isRequired,
    content: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    setTitle: PropTypes.func.isRequired,
};
export default SidebarItem;
