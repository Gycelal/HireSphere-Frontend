import {createAsyncThunk} from '@reduxjs/toolkit';
import { registerUser,loginUser } from '../../api/auth';


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
