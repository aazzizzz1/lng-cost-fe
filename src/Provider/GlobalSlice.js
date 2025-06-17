import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isSidebarOpen: true,
  isHargaSatuanOpen: false,
  isHargaPerkiraanOpen: false,
  isLNGPlantOpen: false,
  isTransportationOpen: false,
  isReceivingTerminalOpen: false,
  isMaterialPackageOpen: false,
};

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    setSidebarOpen(state, action) {
      state.isSidebarOpen = action.payload;
    },
    toggleHargaSatuan(state) {
      state.isHargaSatuanOpen = !state.isHargaSatuanOpen;
    },
    toggleHargaPerkiraan(state) {
      state.isHargaPerkiraanOpen = !state.isHargaPerkiraanOpen;
    },
    toggleLNGPlant(state) {
      state.isLNGPlantOpen = !state.isLNGPlantOpen;
    },
    toggleTransportation(state) {
      state.isTransportationOpen = !state.isTransportationOpen;
    },
    toggleReceivingTerminal(state) {
      state.isReceivingTerminalOpen = !state.isReceivingTerminalOpen;
    },
    toggleMaterialPackage(state) {
      state.isMaterialPackageOpen = !state.isMaterialPackageOpen;
    },
    closeAllDropdowns(state) {
      state.isHargaSatuanOpen = false;
      state.isHargaPerkiraanOpen = false;
      state.isLNGPlantOpen = false;
      state.isTransportationOpen = false;
      state.isReceivingTerminalOpen = false;
      state.isMaterialPackageOpen = false;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  toggleHargaSatuan,
  toggleHargaPerkiraan,
  toggleLNGPlant,
  toggleTransportation,
  toggleReceivingTerminal,
  toggleMaterialPackage,
  closeAllDropdowns,
} = globalSlice.actions;

export default globalSlice.reducer;
