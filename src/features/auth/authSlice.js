import { createSlice } from "@reduxjs/toolkit"
import { loginThunk } from "./authThunks";



const initialState = {
    user: null,
    loading: false,
    error: null,
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
        })
        .addCase(loginThunk.fulfilled,(state,action)=>{
            state.loading = false;
            state.user = action.payload.user;

        })
        .addCase(loginThunk.rejected,(state)=>{
            state.loading = false;
        })
    }
})


export const {logout} = authSlice.actions;
export default authSlice.reducer;