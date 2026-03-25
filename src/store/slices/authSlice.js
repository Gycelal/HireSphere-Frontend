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
        },
        setAccessToken: (state)=>{
            state.access = action.payload
        },
        setUser: (state)=>{
            state.user = action.payload.user
        },
    }
})


export const { loginSuccess, logout, setAccessToken } = authSlice.actions;
export default authSlice.reducer