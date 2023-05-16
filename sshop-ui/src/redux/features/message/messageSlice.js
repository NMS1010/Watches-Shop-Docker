import { createSlice } from '@reduxjs/toolkit';

const messageSlice = createSlice({
    name: 'message',
    initialState: [],
    reducers: {
        setMessage(state, action) {
            return [...state, action.payload];
        },
        clearMessage(state, action) {
            return state.filter((message) => message.id !== action.payload);
        },
    },
});

export const { setMessage, clearMessage } = messageSlice.actions;

export default messageSlice.reducer;
