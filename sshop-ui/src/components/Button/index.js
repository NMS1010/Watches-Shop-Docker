import classNames from 'classnames/bind';
import styles from './Button.module.scss';
import loader from '../../assets/images/loader.svg';
const cx = classNames.bind(styles);
const Button = ({ type = '', className, children, onClick, loading = false }) => {
    let styles = loading ? { backgroundColor: '#e7e8e9', color: '#9fa3a9', cursor: 'not-allowed' } : {};
    return (
        <button style={styles} type={type} onClick={onClick} className={className} disabled={loading}>
            {!loading ? children : <img src={loader} className={cx('loading')} alt="Loading" />}
        </button>
    );
};
export default Button;
