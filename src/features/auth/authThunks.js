import {createAsyncThunk} from '@reduxjs/toolkit';
import { loginUser, googleAuth, completeProfile } from '../../api/auth';




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