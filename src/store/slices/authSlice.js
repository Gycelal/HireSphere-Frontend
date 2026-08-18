import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { privateApi } from "../../services/api";


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
    },
    extraReducers: (builder) =>{
        builder
        .addCase(fetchCurrentUser.fulfilled, (state, action) => {
            const userData = action.payload?.user || action.payload;
            state.user = {
                ...state.user,
                ...userData
            };
        })
        .addCase(fetchCurrentUser.rejected, (state, action) => {
            console.log("Failed to fetch current user:", action.payload);
        })
    }
})

export const fetchCurrentUser = createAsyncThunk(
    "auth/fetchcurrentUser",
    async(_, {rejectWithValue}) =>{
        try{
            const response = await privateApi.get("accounts/me/");
            return response.data;
        }catch(error){
            return rejectWithValue(
                error.response?.data || "Failed to fetch user"
            )
        }
    }
);


export const { loginSuccess, logout, setAccessToken, setUser } = authSlice.actions;
export default authSlice.reducer