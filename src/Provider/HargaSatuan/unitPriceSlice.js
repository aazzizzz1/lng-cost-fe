import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const api = process.env.REACT_APP_API || 'http://localhost:5000/api';

// Async thunk to fetch unique fields
export const fetchUniqueFields = createAsyncThunk(
  'unitPrice/fetchUniqueFields',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${api}/unit-prices/unique-fields`);
      return response.data.data; // Return grouped data directly
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async thunk to fetch unit price data
export const fetchUnitPriceData = createAsyncThunk(
  'unitPrice/fetchUnitPriceData',
  async ({ page = 1, limit = 10, sort, order, search, tipe = '', infrastruktur = '', kelompok = '' } = {}, { rejectWithValue }) => {
    try {
      const params = { page, limit, tipe, infrastruktur, kelompok };
      if (sort) params.sort = sort;
      if (order) params.order = order;
      if (search) params.search = search;

      const response = await axios.get(`${api}/unit-prices`, { params });
      return response.data; // Assuming the response contains pagination metadata and data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async thunk to fetch transport data
export const fetchTransportData = createAsyncThunk(
  'unitPrice/fetchTransportData',
  async ({ page = 1, limit = 10, sort, order, search, tipe = '', infrastruktur = '', kelompok = '' } = {}, { rejectWithValue }) => {
    try {
      const params = { page, limit, tipe, infrastruktur, kelompok };
      if (sort) params.sort = sort;
      if (order) params.order = order;
      if (search) params.search = search;

      const response = await axios.get(`${api}/unit-prices`, { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  uniqueFields: {
    tipe: [],
    infrastruktur: [],
    kelompok: [],
  },
  loading: false,
  error: null,
};

const transportInitialState = {
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

const unitPriceSlice = createSlice({
  name: 'unitPrice',
  initialState: {
    ...initialState,
    transport: transportInitialState,
  },
  reducers: {
    setFilters: (state, action) => {
      state.transport.filters = { ...state.transport.filters, ...action.payload };
    },
    setPagination: (state, action) => {
      state.transport.pagination = { ...state.transport.pagination, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUniqueFields.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUniqueFields.fulfilled, (state, action) => {
        state.loading = false;
        state.uniqueFields = action.payload;
      })
      .addCase(fetchUniqueFields.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchTransportData.pending, (state) => {
        state.transport.loading = true;
        state.transport.error = null;
      })
      .addCase(fetchTransportData.fulfilled, (state, action) => {
        state.transport.loading = false;
        state.transport.data = action.payload.data;
        state.transport.pagination.total = action.payload.pagination.totalData;
        state.transport.pagination.totalPages = action.payload.pagination.totalPages;
        state.transport.pagination.page = action.payload.pagination.currentPage;
        state.transport.pagination.limit = action.payload.pagination.limit;
      })
      .addCase(fetchTransportData.rejected, (state, action) => {
        state.transport.loading = false;
        state.transport.error = action.payload;
      });
  },
});

export const { setFilters, setPagination } = unitPriceSlice.actions;

export default unitPriceSlice.reducer;
