import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import messageReducer from './features/message/messageSlice';
import cartReducer from './features/cart/cartSlice';
import wishReducer from './features/wish/wishSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        message: messageReducer,
        cart: cartReducer,
        wish: wishReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});
export default store;
