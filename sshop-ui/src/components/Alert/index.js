import classNames from 'classnames/bind';
import Button from '../Button';
import styles from './Alert.module.scss';
const cx = classNames.bind(styles);
const Alert = ({ title, content, confirmClick, cancelClick, loading = false }) => {
    return (
        <div className={cx('container')}>
            <h1 className={cx('title')}>{title}</h1>
            <p className={cx('notify')}>{content}</p>
            <div className={cx('action')}>
                <Button className={cx('confirm-btn')} onClick={confirmClick} loading={loading}>
                    Confirm
                </Button>
                <Button className={cx('cancel-btn')} onClick={cancelClick}>
                    Cancel
                </Button>
            </div>
        </div>
    );
};

export default Alert;
