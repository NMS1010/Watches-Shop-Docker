import { forwardRef, useEffect, useRef } from 'react';
import styles from './CheckBox.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);
const Checkbox = ({ indeterminate, ...rest }, ref) => {
    const defaultRef = useRef();
    const resolvedRef = ref || defaultRef;

    useEffect(() => {
        resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
        <label className={cx('container')}>
            <input className={cx('form-input-checkbox')} type="checkbox" ref={resolvedRef} {...rest} />
            <span className={cx('checkmark')}></span>
        </label>
    );
};
export default forwardRef(Checkbox);
