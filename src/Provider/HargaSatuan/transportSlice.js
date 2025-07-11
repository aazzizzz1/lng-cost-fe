import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const api = process.env.REACT_APP_API;

// Async thunk to fetch transport data
export const fetchTransportData = createAsyncThunk(
  'transport/fetchTransportData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${api}/unit-prices`);
      console.log('Fetched Transport Data:', response.data);
      return response.data.data; // Assuming the data is in the `data` field
    } catch (error) {
      console.error('Error fetching transport data:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  data: [],
  filterTipe: "LNGC", // Tab aktif: LNGC, LNG Barge, LNG Trucking
  filterKategori: [], // Array: Material Konstruksi, Peralatan, Upah, Jasa, Testing
  search: "",
  loading: false,
  error: null,
};

const transportSlice = createSlice({
  name: "transport",
  initialState,
  reducers: {
    setFilterTipe: (state, action) => {
      state.filterTipe = action.payload;
    },
    setFilterKategori: (state, action) => {
      state.filterKategori = action.payload;
    },
    setSearch: (state, action) => {
      state.search = action.payload;
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
        state.data = action.payload;
      })
      .addCase(fetchTransportData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilterTipe, setFilterKategori, setSearch } = transportSlice.actions;

export default transportSlice.reducer;
