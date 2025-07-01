import { createSlice, combineReducers } from '@reduxjs/toolkit';

const initialState = {
  projects: [
    // --- Project yang sesuai dengan constraction cost ---
    {
      id: 100,
      name: "FSRU Lampung",
      jenis: "FSRU",
      kategori: "Big Scale FSRU > 150.000 m³",
      lokasi: "Jawa Timur",
      tahun: 2023,
      levelAACE: 2,
      harga: 5000000000,
    },
    {
      id: 101,
      name: "Small LNG Plant Bau Bau",
      jenis: "LNG Plant",
      kategori: "Small-Scale Liquefaction Plant (100 - 800 TPD)",
      lokasi: "Sulawesi",
      tahun: 2020,
      levelAACE: 5,
      harga: 3000000000,
    },
    {
      id: 102,
      name: "LNGC Papua",
      jenis: "LNGC",
      kategori: "Big Scale LNGC > 100.000 m³",
      lokasi: "Kepulauan Riau",
      tahun: 2023,
      levelAACE: 2,
      harga: 7000000000,
    },
    // Tambahan data project
    {
      id: 103,
      name: "LNGC Mid Example",
      jenis: "LNGC",
      kategori: "MID SCALE LNG CARRIER (LNGC) [30.000 - 100.000 m³]",
      lokasi: "Jawa Barat",
      tahun: 2023,
      levelAACE: 3,
      harga: 4000000000,
    },
    {
      id: 104,
      name: "LNGC Small Example",
      jenis: "LNGC",
      kategori: "SMALL SCALE LNG CARRIER (LNGC) [< 30.000 m³]",
      lokasi: "Kalimantan Timur",
      tahun: 2023,
      levelAACE: 4,
      harga: 2000000000,
    },
    {
      id: 105,
      name: "FSRU Mid Example",
      jenis: "FSRU",
      kategori: "MID SCALE LNG FSRU [50.000 - 150.000 m³]",
      lokasi: "Jawa Tengah",
      tahun: 2023,
      levelAACE: 3,
      harga: 2500000000,
    },
    {
      id: 106,
      name: "FSRU Small Example",
      jenis: "FSRU",
      kategori: "SMALL SCALE LNG FSRU [< 30.000 m³]",
      lokasi: "Sumatera Selatan",
      tahun: 2023,
      levelAACE: 4,
      harga: 1200000000,
    },
    {
      id: 107,
      name: "Engineering Estimate LNG Bunkering Barge",
      jenis: "LNGC",
      kategori: "Small Scale LNGC",
      lokasi: "Jawa Timur",
      tahun: 2022,
      levelAACE: 2,
      harga: 1000000000,
    },
    {
      id: 108,
      name: "Offshore LNG Plant B",
      jenis: "Offshore LNG Plant",
      kategori: "Offshore LNG Plant",
      lokasi: "Sulawesi",
      tahun: 2023,
      levelAACE: 2,
      harga: 6000000000,
    },
    {
      id: 109,
      name: "Onshore LNG Plant A",
      jenis: "Onshore LNG Plant",
      kategori: "Onshore LNG Plant",
      lokasi: "Papua",
      tahun: 2023,
      levelAACE: 2,
      harga: 5000000000,
    },
    {
      id: 110,
      name: "FSRU Jakarta",
      jenis: "FSRU",
      kategori: "FSRU",
      lokasi: "Jakarta",
      tahun: 2023,
      levelAACE: 2,
      harga: 4000000000,
    },
    {
      id: 111,
      name: "ORF Surabaya",
      jenis: "ORF",
      kategori: "ORF",
      lokasi: "Surabaya",
      tahun: 2023,
      levelAACE: 2,
      harga: 3500000000,
    },
    {
      id: 112,
      name: "OTS Makassar",
      jenis: "OTS",
      kategori: "OTS",
      lokasi: "Makassar",
      tahun: 2023,
      levelAACE: 2,
      harga: 3200000000,
    },
    {
      id: 113,
      name: "ORU Bali",
      jenis: "ORU",
      kategori: "ORU",
      lokasi: "Bali",
      tahun: 2023,
      levelAACE: 2,
      harga: 3100000000,
    },
    {
      id: 114,
      name: "LNG Barge Batam",
      jenis: "LNG Barge",
      kategori: "LNG Barge 50.000 m³",
      lokasi: "Batam",
      tahun: 2023,
      levelAACE: 2,
      harga: 2500000000,
    },
    {
      id: 115,
      name: "LNG Trucking Jakarta",
      jenis: "LNG Trucking",
      kategori: "LNG Trucking 100 CBM",
      lokasi: "Jakarta",
      tahun: 2023,
      levelAACE: 2,
      harga: 1000000000,
    },
  ],
};

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    createProject: (state, action) => {
      state.projects.push(action.payload);
    },
    // reducer lain jika diperlukan
  },
});

const projectConstructionCostSlice = createSlice({
  name: 'projectConstructionCost',
  initialState: {},
  reducers: {
    saveProjectCost: (state, action) => {
      const { projectId, items } = action.payload;
      state[projectId] = items;
    },
  },
});

export const { createProject } = projectSlice.actions;
export const { saveProjectCost } = projectConstructionCostSlice.actions;

// Gabungkan reducer jika perlu
export const rootReducer = combineReducers({
  projects: projectSlice.reducer,
  projectConstructionCost: projectConstructionCostSlice.reducer,
});

export default projectSlice.reducer;
