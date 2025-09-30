import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Ambil URL API dari .env
const API_URL = process.env.REACT_APP_API + "/calculator/total-cost";

// Async thunk untuk fetch data referensi dari backend
export const fetchReferenceData = createAsyncThunk(
  "capacityFactor/fetchReferenceData",
  async () => {
    const res = await axios.get(API_URL);
    // Group by infrastructure, mapping volume->capacity dan totalCost->cost
    const grouped = {};
    res.data.data.forEach((item) => {
      const type = item.infrastructure;
      if (!grouped[type]) grouped[type] = [];
      grouped[type].push({
        capacity: item.volume,
        cost: item.totalCost,
        // Simpan juga unit jika perlu
        unit: item.unit,
        year: item.year,
        location: item.location,
        information: item.information,
      });
    });
    return grouped;
  }
);

// Async thunk untuk upload excel capacity factor
export const uploadCapacityFactorExcel = createAsyncThunk(
  "capacityFactor/uploadCapacityFactorExcel",
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await axios.post(
        `${process.env.REACT_APP_API}/calculator/total-cost/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // response.data: { message, count, skippedRows }
      return {
        type: "success",
        message: response.data?.message || "Excel uploaded.",
        count: response.data?.data?.count,
        skippedRows: response.data?.data?.skippedRows,
      };
    } catch (error) {
      return rejectWithValue({
        type: "error",
        message: error.response?.data?.message || "Failed to upload excel.",
      });
    }
  }
);

// Async thunk untuk delete all capacity factor (total cost)
export const deleteAllCapacityFactor = createAsyncThunk(
  "capacityFactor/deleteAllCapacityFactor",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${process.env.REACT_APP_API}/calculator/total-cost`);
      // response.data: { message, data: { count } }
      return {
        type: "success",
        message: response.data?.message || "All capacity factor data deleted.",
        count: response.data?.data?.count,
      };
    } catch (error) {
      return rejectWithValue({
        type: "error",
        message: error.response?.data?.message || "Failed to delete capacity factor data.",
      });
    }
  }
);

// Tambahkan async thunk untuk kalkulasi cost dari backend
export const calculateCostAPI = createAsyncThunk(
  "capacityFactor/calculateCostAPI",
  async (input, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/calculator/estimate`,
        {
          infrastructure: input.type,
          location: input.lokasi,
          year: Number(input.tahun),
          inflation: Number(input.inflasi),
          desiredCapacity: Number(input.capacity),
          method: input.method,
          information: input.information, // <-- tambahkan ini
        }
      );
      // response.data.data: { estimatedCost, r2, r2Interpretation }
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to calculate cost.");
    }
  }
);

const initialState = {
  referenceData: {},
  input: {
    type: "",
    method: "Linear Regression",
    capacity: "",
    tahun: new Date().getFullYear(),
    lokasi: "",
    inflasi: 5,
  },
  result: null,
  r2: null,
  r2Interpretation: null,
  loading: false,
  error: null,
  // Tambahkan state upload
  cfUploadLoading: false,
  cfUploadResult: null,
  // Tambahkan state delete
  cfDeleteLoading: false,
  cfDeleteResult: null,
};

const CapacityFactorSlice = createSlice({
  name: "capacityFactor",
  initialState,
  reducers: {
    setInput(state, action) {
      state.input = { ...state.input, ...action.payload };
    },
    // Hapus calculateCost reducer, gunakan API saja
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReferenceData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReferenceData.fulfilled, (state, action) => {
        state.loading = false;
        state.referenceData = action.payload;
        // Set default type jika belum ada
        if (!state.input.type) {
          const types = Object.keys(action.payload);
          state.input.type = types.length > 0 ? types[0] : "";
        }
      })
      .addCase(fetchReferenceData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(uploadCapacityFactorExcel.pending, (state) => {
        state.cfUploadLoading = true;
        state.cfUploadResult = null;
      })
      .addCase(uploadCapacityFactorExcel.fulfilled, (state, action) => {
        state.cfUploadLoading = false;
        state.cfUploadResult = action.payload;
      })
      .addCase(uploadCapacityFactorExcel.rejected, (state, action) => {
        state.cfUploadLoading = false;
        state.cfUploadResult = action.payload;
      })
      .addCase(deleteAllCapacityFactor.pending, (state) => {
        state.cfDeleteLoading = true;
        state.cfDeleteResult = null;
      })
      .addCase(deleteAllCapacityFactor.fulfilled, (state, action) => {
        state.cfDeleteLoading = false;
        state.cfDeleteResult = action.payload;
        // Kosongkan data setelah delete
        state.referenceData = {};
      })
      .addCase(deleteAllCapacityFactor.rejected, (state, action) => {
        state.cfDeleteLoading = false;
        state.cfDeleteResult = action.payload;
      })
      .addCase(calculateCostAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.result = null;
        state.r2 = null;
        state.r2Interpretation = null;
      })
      .addCase(calculateCostAPI.fulfilled, (state, action) => {
        state.loading = false;
        state.result = action.payload.estimatedCost;
        state.r2 = action.payload.r2;
        state.r2Interpretation = action.payload.r2Interpretation;
      })
      .addCase(calculateCostAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.result = null;
        state.r2 = null;
        state.r2Interpretation = null;
      });
  },
});

export const { setInput } = CapacityFactorSlice.actions;
export default CapacityFactorSlice.reducer;