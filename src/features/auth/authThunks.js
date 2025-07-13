import {createAsyncThunk} from '@reduxjs/toolkit';
import { registerUser,loginUser } from '../../api/auth';


// export const registerThunk = createAsyncThunk(
//     'auth/register',
//     async (formData,{rejectWithValue})=>{
//         try{
//             const response = await registerUser(formData)
//             return response.data
//         } catch(error){
//             console.log('REGISTER ERROR:', error.response.data);
//             return rejectWithValue(error.response?.data?.message || 'Registration Failed.')
//         }
//     }
// )




export const loginThunk = createAsyncThunk(
    'auth/login',
    async(formData,{rejectWithValue}) =>{
        try{
            const response = await loginUser(formData)
            return response.data
        }catch(error){
            return rejectWithValue(error.response?.data?.message || 'Login Failed.')
        }
    }
)