import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';

const api = process.env.REACT_APP_API;

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const accessToken = Cookies.get('accessToken');
      const res = await axios.get(`${api}/auth/me`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      // support various response shapes
      const user = res.data?.data?.user || res.data?.data || res.data?.user || res.data;
      Cookies.set('user', JSON.stringify(user), { secure: true, sameSite: 'Strict' });
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
      const response = await axios.post(`${api}/auth/register`, {
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

// Async thunk for user login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.post(`${api}/auth/login`, { email, password });
      const { accessToken, user } = response.data.data || response.data;
      Cookies.set('accessToken', accessToken, { secure: true, sameSite: 'Strict' }); // Simpan accessToken di cookies
      if (user) {
        Cookies.set('user', JSON.stringify(user), { secure: true, sameSite: 'Strict' }); // Simpan user di cookies
      }
      // Ensure fresh user (with role) is fetched post-login
      dispatch(fetchCurrentUser());
      return { accessToken, user: user || null };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Login failed';
      return rejectWithValue(errorMessage); // Gunakan pesan error dari backend
    }
  }
);

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${api}/auth/refresh-token`, {}, { withCredentials: true });
      const { accessToken } = response.data.data;
      Cookies.set('accessToken', accessToken, { secure: true, sameSite: 'Strict' });
      return accessToken;
    } catch (error) {
      Cookies.remove('accessToken');
      Cookies.remove('user');
      return rejectWithValue('Failed to refresh token');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      Cookies.remove('accessToken'); // Hapus accessToken dari cookies
      Cookies.remove('user'); // Hapus user dari cookies
      window.location.href = '/signin'; // Redirect ke signin setelah logout
      return true;
    } catch (error) {
      console.error('Logout failed:', error.message); // Log error untuk debugging
      return rejectWithValue('Logout failed');
    }
  }
);

export const validateAccessToken = createAsyncThunk(
  'auth/validateAccessToken',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const accessToken = Cookies.get('accessToken'); // Retrieve accessToken from cookies
      const response = await axios.get(`${api}/auth/validate-token`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        // If token is expired, attempt to refresh it
        try {
          const newAccessToken = await dispatch(refreshToken()).unwrap();
          Cookies.set('accessToken', newAccessToken, { secure: true, sameSite: 'Strict' });
          return { message: 'Token refreshed successfully' };
        } catch (refreshError) {
          // If refresh fails, log out the user
          Cookies.remove('accessToken');
          Cookies.remove('user');
          window.location.href = '/signin';
          return rejectWithValue('Session expired. Please log in again.');
        }
      }
      return rejectWithValue(error.response?.data?.message || 'Access token validation failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    accessToken: Cookies.get('accessToken') || null,
    user: JSON.parse(Cookies.get('user') || '{}'),
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
    logout: (state) => {
      state.user = null;
      state.accessToken = null; // Reset accessToken on logout
      Cookies.remove('accessToken'); // Remove accessToken from cookies
      Cookies.remove('user'); // Remove user from cookies
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
        window.location.href = '/signin'; // Redirect to signin page
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
        state.accessToken = action.payload.accessToken; // Save accessToken to state
        // keep initial user if returned; fetchCurrentUser will overwrite
        state.user = action.payload.user || state.user; // Save user to state
        state.successMessage = 'Login successful';
        window.location.href = '/dashboard'; // Redirect to dashboard
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload || 'Login failed.';
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.accessToken = action.payload;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.errorMessage = action.payload || 'Failed to fetch user';
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.accessToken = null;
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