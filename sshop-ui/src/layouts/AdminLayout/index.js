import Header from './Header';
import Sidebar from './Sidebar';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap';
import classNames from 'classnames/bind';
import styles from './AdminLayout.module.scss';
import { useState } from 'react';

const cx = classNames.bind(styles);

const AdminLayout = ({ children }) => {
    const [title, setTitle] = useState('Dashboard');
    const [isHideContent, setIsHideContent] = useState(false);
    return (
        <div className={cx('container')}>
            <Sidebar isHideContent={isHideContent} setTitle={setTitle} />
            <div className={cx('page')}>
                <Header setIsHideContent={setIsHideContent} isHideContent={isHideContent} title={title} />
                <div className={cx('content')}>{children}</div>
            </div>
        </div>
    );
};

export default AdminLayout;
