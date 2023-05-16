import classNames from 'classnames/bind';
import { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './Toast.module.scss';
import { clearMessage } from '../../redux/features/message/messageSlice';

const cx = classNames.bind(styles);

const Toast = ({ children, position, autoDelete, autoDeleteTime = 5000 }) => {
    const message = useSelector((state) => {
        return state?.message;
    });
    const dispatch = useDispatch();
    const [list, setList] = useState(message);
    useEffect(() => {
        setList([...message]);
    }, [message]);
    useEffect(() => {
        const interval = setInterval(() => {
            if (autoDelete && message.length && list.length) {
                deleteToast(message[0].id);
            }
        }, autoDeleteTime);

        return () => clearInterval(interval);
    }, [message, autoDelete, autoDeleteTime, list]);
    const deleteToast = (id) => {
        setList(list.filter((toast) => toast.id !== id));
        dispatch(clearMessage(id));
    };
    return (
        <Fragment>
            <div className={cx('container') + cx(' ') + cx(`${position}`)}>
                {list.map((toast) => {
                    return (
                        <div
                            key={toast.id}
                            className={cx(`notification`) + cx(' ') + cx(`toast`) + cx(' ') + cx(`${position}`)}
                            style={{ backgroundColor: toast.backgroundColor }}
                        >
                            <button onClick={() => deleteToast(toast.id)}>X</button>
                            <div className="image">
                                <img src={toast?.icon} alt="" />
                            </div>
                            <div>
                                <p className="title">{toast.title}</p>
                                <p className="message">{toast.message}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
            {children}
        </Fragment>
    );
};

export default Toast;
