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

const initialState = {
  referenceData: {},
  input: {
    type: "",
    method: "Linear Regression",
    capacity: "",
  },
  result: null,
  loading: false,
  error: null,
  // Tambahkan state upload
  cfUploadLoading: false,
  cfUploadResult: null,
  // Tambahkan state delete
  cfDeleteLoading: false,
  cfDeleteResult: null,
};

function linearRegression(data, x) {
  // y = a + bx
  const n = data.length;
  const sumX = data.reduce((acc, d) => acc + d.capacity, 0);
  const sumY = data.reduce((acc, d) => acc + d.cost, 0);
  const sumXY = data.reduce((acc, d) => acc + d.capacity * d.cost, 0);
  const sumX2 = data.reduce((acc, d) => acc + d.capacity * d.capacity, 0);
  const b = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const a = (sumY - b * sumX) / n;
  return a + b * x;
}

function logLogRegression(data, x) {
  // ln(y) = a + b ln(x)
  const n = data.length;
  const sumLnX = data.reduce((acc, d) => acc + Math.log(d.capacity), 0);
  const sumLnY = data.reduce((acc, d) => acc + Math.log(d.cost), 0);
  const sumLnXLnY = data.reduce(
    (acc, d) => acc + Math.log(d.capacity) * Math.log(d.cost),
    0
  );
  const sumLnX2 = data.reduce((acc, d) => acc + Math.log(d.capacity) ** 2, 0);
  const b = (n * sumLnXLnY - sumLnX * sumLnY) / (n * sumLnX2 - sumLnX ** 2);
  const a = (sumLnY - b * sumLnX) / n;
  return Math.exp(a) * x ** b;
}

function capacityFactorMethod(data, x) {
  // y2 = y1 * (x2/x1)^n, n biasanya 0.6-0.7, gunakan 0.65
  if (data.length < 1) return null;
  const n = 0.65;
  // Cari data dengan kapasitas terdekat
  let closest = data[0];
  let minDiff = Math.abs(x - data[0].capacity);
  for (let i = 1; i < data.length; i++) {
    const diff = Math.abs(x - data[i].capacity);
    if (diff < minDiff) {
      closest = data[i];
      minDiff = diff;
    }
  }
  const { capacity: x1, cost: y1 } = closest;
  return y1 * Math.pow(x / x1, n);
}

const CapacityFactorSlice = createSlice({
  name: "capacityFactor",
  initialState,
  reducers: {
    setInput(state, action) {
      state.input = { ...state.input, ...action.payload };
    },
    calculateCost(state) {
      const { type, method, capacity } = state.input;
      const data = state.referenceData[type] || [];
      let result = null;
      const x = Number(capacity);
      if (!x || data.length === 0) {
        state.result = null;
        return;
      }
      // Jika kapasitas persis ada di database, ambil harga langsung
      const found = data.find((d) => d.capacity === x);
      if (found) {
        result = found.cost;
      } else if (method === "Linear Regression" && data.length >= 2) {
        result = linearRegression(data, x);
      } else if (method === "Log-log Regression" && data.length >= 2) {
        result = logLogRegression(data, x);
      } else if (method === "Capacity Factor Method" && data.length >= 1) {
        result = capacityFactorMethod(data, x);
      }
      state.result = result;
    },
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
      });
  },
});

export const { setInput, calculateCost } = CapacityFactorSlice.actions;
export default CapacityFactorSlice.reducer;