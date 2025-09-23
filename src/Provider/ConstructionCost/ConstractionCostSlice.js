import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.REACT_APP_API;

const getAuthHeaders = () => {
  const token = Cookies.get('accessToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Fetch unique infrastructure data
export const fetchUniqueInfrastruktur = createAsyncThunk(
  'constractionCost/fetchUniqueInfrastruktur',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/construction-costs/unique-infrastruktur`, {
        headers: getAuthHeaders(),
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch filtered construction costs
export const fetchFilteredConstructionCosts = createAsyncThunk(
  'constractionCost/fetchFilteredConstructionCosts',
  async ({ tipe, infrastruktur, volume } = {}, { rejectWithValue }) => {
    try {
      const params = {};
      if (tipe) params.tipe = tipe;
      if (infrastruktur) params.infrastruktur = infrastruktur;
      if (volume !== undefined) params.volume = volume;
      const response = await axios.get(`${API_URL}/construction-costs/filter`, {
        params,
        headers: getAuthHeaders(),
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// NEW: Update a single construction cost
export const updateConstructionCost = createAsyncThunk(
  'constractionCost/updateConstructionCost',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${API_URL}/construction-costs/${id}`, data, {
        headers: getAuthHeaders(),
      });
      return res.data?.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// NEW: Delete a single construction cost
export const deleteConstructionCost = createAsyncThunk(
  'constractionCost/deleteConstructionCost',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/construction-costs/${id}`, {
        headers: getAuthHeaders(),
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  costs: [],
  filterJenis: null,
  uniqueInfrastruktur: {},
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
          tipe: action.payload.tipe ?? null,
          proyek: action.payload.proyek ?? null,
          volume: action.payload.volume ?? null,
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
      })
      // NEW: update cost
      .addCase(updateConstructionCost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateConstructionCost.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        const idx = state.costs.findIndex((c) => String(c.id) === String(updated?.id));
        if (idx !== -1 && updated) {
          state.costs[idx] = { ...state.costs[idx], ...updated };
        }
      })
      .addCase(updateConstructionCost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // NEW: delete cost
      .addCase(deleteConstructionCost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteConstructionCost.fulfilled, (state, action) => {
        state.loading = false;
        const removedId = action.payload;
        state.costs = state.costs.filter((c) => String(c.id) !== String(removedId));
      })
      .addCase(deleteConstructionCost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilterJenis } = constractionCostSlice.actions;
export default constractionCostSlice.reducer;