import { useEffect, useState } from 'react';

const useOutsideAlerter = (ref) => {
    const [isOut, setIsOut] = useState(false);
    useEffect(() => {
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                //alert('You clicked outside of me!');
                setIsOut(true);
            } else {
                setIsOut(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [ref]);
    return isOut;
};

export default useOutsideAlerter;
