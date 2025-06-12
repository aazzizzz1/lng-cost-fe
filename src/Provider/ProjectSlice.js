import { createSlice } from '@reduxjs/toolkit';

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
    {
      id: 4,
      name: "LNG Storage Bali",
      jenis: "LNG Storage",
      kategori: "5k",
      lokasi: "Bali",
      tahun: 2026,
      levelAACE: 5,
      harga: 3000000,
    },
    {
      id: 5,
      name: "LNG Regasification Terminal Lampung",
      jenis: "Regasification Terminal",
      kategori: "30k",
      lokasi: "Lampung",
      tahun: 2022,
      levelAACE: 4,
      harga: 12000000,
    },
    {
      id: 6,
      name: "LNG Bunkering Jakarta",
      jenis: "Bunkering",
      kategori: "15k",
      lokasi: "Jakarta",
      tahun: 2025,
      levelAACE: 4,
      harga: 7000000,
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

export const { createProject } = projectSlice.actions;
export default projectSlice.reducer;
