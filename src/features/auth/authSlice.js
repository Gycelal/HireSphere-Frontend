import { createSlice } from "@reduxjs/toolkit"
import { loginThunk } from "./authThunks";



const initialState = {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    token: null,
}

const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers:{
        logout:(state)=>{
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
        }
    },
    extraReducers:(builder) =>{
        builder
        // login
        .addCase(loginThunk.pending,(state)=>{
            state.loading = true;
            state.error = null
        })
        .addCase(loginThunk.fulfilled,(state)=>{
            state.loading = false;
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
        })
        .addCase(loginThunk.rejected,(state)=>{
            state.loading = false;
            state.error = action.payload || 'Login Failed.'
        })
        // register
        // .addCase(registerThunk.pending,(state)=>{
        //     state.loading = true;
        //     state.error = null;
        // })
        // .addCase(registerThunk.fulfilled,(state)=>{
        //     state.loading = false;
        //     state.user = action.payload.user;
        //     state.token = action.payload.token;
        //     state.isAuthenticated = true;
        // })
        // .addCase(registerThunk.rejected,(state)=>{
        //     state.loading = false;
        //     state.error = action.payload || 'Registration Failed';
        // })
    }
})


export const {logout} = authSlice.actions;
export default authSlice.reducer;