import {createAsyncThunk} from '@reduxjs/toolkit';
import { loginUser, googleAuth, completeProfile, adminLogin, adminLogout, userLogout } from '../../api/auth';




export const loginThunk = createAsyncThunk(
  'auth/login',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await loginUser(formData);
      console.log('Login response:', response);
      return response.data;
    } catch (error) {
        console.log('Login error:', error.response?.data);
      return rejectWithValue(error.response?.data || { non_field_errors: ['Login Failed.'] });
    }
  }
);

export const adminLoginThunk = createAsyncThunk(
  'auth/admin-login',
  async(formData,{rejectWithValue}) => {
    try{
      const response = await adminLogin(formData);
      console.log('Logi response:',response);
      return response.data;
    }catch(error){
      console.log('Login error:',error.response?.data);
      return rejectWithValue(error.response?.data || {non_field_errors:['Login Failed.']})
    }
  }
)



export const googleAuthThunk = createAsyncThunk(
  'auth/googleAuth',
  async (tokenResponse, { rejectWithValue }) => {
    try {
      const { access_token } = tokenResponse;
      const response = await googleAuth({ access_token });
      console.log('response:',response)
      return response.data;
    } catch (error) {
      console.error('Google Auth error:', error.response?.data);
      return rejectWithValue(error.response?.data || 'Google Authentication Failed.');
    }
  }
)

export const userLogoutthunk = createAsyncThunk(
  'auth/userLogout',
  async(_,{rejectWithValue}) =>{
    try{
      const response = await userLogout()
      return response.data
    }catch(error){
      return rejectWithValue(error.response?.data || 'Logout failed')
    }
  }
)


export const adminLogoutThunk = createAsyncThunk(
  'auth/adminLogout',
  async(_,{rejectWithValue}) =>{
    try{
      const response = await adminLogout()
      return response.data
    }catch(error){
      return rejectWithValue(error.response?.data || 'Logout failed.');
    }
  }
)


export const completeProfileThunk = createAsyncThunk(
  'auth/completeProfile',
  async (data, { rejectWithValue }) => {
    try {
      console.log('Calling complete profile API...with:',data);
      const response = await completeProfile(data);
      console.log('response:', response);
      return response.data;
    } catch (error) {
      console.log('catch error:', error);
      console.log('URL:', error.config?.url);
      return rejectWithValue(error.response?.data || 'Profile completion failed.');
    }
  }
);