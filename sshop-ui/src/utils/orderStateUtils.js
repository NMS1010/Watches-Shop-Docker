export const ORDER_STATE = {
    PENDING: 'Pending',
    ON_THE_WAY: 'On the way',
    READY_TO_SHIP: 'Ready to ship',
    DELIVERED: 'Delivered',
    CANCELLED: 'Cancelled',
};

export const orderState = (name) => {
    let bg = '';
    switch (name) {
        case ORDER_STATE.PENDING:
            bg = 'primary';
            break;
        case ORDER_STATE.ON_THE_WAY:
            bg = 'info';
            break;
        case ORDER_STATE.DELIVERED:
            bg = 'success';
            break;
        case ORDER_STATE.CANCELLED:
            bg = 'danger';
            break;
        case ORDER_STATE.READY_TO_SHIP:
            bg = 'secondary';
            break;
        default:
            bg = '';
            break;
    }
    return bg;
};
