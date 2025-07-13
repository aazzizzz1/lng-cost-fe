import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';

const api = process.env.REACT_APP_API;

// Async thunk for user registration
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ name, username, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${api}/users/register`, {
        name,
        username,
        password,
        role: "user", // Set default role to "user"
        position: ""
      });
      const token = response.data.token;
      Cookies.set('token', token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for user login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${api}/auth/login`, { email, password });
      const { accessToken, user } = response.data.data;
      Cookies.set('accessToken', accessToken, { secure: true, sameSite: 'Strict' }); // Simpan accessToken di cookies
      Cookies.set('user', JSON.stringify(user), { secure: true, sameSite: 'Strict' }); // Simpan user di cookies
      return { accessToken, user };
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
      Cookies.set('accessToken', accessToken, { secure: true, sameSite: 'Strict' }); // Perbarui accessToken di cookies
      return accessToken;
    } catch (error) {
      Cookies.remove('accessToken'); // Hapus accessToken dari cookies
      Cookies.remove('user'); // Hapus user dari cookies
      window.location.href = '/signin'; // Redirect ke signin jika refreshToken gagal
      return rejectWithValue(error.response?.data?.message || 'Failed to refresh token');
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
  async (_, { rejectWithValue }) => {
    try {
      const accessToken = Cookies.get('accessToken'); // Ambil accessToken dari cookies
      const response = await axios.get(`${api}/auth/validate-token`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return response.data;
    } catch (error) {
      Cookies.remove('accessToken'); // Hapus accessToken dari cookies
      Cookies.remove('user'); // Hapus user dari cookies
      window.location.href = '/signin'; // Redirect ke signin jika accessToken tidak valid
      return rejectWithValue(error.response?.data?.message || 'Access token invalid');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    accessToken: Cookies.get('accessToken') || null, // Ambil accessToken dari cookies
    user: JSON.parse(Cookies.get('user') || '{}'), // Ambil user dari cookies
    loading: false,
    errorMessage: '',
    successMessage: '',
    inputSignUp: {
      full_name: '',
      username: '',
      password: '',
      confirm_password: ''
    },
    inputLogin: {
      email: '',
      password: ''
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
      state.accessToken = null; // Reset accessToken saat logout
      Cookies.remove('accessToken'); // Hapus accessToken dari cookies
      Cookies.remove('user'); // Hapus user dari cookies
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.successMessage = 'Registration successful';
        window.location.href = '/signin'; // Redirect ke signin page
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload.message || 'Registration failed';
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload.accessToken; // Simpan accessToken ke state
        state.user = action.payload.user; // Simpan user ke state
        state.successMessage = 'Login successful';
        window.location.href = '/dashboard'; // Redirect ke dashboard
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload || 'Login failed.';
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.accessToken = action.payload;
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
  logout
} = authSlice.actions;

export default authSlice.reducer;