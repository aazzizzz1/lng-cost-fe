import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const api = process.env.REACT_APP_API;

// Async thunk to fetch transport data with dynamic filtering, sorting, and pagination
export const fetchTransportData = createAsyncThunk(
  'transport/fetchTransportData',
  async ({ page = 1, limit = 10, sort = '', order = '', search = '', tipe = '', infrastruktur = '', kelompok = '' } = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${api}/unit-prices`, {
        params: { page, limit, sort, order, search, tipe, infrastruktur, kelompok },
      });
      return response.data; // Assuming the response contains pagination metadata and data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  data: [],
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    totalData: 0,
  },
  filters: {
    tipe: '',
    infrastruktur: '',
    kelompok: '',
    search: '',
    sort: '',
    order: '',
  },
  loading: false,
  error: null,
};

const transportSlice = createSlice({
  name: 'transport',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransportData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransportData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        state.pagination.total = action.payload.pagination.totalData;
        state.pagination.totalPages = action.payload.pagination.totalPages;
        state.pagination.page = action.payload.pagination.currentPage;
        state.pagination.limit = action.payload.pagination.limit;
      })
      .addCase(fetchTransportData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilters, setPagination } = transportSlice.actions;

export default transportSlice.reducer;
