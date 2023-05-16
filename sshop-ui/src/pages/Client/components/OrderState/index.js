import { useEffect, useState } from 'react';
import './style.scss';
const PENDING = 6;
const ON_THE_WAY = 3.5;
const DELIVERED = 1;
const CANCELLED = 0.9;
const OrderState = ({ order }) => {
    const [currentPercent, setCurrentPercent] = useState(0);
    useEffect(() => {
        switch (order.orderStateName) {
            case 'Pending':
                setCurrentPercent(PENDING);
                break;
            case 'On the way':
                setCurrentPercent(ON_THE_WAY);
                break;
            case 'Ready to ship':
                setCurrentPercent(ON_THE_WAY);
                break;
            case 'Delivered':
                setCurrentPercent(DELIVERED);
                break;
            case 'Cancelled':
                setCurrentPercent(CANCELLED);
                break;
        }
    }, [order.orderStateName]);
    return (
        <div className="px-6 py-10 bg-white max-w-screen-xl mx-auto my-5">
            <div className="stepper">
                <div className="stepper__step">
                    <div className="stepper__step-icon stepper__step-icon--finish">
                        <svg
                            enableBackground="new 0 0 32 32"
                            viewBox="0 0 32 32"
                            x="0"
                            y="0"
                            className="shopee-svg-icon icon-order-order"
                        >
                            <g>
                                <path
                                    d="m5 3.4v23.7c0 .4.3.7.7.7.2 0 .3 0 .3-.2.5-.4 1-.5 1.7-.5.9 0 1.7.4 2.2 1.1.2.2.3.4.5.4s.3-.2.5-.4c.5-.7 1.4-1.1 2.2-1.1s1.7.4 2.2 1.1c.2.2.3.4.5.4s.3-.2.5-.4c.5-.7 1.4-1.1 2.2-1.1.9 0 1.7.4 2.2 1.1.2.2.3.4.5.4s.3-.2.5-.4c.5-.7 1.4-1.1 2.2-1.1.7 0 1.2.2 1.7.5.2.2.3.2.3.2.3 0 .7-.4.7-.7v-23.7z"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeMiterlimit="10"
                                    strokeWidth="3"
                                ></path>
                                <g>
                                    <line
                                        fill="none"
                                        strokeLinecap="round"
                                        strokeMiterlimit="10"
                                        strokeWidth="3"
                                        x1="10"
                                        x2="22"
                                        y1="11.5"
                                        y2="11.5"
                                    ></line>
                                    <line
                                        fill="none"
                                        strokeLinecap="round"
                                        strokeMiterlimit="10"
                                        strokeWidth="3"
                                        x1="10"
                                        x2="22"
                                        y1="18.5"
                                        y2="18.5"
                                    ></line>
                                </g>
                            </g>
                        </svg>
                    </div>
                    <div className="stepper__step-text">Ordered</div>
                    <div className="stepper__step-date">{new Date(order.dateCreated).toLocaleString()}</div>
                </div>
                {currentPercent !== CANCELLED ? (
                    <>
                        <div className="stepper__step">
                            <div
                                className={`stepper__step-icon ${
                                    currentPercent === PENDING
                                        ? 'stepper__step-icon--pending'
                                        : currentPercent < PENDING && 'stepper__step-icon--finish'
                                }`}
                            >
                                <svg
                                    enableBackground="new 0 0 32 32"
                                    viewBox="0 0 32 32"
                                    x="0"
                                    y="0"
                                    className="shopee-svg-icon icon-order-paid"
                                >
                                    <g>
                                        <path
                                            clipRule="evenodd"
                                            d="m24 22h-21c-.5 0-1-.5-1-1v-15c0-.6.5-1 1-1h21c .5 0 1 .4 1 1v15c0 .5-.5 1-1 1z"
                                            fill="none"
                                            fillRule="evenodd"
                                            strokeMiterlimit="10"
                                            strokeWidth="3"
                                        ></path>
                                        <path
                                            clipRule="evenodd"
                                            d="m24.8 10h4.2c.5 0 1 .4 1 1v15c0 .5-.5 1-1 1h-21c-.6 0-1-.4-1-1v-4"
                                            fill="none"
                                            fillRule="evenodd"
                                            strokeMiterlimit="10"
                                            strokeWidth="3"
                                        ></path>
                                        <path
                                            d="m12.9 17.2c-.7-.1-1.5-.4-2.1-.9l.8-1.2c.6.5 1.1.7 1.7.7.7 0 1-.3 1-.8 0-1.2-3.2-1.2-3.2-3.4 0-1.2.7-2 1.8-2.2v-1.3h1.2v1.2c.8.1 1.3.5 1.8 1l-.9 1c-.4-.4-.8-.6-1.3-.6-.6 0-.9.2-.9.8 0 1.1 3.2 1 3.2 3.3 0 1.2-.6 2-1.9 2.3v1.2h-1.2z"
                                            stroke="none"
                                        ></path>
                                    </g>
                                </svg>
                            </div>
                            <div className="stepper__step-text">Pending</div>
                        </div>
                        <div className="stepper__step">
                            <div
                                className={`stepper__step-icon ${
                                    currentPercent === ON_THE_WAY
                                        ? 'stepper__step-icon--pending'
                                        : currentPercent < ON_THE_WAY && 'stepper__step-icon--finish'
                                }`}
                            >
                                <svg
                                    enableBackground="new 0 0 32 32"
                                    viewBox="0 0 32 32"
                                    x="0"
                                    y="0"
                                    className="shopee-svg-icon icon-order-shipping"
                                >
                                    <g>
                                        <line
                                            fill="none"
                                            strokeLinejoin="round"
                                            strokeMiterlimit="10"
                                            strokeWidth="3"
                                            x1="18.1"
                                            x2="9.6"
                                            y1="20.5"
                                            y2="20.5"
                                        ></line>
                                        <circle
                                            cx="7.5"
                                            cy="23.5"
                                            fill="none"
                                            r="4"
                                            strokeMiterlimit="10"
                                            strokeWidth="3"
                                        ></circle>
                                        <circle
                                            cx="20.5"
                                            cy="23.5"
                                            fill="none"
                                            r="4"
                                            strokeMiterlimit="10"
                                            strokeWidth="3"
                                        ></circle>
                                        <line
                                            fill="none"
                                            strokeMiterlimit="10"
                                            strokeWidth="3"
                                            x1="19.7"
                                            x2="30"
                                            y1="15.5"
                                            y2="15.5"
                                        ></line>
                                        <polyline
                                            fill="none"
                                            points="4.6 20.5 1.5 20.5 1.5 4.5 20.5 4.5 20.5 18.4"
                                            strokeLinejoin="round"
                                            strokeMiterlimit="10"
                                            strokeWidth="3"
                                        ></polyline>
                                        <polyline
                                            fill="none"
                                            points="20.5 9 29.5 9 30.5 22 24.7 22"
                                            strokeLinejoin="round"
                                            strokeMiterlimit="10"
                                            strokeWidth="3"
                                        ></polyline>
                                    </g>
                                </svg>
                            </div>
                            <div className="stepper__step-text">On the way</div>
                        </div>
                        <div className="stepper__step">
                            <div
                                className={`stepper__step-icon ${
                                    currentPercent === DELIVERED
                                        ? 'stepper__step-icon--pending'
                                        : currentPercent < DELIVERED && 'stepper__step-icon--finish'
                                }`}
                            >
                                <svg
                                    enableBackground="new 0 0 32 32"
                                    viewBox="0 0 32 32"
                                    x="0"
                                    y="0"
                                    className="shopee-svg-icon icon-order-received"
                                >
                                    <g>
                                        <polygon
                                            fill="none"
                                            points="2 28 2 19.2 10.6 19.2 11.7 21.5 19.8 21.5 20.9 19.2 30 19.1 30 28"
                                            strokeLinejoin="round"
                                            strokeMiterlimit="10"
                                            strokeWidth="3"
                                        ></polygon>
                                        <polyline
                                            fill="none"
                                            points="21 8 27 8 30 19.1"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeMiterlimit="10"
                                            strokeWidth="3"
                                        ></polyline>
                                        <polyline
                                            fill="none"
                                            points="2 19.2 5 8 11 8"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeMiterlimit="10"
                                            strokeWidth="3"
                                        ></polyline>
                                        <line
                                            fill="none"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeMiterlimit="10"
                                            strokeWidth="3"
                                            x1="16"
                                            x2="16"
                                            y1="4"
                                            y2="14"
                                        ></line>
                                        <path
                                            d="m20.1 13.4-3.6 3.6c-.3.3-.7.3-.9 0l-3.6-3.6c-.4-.4-.1-1.1.5-1.1h7.2c.5 0 .8.7.4 1.1z"
                                            stroke="none"
                                        ></path>
                                    </g>
                                </svg>
                            </div>
                            <div className="stepper__step-text">Delivered</div>
                            <div className="stepper__step-date">
                                {order.dateDone && new Date(order.dateDone).toLocaleString()}
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="stepper__step stepper__step--finish">
                        <div
                            className={`stepper__step-icon ${
                                currentPercent === CANCELLED
                                    ? 'stepper__step-icon--pending'
                                    : currentPercent < CANCELLED && 'stepper__step-icon--finish'
                            }`}
                        >
                            <svg
                                enable-background="new 0 0 32 32"
                                viewBox="0 0 32 32"
                                x="0"
                                y="0"
                                className="shopee-svg-icon icon-order-problem"
                            >
                                <g>
                                    <g>
                                        <path
                                            d="m5 3.4v23.7c0 .4.3.7.7.7.2 0 .3 0 .3-.2.5-.4 1-.5 1.7-.5.9 0 1.7.4 2.2 1.1.2.2.3.4.5.4s.3-.2.5-.4c.5-.7 1.4-1.1 2.2-1.1s1.7.4 2.2 1.1c.2.2.3.4.5.4s.3-.2.5-.4c.5-.7 1.4-1.1 2.2-1.1.9 0 1.7.4 2.2 1.1.2.2.3.4.5.4s.3-.2.5-.4c.5-.7 1.4-1.1 2.2-1.1.7 0 1.2.2 1.7.5.2.2.3.2.3.2.3 0 .7-.4.7-.7v-23.7z"
                                            fill="none"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeMiterlimit="10"
                                            strokeWidth="3"
                                        ></path>
                                    </g>
                                    <line
                                        fill="none"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeMiterlimit="10"
                                        strokeWidth="3"
                                        x1="16"
                                        x2="16"
                                        y1="9"
                                        y2="15"
                                    ></line>
                                    <circle cx="16" cy="20.5" r="2" stroke="none"></circle>
                                </g>
                            </svg>
                        </div>
                        <div className="stepper__step-text">Cancelled</div>
                    </div>
                )}
                <div className="stepper__line">
                    <div className="stepper__line-background" style={{ background: 'rgb(224, 224, 224)' }}></div>
                    <div
                        className="stepper__line-foreground"
                        style={{
                            width: `calc((100% - calc(140px * ${currentPercent})) * 1)`,
                            background: 'rgb(45, 194, 88)',
                        }}
                    ></div>
                </div>
            </div>
        </div>
    );
};
export default OrderState;
