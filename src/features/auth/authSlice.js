import { createSlice } from "@reduxjs/toolkit"
import { googleAuthThunk, loginThunk } from "./authThunks";



const initialState = {
    user: null,
    token: null,
}


const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers:{
        logout:(state)=>{
            state.user = null;
            state.token = null;
        },
        tokenRefreshed:(state,action)=>{
            state.token = action.payload
        }
    },
    extraReducers:(builder) =>{
        builder
        // login
        .addCase(loginThunk.fulfilled,(state,action)=>{
            state.user = action.payload.user;
        })
        // google auth
        .addCase(googleAuthThunk.fulfilled,(state,action)=>{
            // state.user = action.payload.user
            state.token = action.payload.access_token
        })
    }
})


export const {logout, tokenRefreshed} = authSlice.actions;
export default authSlice.reducer;