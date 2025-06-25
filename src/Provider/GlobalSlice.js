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
      // No-op for global, handled in layoutSlice
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

// Fungsi handler global untuk klik di luar dropdown
export function handleDropdownOutside({ refs = [], isOpens = [], dispatch, closeAction }) {
  return function(event) {
    let clickedOutsideAll = false;
    if (
      isOpens.some(Boolean) &&
      refs.every(ref => ref?.current && !ref.current.contains(event.target))
    ) {
      clickedOutsideAll = true;
    }
    if (clickedOutsideAll) {
      dispatch(closeAction());
    }
  };
}
