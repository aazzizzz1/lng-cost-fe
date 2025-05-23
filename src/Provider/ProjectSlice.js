import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  projects: [
    {
      id: 1,
      name: "LNG Plant Tanjung Benoa",
      jenis: "LNG Plant",
      kategori: "30k",
      lokasi: "Aceh",
      tahun: 2025,
      levelAACE: "Level 4",
      harga: 10000000,
    },
    {
      id: 2,
      name: "OTS/ORF Project",
      jenis: "OTS/ORF",
      kategori: "20k",
      lokasi: "Papua",
      tahun: 2024,
      levelAACE: "Level 3",
      harga: 8000000,
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
