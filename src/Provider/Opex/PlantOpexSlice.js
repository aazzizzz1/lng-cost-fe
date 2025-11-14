import { createSlice } from "@reduxjs/toolkit";

const onshorePlant35 = {
  plantSummary: {
    capacityMMSCFD: 35,
    gasUsageMMSCFD: 3.92,
    daysPerYear: 350,
    mmBTUPerYear: 12495000,
    capexUSD: 208000000,
    opexUSDPerYear: 16327889.05,
    opexPerMMBTU: 1.31,
    opexPctOfCapex: 8,
  },
  plantBreakdown: [
    { name: "ANNUAL CONSUMABLE", total: 769481.11 },
    { name: "TRANSPORTATION, HOUSING, AND OFFICE", total: 136625.83 },
    { name: "HEALTH & SAFETY", total: 24399.12 },
    { name: "CALIBRATION for Equipment", total: 128567.19 },
    { name: "MAINTENANCE for PIPING and Equipment", total: 4160000.0 },
    { name: "GAS ENGINE OPERATIONAL COST", total: 9991534.02 },
    { name: "DIESEL ENGINE OPERATIONAL COST", total: 152128.74 },
    { name: "WTP OPERATIONAL COST", total: 20685.52 },
    { name: "MANPOWER COST", total: 944467.52 },
  ],
};

const initialState = {
  // single dataset for now; keyed by tab 'overview'
  datasets: { overview: onshorePlant35 },
};

const plantOpexSlice = createSlice({
  name: "plantOpex",
  initialState,
  reducers: {},
});

export const selectPlantDataset = (s) => s.plantOpex?.datasets?.overview || null;

export default plantOpexSlice.reducer;
