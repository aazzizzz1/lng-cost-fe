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
