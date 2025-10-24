import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';

const api = process.env.REACT_APP_API;
const getAuthHeaders = () => {
  const token = Cookies.get('accessToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Chart data (unit prices)
export const fetchChartData = createAsyncThunk(
  'dashboard/fetchChartData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${api}/unit-prices/chart-data`, { headers: getAuthHeaders() });
      return response.data || { labels: [], series: [] };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Recent manual projects (CAPEX)
export const fetchDashboardManualRecent = createAsyncThunk(
  'dashboard/fetchDashboardManualRecent',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${api}/projects/manual`, {
        params: { page: 1, limit: 5, sort: 'createdAt', order: 'desc' },
        headers: getAuthHeaders(),
      });
      const payload = res.data || {};
      const items = (payload.data || []).map((p) => ({
        id: p.id,
        name: p.name || '-',
        value: p.harga ?? p.totalConstructionCost ?? 0,
        date: p.createdAt || null,
      }));
      return items;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Counts: manual projects and library items
export const fetchDashboardCounts = createAsyncThunk(
  'dashboard/fetchDashboardCounts',
  async (_, { rejectWithValue }) => {
    try {
      const [manualRes, libraryRes] = await Promise.all([
        axios.get(`${api}/projects/manual`, { params: { page: 1, limit: 1 }, headers: getAuthHeaders() }),
        axios.get(`${api}/projects/library`, { params: { page: 1, limit: 1 }, headers: getAuthHeaders() }),
      ]);
      const manualTotal =
        manualRes.data?.pagination?.totalData ??
        manualRes.data?.pagination?.total ??
        (manualRes.data?.data?.length || 0);
      const libraryTotal =
        libraryRes.data?.pagination?.totalData ??
        libraryRes.data?.pagination?.total ??
        (libraryRes.data?.data?.length || 0);
      return { manualTotal, libraryTotal };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    chart: { labels: [], series: [], loading: false, error: null },
    statCards: [
      { id: "total-estimates", label: "Total Estimates", value: 0, icon: "🧮", color: "bg-stat-blue" },
      { id: "infra-types", label: "Library Items", value: 0, icon: "🗂️", color: "bg-stat-emerald" },
    ],
    quickActions: [
      { id: "new-estimate", label: "Create Estimate", icon: "➕" },
      { id: "view-reports", label: "View Opex", icon: "📄" },
      { id: "cost-analytics", label: "Cost Analytics", icon: "📊" },
      { id: "library", label: "Open Library", icon: "🗂️" },
    ],
    recentCapex: [],
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
    counts: { manualTotal: 0, libraryTotal: 0 },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Chart
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
      })
      // Recent manual CAPEX
      .addCase(fetchDashboardManualRecent.fulfilled, (state, action) => {
        state.recentCapex = Array.isArray(action.payload) ? action.payload : [];
      })
      // Counts
      .addCase(fetchDashboardCounts.fulfilled, (state, action) => {
        const { manualTotal = 0, libraryTotal = 0 } = action.payload || {};
        state.counts = { manualTotal, libraryTotal };
        state.statCards = state.statCards.map((c) => {
          if (c.id === 'total-estimates') return { ...c, value: manualTotal };
          if (c.id === 'infra-types') return { ...c, label: 'Library Items', value: libraryTotal, icon: '🗂️' };
          return c;
        });
      });
  },
});

export default dashboardSlice.reducer;
