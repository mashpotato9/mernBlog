import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    currUser: null,
    error: null,
    loading: false
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        loginStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        loginSuccess: (state, action) => {
            state.loading = false;
            state.error = null;
            state.currUser = action.payload;
        },
        loginFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        updateStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        updateSuccess: (state, action) => {
            state.loading = false;
            state.error = null;
            state.currUser = action.payload;
        },
        updateFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
    }
});

export const { loginStart, loginSuccess, loginFailure, updateStart, updateSuccess, updateFailure } = userSlice.actions;

export default userSlice.reducer;