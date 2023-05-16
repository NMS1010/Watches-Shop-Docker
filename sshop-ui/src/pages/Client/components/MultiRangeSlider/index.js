import React, { useCallback, useEffect, useState, useRef } from 'react';
import classNames from 'classnames/bind';
import styles from './MultiRangeSlider.scss';
const cx = classNames.bind(styles);
const MultiRangeSlider = ({ min, max, step, onChange }) => {
    const [minVal, setMinVal] = useState(min);
    const [maxVal, setMaxVal] = useState(max);
    const minValRef = useRef(min);
    const maxValRef = useRef(max);
    const range = useRef(null);

    // chuyển sang %
    const getPercent = useCallback((value) => Math.round(((value - min) / (max - min)) * 100), [min, max]);

    // Đổi chiều dài của thanh màu khi kéo bên trái
    useEffect(() => {
        const minPercent = getPercent(minVal);
        const maxPercent = getPercent(maxValRef.current);

        if (range.current) {
            range.current.style.left = `${minPercent}%`;
            range.current.style.width = `${maxPercent - minPercent}%`;
        }
    }, [minVal, getPercent]);

    // Đổi chiều dài của thanh màu khi kéo bên phải
    useEffect(() => {
        const minPercent = getPercent(minValRef.current);
        const maxPercent = getPercent(maxVal);

        if (range.current) {
            //Kéo từ bên phải thì chỉ thay đổi chiều dài
            range.current.style.width = `${maxPercent - minPercent}%`;
        }
    }, [maxVal, getPercent]);

    // Lấy giá trị min, max khi chúng thay đổi
    useEffect(() => {
        onChange({ min: minVal, max: maxVal });
    }, [minVal, maxVal]);

    return (
        <div className={cx('container')}>
            <input
                type="range"
                min={min}
                max={max}
                value={minVal}
                step={step}
                onChange={(event) => {
                    const value = Math.min(Number(event.target.value), maxVal - 1);
                    setMinVal(value);
                    minValRef.current = value;
                }}
                className={cx('thumb thumb--left')}
                style={{ zIndex: minVal > max - 100 && '5' }}
            />
            <input
                type="range"
                min={min}
                max={max}
                value={maxVal}
                step={step}
                onChange={(event) => {
                    const value = Math.max(Number(event.target.value), minVal + 1);
                    setMaxVal(value);
                    maxValRef.current = value;
                }}
                className={cx('thumb thumb--right')}
            />

            <div className={cx('slider')}>
                <div className={cx('slider__track')} />
                <div ref={range} className={cx('slider__range')} />
            </div>
        </div>
    );
};

export default MultiRangeSlider;
