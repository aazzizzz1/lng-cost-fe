import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const api = process.env.REACT_APP_API;

// Async thunk untuk fetch chart data
export const fetchChartData = createAsyncThunk(
  'dashboard/fetchChartData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${api}/unit-prices/chart-data`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    chart: {
      labels: [],
      series: [],
      loading: false,
      error: null,
    },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchChartData.pending, (state) => {
        state.chart.loading = true;
        state.chart.error = null;
      })
      .addCase(fetchChartData.fulfilled, (state, action) => {
        state.chart.loading = false;
        state.chart.labels = action.payload.labels || [];
        state.chart.series = action.payload.series || [];
      })
      .addCase(fetchChartData.rejected, (state, action) => {
        state.chart.loading = false;
        state.chart.error = action.payload;
      });
  },
});

export default dashboardSlice.reducer;
