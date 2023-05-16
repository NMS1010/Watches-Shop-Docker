import { createAsyncThunk } from '@reduxjs/toolkit';
import messages from '../../../configs/messages';
import { BACKGROUND_COLOR_FAILED, BACKGROUND_COLOR_SUCCESS } from '../../../constants';
import * as wishsAPI from '../../../services/wishsAPI';
import * as messageAction from '../message/messageSlice';

export const addWishItem = createAsyncThunk('wish/addWishItem', async (data, thunkAPI) => {
    let response = await wishsAPI.addWishItem(data.wishItem);
    if (!response || !response?.isSuccess) {
        thunkAPI.dispatch(
            messageAction.setMessage({
                id: Math.random(),
                title: 'Wish',
                message: response?.errors || 'Cannot connect to server',
                backgroundColor: BACKGROUND_COLOR_FAILED,
                icon: '',
            }),
        );
    } else {
        thunkAPI.dispatch(
            messageAction.setMessage({
                id: Math.random(),
                title: 'Wish',
                message: messages.client.wish.add_success,
                backgroundColor: BACKGROUND_COLOR_SUCCESS,
                icon: '',
            }),
        );
    }
    return response;
});
export const removeWishItem = createAsyncThunk('wish/removeWishItem', async (data, thunkAPI) => {
    let response = await wishsAPI.deleteWishItem(data.wishItemId);
    if (!response || !response?.isSuccess) {
        thunkAPI.dispatch(
            messageAction.setMessage({
                id: Math.random(),
                title: 'Wish',
                message: response?.errors || 'Cannot connect to server',
                backgroundColor: BACKGROUND_COLOR_FAILED,
                icon: '',
            }),
        );
    } else {
        thunkAPI.dispatch(
            messageAction.setMessage({
                id: Math.random(),
                title: 'Wish',
                message: messages.client.wish.remove_success,
                backgroundColor: BACKGROUND_COLOR_SUCCESS,
                icon: '',
            }),
        );
    }
    return response;
});
