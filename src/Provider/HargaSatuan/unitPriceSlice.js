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
  async ({ tipe = '', search = '' } = {}, { rejectWithValue }) => {
    try {
      const params = { tipe, search };
      const response = await axios.get(`${api}/unit-prices`, { params });
      return response.data; // Ensure the response contains the expected data
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

export const fetchTypes = createAsyncThunk(
  'unitPrice/fetchTypes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${api}/unit-prices/unique-fields`);
      const groupedData = response.data.data;
      const types = Object.keys(groupedData); // Extract the most general group keys
      return types;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async thunk to fetch recommended unit prices
export const fetchRecommendedUnitPrices = createAsyncThunk(
  'unitPrice/fetchRecommendedUnitPrices',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${api}/unit-prices/recommend`, payload);
      return response.data.data; // Return the recommended unit prices
    } catch (error) {
      console.error('Error fetching recommended unit prices:', error.response || error.message);
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
  modalLoading: false, // Add modal-specific loading state
  error: null,
  modalError: null, // Add modal-specific error state
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

export const fetchUnitPriceDataForModal = createAsyncThunk(
  'unitPrice/fetchUnitPriceDataForModal',
  async ({ tipe = '', search = '' } = {}, { rejectWithValue }) => {
    try {
      const params = { tipe, search };
      const response = await axios.get(`${api}/unit-prices`, { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const unitPriceSlice = createSlice({
  name: 'unitPrice',
  initialState: {
    ...initialState,
    transport: transportInitialState,
    types: [],
    recommendedPrices: [], // Add state for recommended unit prices
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
      .addCase(fetchTypes.fulfilled, (state, action) => {
        state.types = action.payload;
      })
      .addCase(fetchTypes.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(fetchTransportData.pending, (state) => {
        state.transport.loading = true;
        state.transport.error = null;
      })
      .addCase(fetchTransportData.fulfilled, (state, action) => {
        state.transport.loading = false;
        state.transport.data = action.payload.data;
      })
      .addCase(fetchTransportData.rejected, (state, action) => {
        state.transport.loading = false;
        state.transport.error = action.payload;
      })
      .addCase(fetchUnitPriceData.fulfilled, (state, action) => {
        state.transport.data = action.payload.data; // Ensure data is stored correctly
      })
      .addCase(fetchUnitPriceData.rejected, (state, action) => {
        state.transport.error = action.payload;
      })
      .addCase(fetchUnitPriceDataForModal.pending, (state) => {
        state.modalLoading = true;
        state.modalError = null;
      })
      .addCase(fetchUnitPriceDataForModal.fulfilled, (state, action) => {
        state.transport.data = action.payload.data; // Store modal-specific data
        state.modalLoading = false;
      })
      .addCase(fetchUnitPriceDataForModal.rejected, (state, action) => {
        state.modalLoading = false;
        state.modalError = action.payload;
      })
      .addCase(fetchRecommendedUnitPrices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecommendedUnitPrices.fulfilled, (state, action) => {
        state.loading = false;
        state.recommendedPrices = action.payload;
      })
      .addCase(fetchRecommendedUnitPrices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilters, setPagination } = unitPriceSlice.actions;

export default unitPriceSlice.reducer;
