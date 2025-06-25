import { createSlice } from '@reduxjs/toolkit';

// List kelompok pekerjaan konstruksi
export const kelompokList = [
  "PROJECT MANAGEMENT DAN PEKERJAAN PERSIAPAN",
  "SUPPORTING WORK",
  "PENYEDIAAN MATERIAL",
  "PEKERJAAN PEMASANGAN DAN PENGUJIAN",
  "PEKERJAAN KHUSUS/FINISHING",
  "PEKERJAAN DOKUMENTASI",
  "PEKERJAAN COMMISSIONING & TRIAL OPERATION"
];

// Template kode dan uraian per kelompok
export const kelompokTemplates = {
  "PROJECT MANAGEMENT DAN PEKERJAAN PERSIAPAN": [
    { kode: "A", uraian: "PREPARATION", isCategory: true },
    { kode: "A.1", uraian: "PROJECT MANAGEMENT EPCC" },
    { kode: "A.2", uraian: "PROJECT FACILITY" },
    { kode: "A.3", uraian: "WORK PERMIT" }
  ],
  "SUPPORTING WORK": [
    { kode: "B", uraian: "SUPPORTING WORK", isCategory: true },
    { kode: "B.1", uraian: "ENGINEERING WORK" },
    { kode: "B.2", uraian: "PROCUREMENT & CONSTRUCTION" }
  ],
  "PENYEDIAAN MATERIAL": [
    { kode: "C", uraian: "PENYEDIAAN MATERIAL", isCategory: true },
    { kode: "C.1", uraian: "MATERIAL UTAMA" },
    { kode: "C.2", uraian: "MATERIAL PENDUKUNG" }
  ],
  "PEKERJAAN PEMASANGAN DAN PENGUJIAN": [
    { kode: "D", uraian: "PEMASANGAN DAN PENGUJIAN", isCategory: true },
    { kode: "D.1", uraian: "INSTALASI" },
    { kode: "D.2", uraian: "PENGUJIAN" }
  ],
  "PEKERJAAN KHUSUS/FINISHING": [
    { kode: "E", uraian: "KHUSUS/FINISHING", isCategory: true },
    { kode: "E.1", uraian: "FINISHING" }
  ],
  "PEKERJAAN DOKUMENTASI": [
    { kode: "F", uraian: "DOKUMENTASI", isCategory: true },
    { kode: "F.1", uraian: "LAPORAN" }
  ],
  "PEKERJAAN COMMISSIONING & TRIAL OPERATION": [
    { kode: "G", uraian: "COMMISSIONING & TRIAL OPERATION", isCategory: true },
    { kode: "G.1", uraian: "COMMISSIONING" }
  ]
};

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
                  ? parseFloat(value) * item.hargaSatuan
                  : field === "hargaSatuan"
                  ? item.qty * parseFloat(value)
                  : item.qty * item.hargaSatuan,
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
  }
});

export const {
  setItems,
  updateItem,
  addItem,
  deleteItem,
  openModal,
  closeModal,
  setModalSearch
} = detailCreateProjectConstructionSlice.actions;

export const selectItems = state => state.detailCreateProjectConstruction.items;
export const selectModal = state => state.detailCreateProjectConstruction.modal;

export default detailCreateProjectConstructionSlice.reducer;
