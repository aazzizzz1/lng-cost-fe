import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API;

// Fetch unique infrastructure data
export const fetchUniqueInfrastruktur = createAsyncThunk(
  'constractionCost/fetchUniqueInfrastruktur',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/construction-costs/unique-infrastruktur`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch filtered construction costs
export const fetchFilteredConstructionCosts = createAsyncThunk(
  'constractionCost/fetchFilteredConstructionCosts',
  async ({ tipe, infrastruktur }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/construction-costs/filter`, {
        params: { tipe, infrastruktur },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  costs: [], // Dynamically fetched costs
  filterJenis: null, // Filter criteria
  uniqueInfrastruktur: {}, // Unique infrastructure data
  loading: false,
  error: null,
};

const constractionCostSlice = createSlice({
  name: 'constractionCost',
  initialState,
  reducers: {
    setFilterJenis: (state, action) => {
      // Set filter criteria
      if (typeof action.payload === 'object' && action.payload !== null) {
        state.filterJenis = {
          tipe: action.payload.tipe,
          proyek: action.payload.proyek,
        };
      } else {
        state.filterJenis = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle unique infrastructure fetching
      .addCase(fetchUniqueInfrastruktur.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUniqueInfrastruktur.fulfilled, (state, action) => {
        state.loading = false;
        state.uniqueInfrastruktur = action.payload;
      })
      .addCase(fetchUniqueInfrastruktur.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle filtered construction costs fetching
      .addCase(fetchFilteredConstructionCosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFilteredConstructionCosts.fulfilled, (state, action) => {
        state.loading = false;
        state.costs = action.payload;
      })
      .addCase(fetchFilteredConstructionCosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilterJenis } = constractionCostSlice.actions;
export default constractionCostSlice.reducer;