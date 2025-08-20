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
    // NEW: moved constants here
    statCards: [
      { id: "total-estimates", label: "Total Estimates", value: 1, icon: "🧮", color: "from-blue-500/10 to-blue-500/0" },
      { id: "infra-types", label: "Infrastructure Types", value: 6, icon: "🏗️", color: "from-emerald-500/10 to-emerald-500/0" },
      { id: "total-value", label: "Total Value", value: "$3300.0M", icon: "💰", color: "from-fuchsia-500/10 to-fuchsia-500/0" },
      { id: "this-month", label: "This Month", value: 1, icon: "🕒", color: "from-orange-500/10 to-orange-500/0" },
    ],
    quickActions: [
      { id: "new-estimate", label: "Create New Estimate", icon: "➕" },
      { id: "view-reports", label: "View Reports", icon: "📄" },
      { id: "cost-analytics", label: "Cost Analytics", icon: "📊" },
    ],
    recentEstimates: [
      { id: 232, name: "LNG Jetty • 20 MTPA", value: "$3300.0M", date: "8/9/2025" },
    ],
    // NEW: infrastructures replaces costCategories
    infrastructures: [
      {
        id: "onshore-plant",
        label: "Onshore LNG Plant",
        desc: "Land-based facility processing and liquefying natural gas (pretreatment, liquefaction trains, storage & loading).",
        icon: "🏭",
        accent: "blue"
      },
      {
        id: "offshore-plant",
        label: "Offshore LNG Plant (FLNG)",
        desc: "Floating liquefaction unit near offshore gas fields reducing pipeline dependency.",
        icon: "🌊",
        accent: "cyan"
      },
      {
        id: "fsru",
        label: "FSRU",
        desc: "Floating Storage Regasification Unit converting LNG back to gas for power and distribution.",
        icon: "⚓",
        accent: "violet"
      },
      {
        id: "lng-carrier",
        label: "LNG Carrier",
        desc: "Specialized cryogenic ship transporting LNG between export and import terminals.",
        icon: "🚢",
        accent: "amber"
      },
      {
        id: "storage-tank",
        label: "Storage Tank",
        desc: "Full containment cryogenic tank storing LNG at -162°C prior to loading/regasification.",
        icon: "🛢️",
        accent: "blue"
      },
      {
        id: "orf",
        label: "ORF Receiving Terminal",
        desc: "Onshore receiving facility: unloading arms, storage, regasification & send-out systems.",
        icon: "🏗️",
        accent: "cyan"
      },
      {
        id: "trucking",
        label: "LNG Trucking",
        desc: "Cryogenic road tankers distributing LNG to satellite users & remote industries.",
        icon: "🚚",
        accent: "violet"
      },
      {
        id: "pipeline",
        label: "Gas Pipeline",
        desc: "High-pressure transmission delivering regasified natural gas to end users or grids.",
        icon: "🛤️",
        accent: "amber"
      },
    ],
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
