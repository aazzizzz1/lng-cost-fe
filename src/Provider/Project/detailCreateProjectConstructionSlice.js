import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Fungsi default item
export const defaultItem = (kode, uraian, kelompok, tahun, proyek, lokasi, tipe, isCategory = false) => ({
  kode,
  uraian,
  satuan: "",
  qty: 1,
  hargaSatuan: 0,
  totalHarga: 0,
  kelompok,
  tahun,
  proyek,
  lokasi,
  tipe,
  isCategory,
  aaceClass: 5, // Default AACE class is 5
  specification: "", // ensure present
  accuracyLow: 0,
  accuracyHigh: 0,
  satuanVolume: "",
  kapasitasRegasifikasi: 0,
  satuanKapasitas: "",
  kelompokDetail: "",
});

// Initial state
const initialState = {
  items: [],
  modal: {
    open: false,
    type: null,
    itemIdx: null,
    search: "",
  },
  loadingRecommendedCosts: false, // Add loading state
};

export const fetchRecommendedConstructionCosts = createAsyncThunk(
  'detailCreateProjectConstruction/fetchRecommendedConstructionCosts',
  async (projectData, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:5000/api/projects/recommend', projectData);
      return response.data.data; // Return the recommended construction costs
    } catch (error) {
      console.error('Error fetching recommended construction costs:', error);
      return rejectWithValue(error.response?.data || 'Failed to fetch construction costs');
    }
  }
);

// Slice kosong, hanya untuk namespace jika ingin menambah reducer terkait detail construction project
const detailCreateProjectConstructionSlice = createSlice({
  name: 'detailCreateProjectConstruction',
  initialState,
  reducers: {
    setItems: (state, action) => {
      state.items = action.payload;
    },
    updateItem: (state, action) => {
      const { idx, field, value } = action.payload;
      state.items = state.items.map((item, i) =>
        i === idx
          ? {
              ...item,
              [field]:
                field === "qty" || field === "hargaSatuan"
                  ? parseFloat(value)
                  : field === "aaceClass"
                  ? parseInt(value)
                  : value,
              totalHarga:
                field === "qty"
                  ? parseFloat(value) * (item.hargaSatuan || 0)
                  : field === "hargaSatuan"
                  ? (item.qty || 1) * parseFloat(value)
                  : item.totalHarga !== undefined
                  ? item.totalHarga
                  : (item.qty || 1) * (item.hargaSatuan || 0),
            }
          : item
      );
    },
    addItem: (state, action) => {
      state.items.push(action.payload);
    },
    deleteItem: (state, action) => {
      state.items = state.items.filter((_, i) => i !== action.payload);
    },
    openModal: (state, action) => {
      state.modal = {
        open: true,
        ...action.payload // type, itemIdx, search
      };
    },
    closeModal: (state) => {
      state.modal = {
        open: false,
        type: null,
        itemIdx: null,
        search: "",
      };
    },
    setModalSearch: (state, action) => {
      state.modal.search = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecommendedConstructionCosts.pending, (state) => {
        state.loadingRecommendedCosts = true; // Set loading to true
      })
      .addCase(fetchRecommendedConstructionCosts.fulfilled, (state, action) => {
        state.loadingRecommendedCosts = false; // Set loading to false
        state.items = action.payload.map((item) => ({
          kode: item.id,
          uraian: item.uraian,
          specification: item.specification || "",
          satuan: item.satuan || "",
          qty: Number(item.qty) || 0,
          hargaSatuan: Number(item.hargaSatuan) || 0,
          totalHarga: Number(item.totalHarga) || 0,
          kelompok: item.kelompok || "",
          tahun: Number(item.tahun) || new Date().getFullYear(),
          proyek: item.proyek || "",
          lokasi: item.lokasi || "",
          tipe: item.tipe || "",
          isCategory: false,
          aaceClass: Number(item.aaceClass) || 0,
          accuracyLow: Number.isFinite(item.accuracyLow) ? item.accuracyLow : 0,
          accuracyHigh: Number.isFinite(item.accuracyHigh) ? item.accuracyHigh : 0,
          satuanVolume: item.satuanVolume || "",
          kapasitasRegasifikasi: Number(item.kapasitasRegasifikasi) || 0,
          satuanKapasitas: item.satuanKapasitas || "",
          kelompokDetail: item.kelompokDetail || "",
        }));
      })
      .addCase(fetchRecommendedConstructionCosts.rejected, (state) => {
        state.loadingRecommendedCosts = false; // Set loading to false
        console.error('Failed to fetch recommended construction costs');
      });
  },
});

export const {
  setItems,
  updateItem,
  addItem,
  deleteItem,
  openModal,
  closeModal,
  setModalSearch,
} = detailCreateProjectConstructionSlice.actions;

export const selectItems = (state) => state.detailCreateProjectConstruction.items;
export const selectModal = (state) => state.detailCreateProjectConstruction.modal;

export default detailCreateProjectConstructionSlice.reducer;
