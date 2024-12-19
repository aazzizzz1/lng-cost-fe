import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cpu: 70,
  cpuMax: 100,
  ram: 30,
  ramMax: 100,
  storage: 40,
  storageMax: 100,
  redudant: 1,
  redudantMax: 100,
  indicator: "active",
  lcd: "normal",
  led: "normal",
  touchscreen: "normal",
  serial_interface: "connected",
  analog_interface: "disconnected",
  digital_gpio: "testok",
  psuData: [
    { id: 1, voltage1: 30, current1: 10},
    // Add more data as needed
  ],
  // Example data for the Interface Module and PSU (you can replace this with real data)
  interfaceModuleData: [
    { id: 1, cpu: 25, ram: 56, storage: 366, canBus: 'Disconnected', serialInterface: 'disconnected', analogInterface: 'connected', digitalGpio: 'testok' },
    { id: 2, cpu: 56, ram: 78, storage: 512, canBus: 'connected', serialInterface: 'connected', analogInterface: 'connected', digitalGpio: 'testok' },
    { id: 3, cpu: 40, ram: 200, storage: 768, canBus: 'disconnected', serialInterface: 'connected', analogInterface: 'disconnected', digitalGpio: 'testnotok' },
    { id: 4, cpu: 60, ram: 300, storage: 1024, canBus: 'connected', serialInterface: 'disconnected', analogInterface: 'connected', digitalGpio: 'testok' },
    { id: 5, cpu: 70, ram: 400, storage: 1280, canBus: 'connected', serialInterface: 'connected', analogInterface: 'disconnected', digitalGpio: 'testnotok' },
    { id: 6, cpu: 80, ram: 500, storage: 1536, canBus: 'connected', serialInterface: 'connected', analogInterface: 'connected', digitalGpio: 'testok' },
    // Add more data as needed
  ],
};

const selftestSlice = createSlice({
  name: "selftest",
  initialState,
  reducers: {
    updateCpu: (state, action) => {
      state.cpu = action.payload;
    },
    updateRam: (state, action) => {
      state.ram = action.payload;
    },
    updateStorage: (state, action) => {
      state.storage = action.payload;
    },
    updateRedudant: (state, action) => {
      state.redudant = action.payload;
    },
  },
});

export const { updateCpu, updateRam, updateStorage, updateRedudant } =
  selftestSlice.actions;
export default selftestSlice.reducer;
