import { createSlice } from "@reduxjs/toolkit";


const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        access: null,
        isAuthenticated: false
    },
    reducers:{
        loginSuccess:(state, action)=>{
            state.user = action.payload.user
            state.access = action.payload.access
            state.isAuthenticated = true
        },
        logout: (state)=>{
            state.user = null
            state.access = null
            state.isAuthenticated = false
        } 
    }
})


export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer