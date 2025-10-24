import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';

const api = process.env.REACT_APP_API;

const getAuthHeaders = () => {
  const token = Cookies.get('accessToken');
  const headers = {
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
    Expires: '0',
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
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
      const response = await axios.get(`${api}/unit-prices/unique-fields`, {
        headers: getAuthHeaders(),
      });
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
      const response = await axios.get(`${api}/unit-prices/unique-fields`, {
        headers: getAuthHeaders(),
      });
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
      const response = await axios.delete(`${api}/projects/auto`, { //delete all unitprice data project
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

// Async thunk to update a unit price by id
export const updateUnitPrice = createAsyncThunk(
  'unitPrice/updateUnitPrice',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${api}/unit-prices/${id}`, data, {
        headers: getAuthHeaders(),
      });
      const updated = response.data?.data || { id, ...data };
      return updated;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// NEW: delete a unit price by id
export const deleteUnitPrice = createAsyncThunk(
  'unitPrice/deleteUnitPrice',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${api}/unit-prices/${id}`, {
        headers: getAuthHeaders(),
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// NEW: fetch dropdown filter options for Unit Price (support fetching all volumes on first load)
export const fetchUnitPriceFilters = createAsyncThunk(
  'unitPrice/fetchUnitPriceFilters',
  async ({ infrastruktur } = {}, { rejectWithValue }) => {
    try {
      const params = {};
      if (infrastruktur) params.infrastruktur = infrastruktur;
      const res = await axios.get(`${api}/unit-prices/filters`, {
        params,
        headers: getAuthHeaders(),
      });
      const d = res.data?.data || {};
      return {
        infrastruktur: Array.isArray(d.infrastruktur) ? d.infrastruktur : [],
        volume: Array.isArray(d.volume) ? d.volume : [],
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
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
  uniqueLoading: false, // NEW: khusus fetchUniqueFields
  modalLoading: false,
  loadingRecommended: false,
  error: null,
  modalError: null,
  // NEW: dropdown options (volume cascaded by infrastruktur)
  filterOptions: {
    volume: [],
  },
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
    volume: '',
  },
  loading: false,
  error: null,
};

export const fetchUnitPriceDataForModal = createAsyncThunk(
  'unitPrice/fetchUnitPriceDataForModal',
  async (
    { tipe = '', search = '', infrastruktur = '', kelompok = '' } = {}, // CHANGED: add filters
    { rejectWithValue }
  ) => {
    try {
      const params = { tipe, search };
      if (infrastruktur) params.infrastruktur = infrastruktur; // NEW
      if (kelompok) params.kelompok = kelompok;                 // NEW
      const response = await axios.get(`${api}/unit-prices/best-prices`, {
        params,
        headers: getAuthHeaders(), // NEW: include auth headers
      });
      return response.data; // Adjust response to include recommended and composing prices
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
    uploadLoading: false,
    uploadResult: null,
    updateLoading: false,
    updateError: null,
    updatingId: null,
    // NEW: per-row delete state
    rowDeleteLoading: false,
    rowDeletingId: null,
  },
  reducers: {
    setFilters: (state, action) => {
      const payload = action.payload || {};
      const next = { ...state.transport.filters, ...payload };

      // NEW: reset volume when other filters change (unless volume is explicitly provided)
      const shouldResetVolume =
        !Object.prototype.hasOwnProperty.call(payload, 'volume') &&
        ['infrastruktur', 'kelompok', 'tipe'].some((k) =>
          Object.prototype.hasOwnProperty.call(payload, k)
        );

      if (shouldResetVolume) {
        next.volume = '';
      }

      state.transport.filters = next;
    },
    setPagination: (state, action) => {
      state.transport.pagination = { ...state.transport.pagination, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      // REPLACED: fetchUniqueFields now uses uniqueLoading
      .addCase(fetchUniqueFields.pending, (state) => {
        state.uniqueLoading = true;
        state.error = null;
      })
      .addCase(fetchUniqueFields.fulfilled, (state, action) => {
        state.uniqueLoading = false;
        state.uniqueFields = action.payload;
      })
      .addCase(fetchUniqueFields.rejected, (state, action) => {
        state.uniqueLoading = false;
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
        // NEW: derive volume options from current rows (accumulate + dedupe)
        try {
          const existing = Array.isArray(state.filterOptions.volume) ? state.filterOptions.volume : [];
          const fromRows = (Array.isArray(action.payload.data) ? action.payload.data : [])
            .map(r => r?.volume)
            .filter(v => v !== null && v !== undefined && v !== '')
            .map(v => String(v));
          const set = new Set([...existing, ...fromRows]);
          // sort numerically when possible, fallback to string
          const sorted = Array.from(set).sort((a, b) => {
            const na = Number(a), nb = Number(b);
            const fa = Number.isFinite(na), fb = Number.isFinite(nb);
            if (fa && fb) return na - nb;
            if (fa) return -1;
            if (fb) return 1;
            return a.localeCompare(b);
          });
          state.filterOptions.volume = sorted;
        } catch {}
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
        // Normalisasi agar setiap item punya recommendedPrice & composingPrices (selalu array)
        const rows = (action.payload?.recommendations || action.payload?.data || []).map((r) => {
          const item = r.recommendedItem ?? {};
          const composingRaw = r.composingPrices ?? r.components ?? r.composing ?? r.detail ?? [];
          const composingPrices = Array.isArray(composingRaw)
            ? composingRaw.map((cp) => ({
                ...cp,
                // pastikan totalHarga tersedia
                totalHarga:
                  cp?.totalHarga ??
                  ((Number(cp?.qty) || 0) * (Number(cp?.hargaSatuan) || 0)),
              }))
            : [];

          return {
            ...r,
            recommendedPrice:
              r.recommendedPrice ??
              r.hargaRekomendasi ??
              r.bestPrice ??
              r.hargaSatuan ??
              r.price ??
              null,
            composingPrices,

            // Flatten beberapa field penting dari recommendedItem bila kosong di level atas
            workcode: r.workcode ?? item.workcode ?? '',
            uraian: r.uraian ?? item.uraian ?? '',
            spesifikasi: r.spesifikasi ?? r.specification ?? item.spesifikasi ?? item.specification ?? '',
            specification: r.specification ?? r.spesifikasi ?? item.specification ?? item.spesifikasi ?? '',
            qty: r.qty ?? item.qty ?? 0,
            satuan: r.satuan ?? item.satuan ?? '',
            tahun: r.tahun ?? item.tahun ?? null,
            lokasi: r.lokasi ?? item.lokasi ?? '',
            proyek: r.proyek ?? item.proyek ?? '',
            volume: r.volume ?? item.volume ?? 0,
            satuanVolume: r.satuanVolume ?? item.satuanVolume ?? '',
            kelompok: r.kelompok ?? item.kelompok ?? '',
            kelompokDetail: r.kelompokDetail ?? item.kelompokDetail ?? '',
            tipe: r.tipe ?? item.tipe ?? '',
            infrastruktur: r.infrastruktur ?? item.infrastruktur ?? '',
          };
        });

        state.transport.data = rows;
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
      })
      // updateUnitPrice cases
      .addCase(updateUnitPrice.pending, (state, action) => {
        state.updateLoading = true;
        state.updateError = null;
        state.updatingId = action.meta?.arg?.id ?? null;
      })
      .addCase(updateUnitPrice.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.updatingId = null;
        const updated = action.payload;
        const idx = state.transport.data.findIndex((r) => r.id === updated.id);
        if (idx !== -1) {
          state.transport.data[idx] = {
            ...state.transport.data[idx],
            ...updated,
          };
          const item = state.transport.data[idx];
          // Only auto-calc totalHarga if API didn't provide it
          if (
            (updated.totalHarga === undefined || updated.totalHarga === null) &&
            item.qty != null &&
            item.hargaSatuan != null
          ) {
            item.totalHarga = Number(item.qty) * Number(item.hargaSatuan);
          }
        }
      })
      .addCase(updateUnitPrice.rejected, (state, action) => {
        state.updateLoading = false;
        state.updatingId = null;
        state.updateError = action.payload;
      })
      // NEW: deleteUnitPrice cases
      .addCase(deleteUnitPrice.pending, (state, action) => {
        state.rowDeleteLoading = true;
        state.rowDeletingId = action.meta?.arg ?? null;
      })
      .addCase(deleteUnitPrice.fulfilled, (state, action) => {
        state.rowDeleteLoading = false;
        const removedId = action.payload;
        state.transport.data = state.transport.data.filter((r) => String(r.id) !== String(removedId));
        state.rowDeletingId = null;
        // adjust pagination locally
        const p = state.transport.pagination;
        const newTotal = Math.max(0, Number(p.total || 0) - 1);
        const newTotalPages = Math.max(1, Math.ceil(newTotal / (p.limit || 10)));
        state.transport.pagination = {
          ...p,
          total: newTotal,
          totalPages: newTotalPages,
        };
      })
      .addCase(deleteUnitPrice.rejected, (state, action) => {
        state.rowDeleteLoading = false;
        state.rowDeletingId = null;
        state.transport.error = action.payload;
      })
      // NEW: handle unit price filters options
      .addCase(fetchUnitPriceFilters.fulfilled, (state, action) => {
        const payload = action.payload || { volume: [] };
        // Only overwrite when backend provides volume list; otherwise keep accumulated options
        if (payload.volume && payload.volume.length) {
          state.filterOptions.volume = payload.volume.map(v => String(v));
        }
        if (payload.infrastruktur?.length) {
          state.uniqueFields.infrastruktur = payload.infrastruktur;
        }
      });
  },
});

export const { setFilters, setPagination } = unitPriceSlice.actions;

// NEW: export helper (moved from component)
export function exportUnitPricesExcel({ rows = [], columns = [], filename = 'unit_prices.xls' } = {}) {
  const safeCols = Array.isArray(columns) && columns.length ? columns : [];
  const safeRows = Array.isArray(rows) ? rows : [];

  const th = safeCols
    .map((c) => `<th style="border:1px solid #e5e7eb;padding:6px 8px;background:#f9fafb;color:#374151;text-align:left;font-weight:600;">${c.label}</th>`)
    .join('');

  const trs = safeRows
    .map((row) => {
      const tds = safeCols
        .map((c) => {
          let v = row[c.key];
          if (c.key === 'hargaSatuan' || c.key === 'totalHarga') {
            v = v ? `Rp${Number(v).toLocaleString()}` : '';
          }
          return `<td style="border:1px solid #e5e7eb;padding:6px 8px;color:#111827;">${v ?? ''}</td>`;
        })
        .join('');
      return `<tr>${tds}</tr>`;
    })
    .join('');

  const html = `
    <!DOCTYPE html><html><head><meta charset="utf-8"><title>UnitPrice</title></head>
    <body>
      <table cellspacing="0" cellpadding="0" style="border-collapse:collapse;width:100%;font-family:Arial,Helvetica,sans-serif;font-size:12px;">
        <thead><tr>${th}</tr></thead>
        <tbody>${trs}</tbody>
      </table>
    </body></html>`;

  const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}

export default unitPriceSlice.reducer;
