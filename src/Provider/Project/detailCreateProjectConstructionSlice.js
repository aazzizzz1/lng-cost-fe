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
});

// Initial state
const initialState = {
  items: [],
  modal: {
    open: false,
    type: null,
    itemIdx: null,
    search: "",
  }
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
    builder.addCase(fetchRecommendedConstructionCosts.fulfilled, (state, action) => {
      state.items = action.payload.map((item) => ({
        kode: item.id,
        uraian: item.uraian,
        satuan: item.satuan,
        qty: item.qty,
        hargaSatuan: item.hargaSatuan,
        totalHarga: item.totalHarga,
        kelompok: item.kelompok,
        tahun: item.tahun,
        proyek: item.proyek,
        lokasi: item.lokasi,
        tipe: item.tipe,
        isCategory: false,
        aaceClass: item.aaceClass,
      }));
    });
    builder.addCase(fetchRecommendedConstructionCosts.rejected, (state, action) => {
      console.error('Failed to fetch recommended construction costs:', action.payload);
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
