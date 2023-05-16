import { createSlice } from '@reduxjs/toolkit';
import { addWishItem, removeWishItem } from './wishActionThunk';
const wishSlice = createSlice({
    name: 'wish',
    initialState: {
        currentWishAmount: 0,
    },
    reducers: {
        setWishAmount(state, action) {
            return { ...state, currentWishAmount: action.payload };
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(addWishItem.fulfilled, (state, action) => {
                const response = action.payload;
                if (!response || !response?.isSuccess) {
                    return {
                        ...state,
                    };
                }
                return {
                    ...state,
                    currentWishAmount: response.data.currentWishAmount,
                };
            })
            .addCase(removeWishItem.fulfilled, (state, action) => {
                const response = action.payload;
                if (!response || !response?.isSuccess) {
                    return {
                        ...state,
                    };
                }
                return {
                    ...state,
                    currentWishAmount: response.data.currentWishAmount,
                };
            });
    },
});

export { addWishItem, removeWishItem };
export const { setWishAmount } = wishSlice.actions;
export default wishSlice.reducer;
