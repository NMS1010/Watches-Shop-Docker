import { useRef } from 'react';
import useOutsideAlerter from '../../hooks/useOutsideAlerter';

const OutsideAlerter = ({ children, setIsOut }) => {
    const wrapperRef = useRef(null);
    let isOut = useOutsideAlerter(wrapperRef);
    setIsOut(isOut);
    return <div ref={wrapperRef}>{children}</div>;
};
export default OutsideAlerter;
