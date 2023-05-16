import { Spin } from 'antd';
import classNames from 'classnames/bind';
import styles from './Loading.module.scss';

const cx = classNames.bind(styles);
const Loading = () => {
    return (
        <div className={cx('container')}>
            <Spin size="large" />
        </div>
    );
};
export default Loading;
