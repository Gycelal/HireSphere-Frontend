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
        setAccessToken: (state, action)=>{
            state.access = action.payload
        },
        setUser: (state, action)=>{
            state.user = action.payload
        },
    }
})


export const { loginSuccess, logout, setAccessToken, setUser } = authSlice.actions;
export default authSlice.reducer