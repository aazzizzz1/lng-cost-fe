import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isSidebarOpen: true,
  isHargaSatuanOpen: false,
  isHargaKonstruksiOpen: false, // renamed from isHargaPerkiraanOpen
  isLNGPlantOpen: false,
  isTransportationOpen: false,
  isReceivingTerminalOpen: false,
  isMaterialPackageOpen: false,

  // ...shared UI styling moved from dashboardSlice so it's globally available...
  accentStyles: {
    blue:  { ringClass: "bg-accent-ring-blue",  iconBgClass: "bg-accent-icon-blue",  iconBorder: "border-blue-400/30" },
    cyan:  { ringClass: "bg-accent-ring-cyan",  iconBgClass: "bg-accent-icon-cyan",  iconBorder: "border-cyan-400/30" },
    violet:{ ringClass: "bg-accent-ring-violet",iconBgClass: "bg-accent-icon-violet",iconBorder: "border-violet-400/30" },
    amber: { ringClass: "bg-accent-ring-amber", iconBgClass: "bg-accent-icon-amber", iconBorder: "border-amber-400/30" },
  },
  chartColors: [
    "#2563eb","#0891b2","#7c3aed","#f59e0b","#059669","#dc2626",
    "#4f46e5","#c026d3","#0d9488","#e11d48","#0284c7","#65a30d",
    "#475569","#db2777","#ea580c","#9333ea"
  ],
  chartGradients: [
    "bg-gradient-metric-1","bg-gradient-metric-2","bg-gradient-metric-3","bg-gradient-metric-4",
    "bg-gradient-metric-5","bg-gradient-metric-6","bg-gradient-metric-7","bg-gradient-metric-8",
    "bg-gradient-metric-9","bg-gradient-metric-10","bg-gradient-metric-11","bg-gradient-metric-12",
    "bg-gradient-metric-13","bg-gradient-metric-14","bg-gradient-metric-15","bg-gradient-metric-16"
  ],
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
    toggleHargaKonstruksi(state) {
      state.isHargaKonstruksiOpen = !state.isHargaKonstruksiOpen;
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
  toggleHargaKonstruksi, // renamed action
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
