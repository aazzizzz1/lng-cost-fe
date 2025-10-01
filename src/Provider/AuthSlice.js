import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Create axios instance bound to env baseURL with credentials
const http = axios.create({
  baseURL: process.env.REACT_APP_API,
  withCredentials: true,
});

// Fetch current user (reads accessToken from HttpOnly cookie on server)
export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const res = await http.get(`/auth/me`);
      const user = res.data?.data?.user || res.data?.data || res.data?.user || res.data;
      return user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user');
    }
  }
);

// Async thunk for user registration
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ username, email, password }, { rejectWithValue }) => {
    try {
      const response = await http.post(`/auth/register`, {
        username,
        email,
        password,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Registration failed' });
    }
  }
);

// Login: backend sets HttpOnly cookies; no token stored in frontend
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue, dispatch }) => {
    try {
      const response = await http.post(`/auth/login`, { email, password });
      const user = response.data?.data?.user || response.data?.user || null;
      // Ensure latest user/role
      dispatch(fetchCurrentUser());
      return { user };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Login failed';
      return rejectWithValue(errorMessage);
    }
  }
);

// Refresh via cookie; no token persisted on frontend
export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const response = await http.post(`/auth/refresh-token`, {});
      return response.data?.data || response.data;
    } catch (error) {
      return rejectWithValue('Failed to refresh token');
    }
  }
);

// Logout: clear cookies on server
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await http.post(`/auth/logout`, {});
      window.location.href = '/signin';
      return true;
    } catch (error) {
      return rejectWithValue('Logout failed');
    }
  }
);

// Validate session: try /auth/me, then refresh, else reject
export const validateAccessToken = createAsyncThunk(
  'auth/validateAccessToken',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      await dispatch(fetchCurrentUser()).unwrap();
      return { message: 'OK' };
    } catch {
      try {
        await dispatch(refreshToken()).unwrap();
        await dispatch(fetchCurrentUser()).unwrap();
        return { message: 'Token refreshed successfully' };
      } catch {
        // Let route guard handle navigation
        return rejectWithValue('Session expired. Please log in again.');
      }
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    // accessToken removed: we rely on HttpOnly cookies
    user: null,
    loading: false,
    errorMessage: '',
    successMessage: '',
    inputSignUp: {
      email: '',
      username: '',
      password: '',
      confirm_password: '',
    },
    inputLogin: {
      email: '',
      password: '',
    },
    formSubmitted: false,
    passwordVisible: false,
    confirmPasswordVisible: false,
    termsAccepted: false,
    openModal: false,
  },
  reducers: {
    setInputSignUp: (state, action) => {
      state.inputSignUp = { ...state.inputSignUp, ...action.payload };
    },
    setInputLogin: (state, action) => {
      state.inputLogin = { ...state.inputLogin, ...action.payload };
    },
    setFormSubmitted: (state, action) => {
      state.formSubmitted = action.payload;
    },
    togglePasswordVisibility: (state) => {
      state.passwordVisible = !state.passwordVisible;
    },
    toggleConfirmPasswordVisibility: (state) => {
      state.confirmPasswordVisible = !state.confirmPasswordVisible;
    },
    setTermsAccepted: (state, action) => {
      state.termsAccepted = action.payload;
    },
    setOpenModal: (state, action) => {
      state.openModal = action.payload;
    },
    clearMessages: (state) => {
      state.successMessage = '';
      state.errorMessage = '';
    },
    handleAccept: (state) => {
      state.termsAccepted = !state.termsAccepted;
    },
    handleAcceptClick: (state) => {
      state.termsAccepted = true;
      state.openModal = false;
    },
    handleDeclineClick: (state) => {
      state.termsAccepted = false;
      state.openModal = false;
    },
    // Synchronous logout (no cookie ops here)
    logout: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.errorMessage = '';
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = 'Registration successful';
        window.location.href = '/signin';
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload?.message || 'Registration failed';
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.errorMessage = '';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        // Keep any user returned; fetchCurrentUser will overwrite with freshest user
        state.user = action.payload?.user || state.user;
        state.successMessage = 'Login successful';
        window.location.href = '/dashboard';
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload || 'Login failed.';
      })
      // No need to set tokens on refresh; cookies are handled server-side
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.errorMessage = action.payload || 'Failed to fetch user';
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export const {
  setInputSignUp,
  setInputLogin,
  setFormSubmitted,
  togglePasswordVisibility,
  toggleConfirmPasswordVisibility,
  setTermsAccepted,
  setOpenModal,
  clearMessages,
  handleAccept,
  handleAcceptClick,
  handleDeclineClick,
  logout,
} = authSlice.actions;

export default authSlice.reducer;