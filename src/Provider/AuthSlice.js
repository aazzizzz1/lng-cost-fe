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
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${api}/users/login`, {
        username,
        password
      });
      const token = response.data.token;
      console.log('Login Response:', response.data);
      Cookies.set('token', token);
      return response.data;
    } catch (error) {
      console.log('Login Error:', error.response.data);
      return rejectWithValue(error.response.data);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: null,
    loading: false,
    error: null,
    successMessage: '',
    errorMessage: '',
    inputSignUp: {
      full_name: '',
      username: '',
      password: '',
      confirm_password: ''
    },
    inputLogin: {
      username: '',
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
        window.location.href = '/signin'; // Redirect to signin page
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
        state.token = action.payload.token;
        state.successMessage = 'Login successful';
        window.location.href = '/dashboard'; // Redirect to dashboard page
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload.message || 'Login failed';
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
  handleDeclineClick
} = authSlice.actions;

export default authSlice.reducer;
