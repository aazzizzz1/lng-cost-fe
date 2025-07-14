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

const initialState = {
  uniqueFields: {
    tipe: [],
    infrastruktur: [],
    kelompok: [],
  },
  loading: false,
  error: null,
};

const unitPriceSlice = createSlice({
  name: 'unitPrice',
  initialState,
  reducers: {},
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
      });
  },
});

export default unitPriceSlice.reducer;
