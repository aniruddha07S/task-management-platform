import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';
import { getToken, getUser, saveAuth, clearAuth } from '../utils/authStorage';

const initialState = {
  user: getUser(),
  token: getToken(),
  status: 'idle', // idle | loading | succeeded | failed
  error: null,
};

export const registerUser = createAsyncThunk(
  'auth/register',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.post('/api/auth/register', formData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Registration failed');
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.post('/api/auth/login', formData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Login failed');
    }
  }
);

const setPending = (state) => {
  state.status = 'loading';
  state.error = null;
};

const setRejected = (state, action) => {
  state.status = 'failed';
  state.error = action.payload;
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.status = 'idle';
      clearAuth();
    },
    clearAuthError: (state) => {
      state.error = null;
      state.status = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, setPending)
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
        saveAuth(action.payload, true);
      })
      .addCase(registerUser.rejected, setRejected)
      .addCase(loginUser.pending, setPending)
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
        saveAuth(action.payload, Boolean(action.meta.arg?.rememberMe));
      })
      .addCase(loginUser.rejected, setRejected);
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
