import { createSlice } from '@reduxjs/toolkit';
import { addCartItem, removeCartItem } from './cartActionThunk';
const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        currentCartAmount: 0,
    },
    reducers: {
        setCartAmount(state, action) {
            return { ...state, currentCartAmount: action.payload };
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(addCartItem.fulfilled, (state, action) => {
                const response = action.payload;
                if (!response || !response?.isSuccess) {
                    return {
                        ...state,
                    };
                }
                return {
                    ...state,
                    currentCartAmount: response.data.currentCartAmount,
                };
            })
            .addCase(removeCartItem.fulfilled, (state, action) => {
                const response = action.payload;
                if (!response || !response?.isSuccess) {
                    return {
                        ...state,
                    };
                }
                return {
                    ...state,
                    currentCartAmount: response.data.currentCartAmount,
                };
            });
    },
});

export { addCartItem, removeCartItem };
export const { setCartAmount } = cartSlice.actions;
export default cartSlice.reducer;
