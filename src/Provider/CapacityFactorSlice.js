import { createSlice } from "@reduxjs/toolkit";

// Contoh data referensi untuk FSRU (bisa dikembangkan untuk tipe lain)
const initialReferenceData = {
  "Onshore LNG Plant": [
    { capacity: 100000, cost: 50000000 },
    { capacity: 2000000, cost: 80000000 },
    { capacity: 3000000, cost: 120000000 },
    { capacity: 4000000, cost: 150000000 },
    { capacity: 5000000, cost: 180000000 },
  ],
  "Offshore LNG Plant": [
    { capacity: 50000, cost: 30000000 },
    { capacity: 100000, cost: 60000000 },
    { capacity: 150000, cost: 90000000 },
    { capacity: 200000, cost: 120000000 },
    { capacity: 250000, cost: 150000000 },
  ],
  "LNG Carrier": [
    { capacity: 100000, cost: 20000000 },
    { capacity: 150000, cost: 30000000 },
    { capacity: 200000, cost: 40000000 },
    { capacity: 250000, cost: 50000000 },
    { capacity: 300000, cost: 60000000 },
  ],
  "LNG Trucking": [
    { capacity: 1000, cost: 50000 },
    { capacity: 2000, cost: 100000 },
    { capacity: 3000, cost: 150000 },
    { capacity: 4000, cost: 200000 },
    { capacity: 5000, cost: 250000 },
  ],
  ORF: [
    { capacity: 10000, cost: 3000000 },
    { capacity: 20000, cost: 6000000 },
    { capacity: 30000, cost: 9000000 },
    { capacity: 40000, cost: 12000000 },
    { capacity: 50000, cost: 15000000 },
  ],
  OTS: [
    { capacity: 5000, cost: 2000000 },
    { capacity: 10000, cost: 4000000 },
    { capacity: 15000, cost: 6000000 },
    { capacity: 20000, cost: 8000000 },
    { capacity: 25000, cost: 10000000 },
  ],
  ORU: [
    { capacity: 15000, cost: 4000000 },
    { capacity: 30000, cost: 8000000 },
    { capacity: 45000, cost: 12000000 },
    { capacity: 60000, cost: 16000000 },
    { capacity: 75000, cost: 20000000 },
  ],
  "LNG Bunkering Vessel": [
    { capacity: 5000, cost: 495388765654.26 },
    { capacity: 10000, cost: 692210584882.10 },
    { capacity: 15000, cost: 884404454600.00 },
    { capacity: 20000, cost: 1499600000000.00 },
  ],
  "Mini LNG Plant": [
    { capacity: 1, cost: 148396830000.00 },
    { capacity: 3, cost: 185067755000.00 },
    { capacity: 5, cost: 249975577500.00 },
    { capacity: 1, cost: 114995817295.55 },
    { capacity: 3, cost: 262478961993.81 },
    { capacity: 5, cost: 446432946142.28 },
    { capacity: 1, cost: 107952112700.00 },
    { capacity: 3, cost: 181032836700.00 },
    { capacity: 5, cost: 270152336900.00 },
    { capacity: 1, cost: 182282000000.00 },
    { capacity: 3, cost: 293538000000.00 },
    { capacity: 5, cost: 384749000000.00 },
    { capacity: 7, cost: 457074000000.00 },
    { capacity: 20, cost: 1318003000000.00 },
    { capacity: 1, cost: 266577000000.00 },
    { capacity: 3, cost: 429281000000.00 },
    { capacity: 5, cost: 562671000000.00 },
    { capacity: 7, cost: 668442000000.00 },
    { capacity: 20, cost: 1927497000000.00 },
    { capacity: 0.8, cost: 169045000000.00 },
    { capacity: 3.0, cost: 512162000000.00 },
    { capacity: 5.0, cost: 776237000000.00 },
    { capacity: 7.0, cost: 1393220000000.00 },
    { capacity: 20.0, cost: 3846637000000.00 },
    { capacity: 0.79, cost: 215306000000.00 },
    { capacity: 3.16, cost: 618907000000.00 },
    { capacity: 4.75, cost: 1037121000000.00 },
    { capacity: 7.09, cost: 1804904000000.00 },
    { capacity: 20.46, cost: 4953492000000.00 },
  ],
  FSRU: [
    { capacity: 2500, cost: 756955700000.00 },
    { capacity: 10000, cost: 1007095500000.00 },
  ],
  "LNG Carrier (LNGC)": [
    { capacity: 20000, cost: 1409950000000.00 },
  ],
};

const initialState = {
  referenceData: initialReferenceData,
  input: {
    type: "FSRU",
    method: "Linear Regression",
    capacity: "",
  },
  result: null,
};

function linearRegression(data, x) {
  // y = a + bx
  const n = data.length;
  const sumX = data.reduce((acc, d) => acc + d.capacity, 0);
  const sumY = data.reduce((acc, d) => acc + d.cost, 0);
  const sumXY = data.reduce((acc, d) => acc + d.capacity * d.cost, 0);
  const sumX2 = data.reduce((acc, d) => acc + d.capacity * d.capacity, 0);
  const b = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const a = (sumY - b * sumX) / n;
  return a + b * x;
}

function logLogRegression(data, x) {
  // ln(y) = a + b ln(x)
  const n = data.length;
  const sumLnX = data.reduce((acc, d) => acc + Math.log(d.capacity), 0);
  const sumLnY = data.reduce((acc, d) => acc + Math.log(d.cost), 0);
  const sumLnXLnY = data.reduce(
    (acc, d) => acc + Math.log(d.capacity) * Math.log(d.cost),
    0
  );
  const sumLnX2 = data.reduce((acc, d) => acc + Math.log(d.capacity) ** 2, 0);
  const b = (n * sumLnXLnY - sumLnX * sumLnY) / (n * sumLnX2 - sumLnX ** 2);
  const a = (sumLnY - b * sumLnX) / n;
  return Math.exp(a) * x ** b;
}

function capacityFactorMethod(data, x) {
  // y2 = y1 * (x2/x1)^n, n biasanya 0.6-0.7, gunakan 0.65
  if (data.length < 1) return null;
  const n = 0.65;
  // Cari data dengan kapasitas terdekat
  let closest = data[0];
  let minDiff = Math.abs(x - data[0].capacity);
  for (let i = 1; i < data.length; i++) {
    const diff = Math.abs(x - data[i].capacity);
    if (diff < minDiff) {
      closest = data[i];
      minDiff = diff;
    }
  }
  const { capacity: x1, cost: y1 } = closest;
  return y1 * Math.pow(x / x1, n);
}

const CapacityFactorSlice = createSlice({
  name: "capacityFactor",
  initialState,
  reducers: {
    setInput(state, action) {
      state.input = { ...state.input, ...action.payload };
    },
    calculateCost(state) {
      const { type, method, capacity } = state.input;
      const data = state.referenceData[type] || [];
      let result = null;
      const x = Number(capacity);
      if (!x || data.length === 0) {
        state.result = null;
        return;
      }
      // Jika kapasitas persis ada di database, ambil harga langsung
      const found = data.find((d) => d.capacity === x);
      if (found) {
        result = found.cost;
      } else if (method === "Linear Regression" && data.length >= 2) {
        result = linearRegression(data, x);
      } else if (method === "Log-log Regression" && data.length >= 2) {
        result = logLogRegression(data, x);
      } else if (method === "Capacity Factor Method" && data.length >= 1) {
        result = capacityFactorMethod(data, x);
      }
      state.result = result;
    },
  },
});

export const { setInput, calculateCost } = CapacityFactorSlice.actions;
export default CapacityFactorSlice.reducer;
