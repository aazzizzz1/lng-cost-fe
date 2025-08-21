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
    chart: { labels: [], series: [], loading: false, error: null },
    statCards: [
      { id: "total-estimates", label: "Total Estimates", value: 1, icon: "🧮", color: "bg-stat-blue" },
      { id: "infra-types", label: "Infrastructure Types", value: 6, icon: "🏗️", color: "bg-stat-emerald" },
      { id: "total-value", label: "Total Value", value: "$3300.0M", icon: "💰", color: "bg-stat-fuchsia" },
      // { id: "this-month", label: "This Month", value: 1, icon: "🕒", color: "bg-stat-orange" },
    ],
    quickActions: [
      { id: "new-estimate", label: "Create New Estimate", icon: "➕" },
      { id: "view-reports", label: "View Reports", icon: "📄" },
      { id: "cost-analytics", label: "Cost Analytics", icon: "📊" },
    ],
    recentEstimates: [
      { id: 232, name: "LNG Jetty • 20 MTPA", value: "$3300.0M", date: "8/9/2025" },
    ],
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
    // NEW: accent styles now pure tailwind class names
    accentStyles: {
      blue:  { ringClass: "bg-accent-ring-blue",  iconBgClass: "bg-accent-icon-blue",  iconBorder: "border-blue-400/30" },
      cyan:  { ringClass: "bg-accent-ring-cyan",  iconBgClass: "bg-accent-icon-cyan",  iconBorder: "border-cyan-400/30" },
      violet:{ ringClass: "bg-accent-ring-violet",iconBgClass: "bg-accent-icon-violet",iconBorder: "border-violet-400/30" },
      amber: { ringClass: "bg-accent-ring-amber", iconBgClass: "bg-accent-icon-amber", iconBorder: "border-amber-400/30" },
    },
    // Unified chart palette (hex needed by ApexCharts)
    chartColors: [
      "#2563eb","#0891b2","#7c3aed","#f59e0b","#059669","#dc2626",
      "#4f46e5","#c026d3","#0d9488","#e11d48","#0284c7","#65a30d",
      "#475569","#db2777","#ea580c","#9333ea"
    ],
    // Progress bar gradients now single classes
    chartGradients: [
      "bg-gradient-metric-1","bg-gradient-metric-2","bg-gradient-metric-3","bg-gradient-metric-4",
      "bg-gradient-metric-5","bg-gradient-metric-6","bg-gradient-metric-7","bg-gradient-metric-8",
      "bg-gradient-metric-9","bg-gradient-metric-10","bg-gradient-metric-11","bg-gradient-metric-12",
      "bg-gradient-metric-13","bg-gradient-metric-14","bg-gradient-metric-15","bg-gradient-metric-16"
    ],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchChartData.pending, (state) => {
        state.chart.loading = true; state.chart.error = null;
      })
      .addCase(fetchChartData.fulfilled, (state, action) => {
        state.chart.loading = false;
        state.chart.labels = action.payload.labels || [];
        state.chart.series = action.payload.series || [];
      })
      .addCase(fetchChartData.rejected, (state, action) => {
        state.chart.loading = false; state.chart.error = action.payload;
      });
  },
});

export default dashboardSlice.reducer;
