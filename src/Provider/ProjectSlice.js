import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  projects: [
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
    {
      id: 7,
      name: "LNG Satellite Plant Kalimantan",
      jenis: "Satellite Plant",
      kategori: "8k",
      lokasi: "Kalimantan",
      tahun: 2023,
      levelAACE: 2,
      harga: 4500000,
    },
    {
      id: 8,
      name: "LNG Distribution Terminal Batam",
      jenis: "Distribution Terminal",
      kategori: "12k",
      lokasi: "Batam",
      tahun: 2024,
      levelAACE: 3,
      harga: 6000000,
    },
    {
      id: 9,
      name: "LNG Trucking Jawa Barat",
      jenis: "Trucking",
      kategori: "6k",
      lokasi: "Jawa Barat",
      tahun: 2026,
      levelAACE: 4,
      harga: 3500000,
    },
    {
      id: 10,
      name: "LNG Peak Shaving Facility Surabaya",
      jenis: "Peak Shaving Facility",
      kategori: "10k",
      lokasi: "Surabaya",
      tahun: 2025,
      levelAACE: 5,
      harga: 5200000,
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
