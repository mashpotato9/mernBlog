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
        deleteStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        deleteSuccess: (state) => {
            state.loading = false;
            state.error = null;
            state.currUser = null;
        },
        deleteFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        logoutSuccess: (state) => {
            state.currUser = null;
            state.error = null;
            state.loading = false;
        }
    }
});

export const { 
    loginStart, 
    loginSuccess, 
    loginFailure, 
    updateStart, 
    updateSuccess, 
    updateFailure,
    deleteStart,
    deleteSuccess,
    deleteFailure,
    logoutSuccess
} = userSlice.actions;

export default userSlice.reducer;