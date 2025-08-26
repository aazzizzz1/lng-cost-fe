import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';

const api = process.env.REACT_APP_API;

const getAuthHeaders = () => {
  const token = Cookies.get('accessToken');
  return { 
    Authorization: `Bearer ${token}`,
    'Cache-Control': 'no-cache', // Prevent caching
    Pragma: 'no-cache',          // HTTP 1.0 backward compatibility
    Expires: '0',                // Expire immediately
  };
};

// Async thunk to fetch unique fields
export const fetchUniqueFields = createAsyncThunk(
  'unitPrice/fetchUniqueFields',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${api}/unit-prices/unique-fields`, {
        headers: getAuthHeaders(),
      });
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
      const response = await axios.get(`${api}/unit-prices`, {
        params,
        headers: getAuthHeaders(),
      });
      return response.data; // Ensure the response contains the expected data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async thunk to fetch transport data
export const fetchTransportData = createAsyncThunk(
  'unitPrice/fetchTransportData',
  async ({ page = 1, limit = 10, sort, order, search, tipe = '', infrastruktur = '', kelompok = '', volume = '' } = {}, { rejectWithValue }) => {
    try {
      const params = { page, limit, tipe, infrastruktur, kelompok };
      if (sort) params.sort = sort;
      if (order) params.order = order;
      if (search) params.search = search;
      if (volume) params.volume = volume; // include volume when provided

      const response = await axios.get(`${api}/unit-prices`, { params, headers: getAuthHeaders() });
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

// Async thunk to fetch subtypes of infrastructure
export const fetchSubTypeInfra = createAsyncThunk(
  'unitPrice/fetchSubTypeInfra',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${api}/unit-prices/unique-fields`);
      const groupedData = response.data.data;
      const subTypes = Object.values(groupedData).flatMap(type => Object.keys(type)); // Extract all subtypes
      return subTypes;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteAllUnitPrices = createAsyncThunk(
  'unitPrice/deleteAllUnitPrices',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${api}/unit-prices`, {
        headers: getAuthHeaders(),
      });
      return response.data?.message || "All unit prices deleted.";
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete unit prices.");
    }
  }
);

export const uploadUnitPriceExcel = createAsyncThunk(
  'unitPrice/uploadUnitPriceExcel',
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await axios.post(
        `${api}/upload/excel`,
        formData,
        {
          headers: {
            ...getAuthHeaders(),
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      // response.data: { message, count, skippedRows }
      return {
        type: "success",
        message: response.data?.message || "Excel uploaded.",
        count: response.data?.count,
        skippedRows: response.data?.skippedRows,
      };
    } catch (error) {
      return rejectWithValue({
        type: "error",
        message: error.response?.data?.message || "Failed to upload excel.",
      });
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
  loadingRecommended: false, // Add loading state for recommended data
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
    volume: '', // added volume filter
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
    subTypeInfra: [],
    recommendedPrices: [],
    deleteLoading: false,
    deleteResult: null,
    // Tambahkan state upload
    uploadLoading: false,
    uploadResult: null,
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
        state.transport.pagination = {
          ...state.transport.pagination,
          total: action.payload.pagination.totalData,
          totalPages: action.payload.pagination.totalPages,
          page: action.payload.pagination.currentPage,
          limit: action.payload.pagination.limit,
        }; // Update pagination data
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
        state.loadingRecommended = true; // Set loading state for recommended data
        state.error = null;
      })
      .addCase(fetchRecommendedUnitPrices.fulfilled, (state, action) => {
        state.loadingRecommended = false; // Clear loading state
        state.recommendedPrices = action.payload;
      })
      .addCase(fetchRecommendedUnitPrices.rejected, (state, action) => {
        state.loadingRecommended = false; // Clear loading state
        state.error = action.payload;
      })
      .addCase(fetchSubTypeInfra.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubTypeInfra.fulfilled, (state, action) => {
        state.loading = false;
        state.subTypeInfra = action.payload; // Store fetched subtypes
      })
      .addCase(fetchSubTypeInfra.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteAllUnitPrices.pending, (state) => {
        state.deleteLoading = true;
        state.deleteResult = null;
      })
      .addCase(deleteAllUnitPrices.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.deleteResult = { type: "success", message: action.payload };
      })
      .addCase(deleteAllUnitPrices.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteResult = { type: "error", message: action.payload };
      })
      .addCase(uploadUnitPriceExcel.pending, (state) => {
        state.uploadLoading = true;
        state.uploadResult = null;
      })
      .addCase(uploadUnitPriceExcel.fulfilled, (state, action) => {
        state.uploadLoading = false;
        state.uploadResult = action.payload;
      })
      .addCase(uploadUnitPriceExcel.rejected, (state, action) => {
        state.uploadLoading = false;
        state.uploadResult = action.payload;
      });
  },
});

export const { setFilters, setPagination } = unitPriceSlice.actions;

export default unitPriceSlice.reducer;
