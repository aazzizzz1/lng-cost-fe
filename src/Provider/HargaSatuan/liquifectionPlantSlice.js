import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: [
    // === Onshore LNG Plant ===
    {
      id: 1001,
      uraian: "Project Management Onshore",
      satuan: "Ls",
      qty: 1,
      hargaSatuan: 5000000000,
      totalHarga: 5000000000,
      aaceClass: 2,
      accuracyLow: -15,
      accuracyHigh: 20,
      kelompok: "PROJECT MANAGEMENT",
      tahun: 2023,
      proyek: "Onshore LNG Plant A",
      lokasi: "Papua",
      tipe: "Onshore LNG Plant",
      kategori: "Material Konstruksi"
    },
    {
      id: 1002,
      uraian: "Compressor",
      satuan: "Unit",
      qty: 2,
      hargaSatuan: 2000000000,
      totalHarga: 4000000000,
      aaceClass: 2,
      accuracyLow: -15,
      accuracyHigh: 20,
      kelompok: "PERALATAN",
      tahun: 2023,
      proyek: "Onshore LNG Plant A",
      lokasi: "Papua",
      tipe: "Onshore LNG Plant",
      kategori: "Peralatan"
    },
    {
      id: 1003,
      uraian: "Upah Tukang Las",
      satuan: "Orang",
      qty: 10,
      hargaSatuan: 600000,
      totalHarga: 6000000,
      aaceClass: 2,
      accuracyLow: -15,
      accuracyHigh: 20,
      kelompok: "UPAH",
      tahun: 2023,
      proyek: "Onshore LNG Plant A",
      lokasi: "Papua",
      tipe: "Onshore LNG Plant",
      kategori: "Upah"
    },
    {
      id: 1004,
      uraian: "Jasa Surveyor",
      satuan: "Ls",
      qty: 1,
      hargaSatuan: 12000000,
      totalHarga: 12000000,
      aaceClass: 2,
      accuracyLow: -15,
      accuracyHigh: 20,
      kelompok: "JASA",
      tahun: 2023,
      proyek: "Onshore LNG Plant A",
      lokasi: "Papua",
      tipe: "Onshore LNG Plant",
      kategori: "Jasa"
    },
    {
      id: 1005,
      uraian: "Testing Plant",
      satuan: "Ls",
      qty: 1,
      hargaSatuan: 25000000,
      totalHarga: 25000000,
      aaceClass: 2,
      accuracyLow: -15,
      accuracyHigh: 20,
      kelompok: "TESTING",
      tahun: 2023,
      proyek: "Onshore LNG Plant A",
      lokasi: "Papua",
      tipe: "Onshore LNG Plant",
      kategori: "Testing"
    },
    // === Offshore LNG Plant ===
    {
      id: 1101,
      uraian: "Project Management Offshore",
      satuan: "Ls",
      qty: 1,
      hargaSatuan: 6000000000,
      totalHarga: 6000000000,
      aaceClass: 2,
      accuracyLow: -15,
      accuracyHigh: 20,
      kelompok: "PROJECT MANAGEMENT",
      tahun: 2023,
      proyek: "Offshore LNG Plant B",
      lokasi: "Sulawesi",
      tipe: "Offshore LNG Plant",
      kategori: "Material Konstruksi"
    },
    {
      id: 1102,
      uraian: "Cryogenic Pump",
      satuan: "Unit",
      qty: 3,
      hargaSatuan: 1500000000,
      totalHarga: 4500000000,
      aaceClass: 2,
      accuracyLow: -15,
      accuracyHigh: 20,
      kelompok: "PERALATAN",
      tahun: 2023,
      proyek: "Offshore LNG Plant B",
      lokasi: "Sulawesi",
      tipe: "Offshore LNG Plant",
      kategori: "Peralatan"
    },
    {
      id: 1103,
      uraian: "Upah Operator",
      satuan: "Orang",
      qty: 8,
      hargaSatuan: 700000,
      totalHarga: 5600000,
      aaceClass: 2,
      accuracyLow: -15,
      accuracyHigh: 20,
      kelompok: "UPAH",
      tahun: 2023,
      proyek: "Offshore LNG Plant B",
      lokasi: "Sulawesi",
      tipe: "Offshore LNG Plant",
      kategori: "Upah"
    },
    {
      id: 1104,
      uraian: "Jasa Konsultan",
      satuan: "Ls",
      qty: 1,
      hargaSatuan: 18000000,
      totalHarga: 18000000,
      aaceClass: 2,
      accuracyLow: -15,
      accuracyHigh: 20,
      kelompok: "JASA",
      tahun: 2023,
      proyek: "Offshore LNG Plant B",
      lokasi: "Sulawesi",
      tipe: "Offshore LNG Plant",
      kategori: "Jasa"
    },
    {
      id: 1105,
      uraian: "Testing Offshore Plant",
      satuan: "Ls",
      qty: 1,
      hargaSatuan: 30000000,
      totalHarga: 30000000,
      aaceClass: 2,
      accuracyLow: -15,
      accuracyHigh: 20,
      kelompok: "TESTING",
      tahun: 2023,
      proyek: "Offshore LNG Plant B",
      lokasi: "Sulawesi",
      tipe: "Offshore LNG Plant",
      kategori: "Testing"
    },
  ],
  filterTipe: "Onshore LNG Plant", // Tab aktif: Onshore LNG Plant, Offshore LNG Plant
  filterKategori: [], // Array: Material Konstruksi, Peralatan, Upah, Jasa, Testing
  search: "",
};

const liquifectionPlantSlice = createSlice({
  name: "liquifectionPlant",
  initialState,
  reducers: {
    setFilterTipe: (state, action) => {
      state.filterTipe = action.payload;
    },
    setFilterKategori: (state, action) => {
      state.filterKategori = action.payload;
    },
    setSearch: (state, action) => {
      state.search = action.payload;
    },
  },
});

export const { setFilterTipe, setFilterKategori, setSearch } = liquifectionPlantSlice.actions;

export default liquifectionPlantSlice.reducer;
