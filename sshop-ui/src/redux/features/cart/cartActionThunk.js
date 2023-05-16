import { createAsyncThunk } from '@reduxjs/toolkit';
import messages from '../../../configs/messages';
import { BACKGROUND_COLOR_FAILED, BACKGROUND_COLOR_SUCCESS } from '../../../constants';
import * as cartsAPI from '../../../services/cartsAPI';
import * as messageAction from '../message/messageSlice';

export const addCartItem = createAsyncThunk('cart/addCartItem', async (data, thunkAPI) => {
    let response = await cartsAPI.addCartItem(data.cartItem);
    if (!response || !response?.isSuccess) {
        thunkAPI.dispatch(
            messageAction.setMessage({
                id: Math.random(),
                title: 'Cart',
                message: response?.errors || 'Cannot connect to server',
                backgroundColor: BACKGROUND_COLOR_FAILED,
                icon: '',
            }),
        );
    } else {
        !response.data.isUpdateQuantity &&
            thunkAPI.dispatch(
                messageAction.setMessage({
                    id: Math.random(),
                    title: 'Cart',
                    message: messages.client.cart.add_success,
                    backgroundColor: BACKGROUND_COLOR_SUCCESS,
                    icon: '',
                }),
            );
    }
    return response;
});
export const removeCartItem = createAsyncThunk('cart/removeCartItem', async (data, thunkAPI) => {
    let response = await cartsAPI.deleteCartItem(data.cartItemId);
    if (!response || !response?.isSuccess) {
        thunkAPI.dispatch(
            messageAction.setMessage({
                id: Math.random(),
                title: 'Cart',
                message: response?.errors || 'Cannot connect to server',
                backgroundColor: BACKGROUND_COLOR_FAILED,
                icon: '',
            }),
        );
    } else {
        thunkAPI.dispatch(
            messageAction.setMessage({
                id: Math.random(),
                title: 'Cart',
                message: messages.client.cart.remove_success,
                backgroundColor: BACKGROUND_COLOR_SUCCESS,
                icon: '',
            }),
        );
    }
    return response;
});
