import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  provinces: [
    { code: '11', name: 'Provinsi Aceh', cci: 96.61 },
    { code: '12', name: 'Provinsi Sumatera Utara', cci: 97.45 },
    { code: '13', name: 'Provinsi Sumatera Barat', cci: 93.06 },
    { code: '14', name: 'Provinsi Riau', cci: 96.10 },
    { code: '15', name: 'Provinsi Jambi', cci: 95.32 },
    { code: '16', name: 'Provinsi Sumatera Selatan', cci: 90.62 },
    { code: '17', name: 'Provinsi Bengkulu', cci: 94.20 },
    { code: '18', name: 'Provinsi Lampung', cci: 89.12 },
    { code: '19', name: 'Provinsi Kepulauan Bangka Belitung', cci: 105.37 },
    { code: '21', name: 'Provinsi Kepulauan Riau', cci: 111.94 },
    { code: '31', name: 'Provinsi Dki Jakarta', cci: 114.79 },
    { code: '32', name: 'Provinsi Jawa Barat', cci: 105.30 },
    { code: '33', name: 'Provinsi Jawa Tengah', cci: 102.08 },
    { code: '34', name: 'Provinsi Di Yogyakarta', cci: 104.88 },
    { code: '35', name: 'Provinsi Jawa Timur', cci: 96.29 },
    { code: '36', name: 'Provinsi Banten', cci: 94.18 },
    { code: '51', name: 'Provinsi Bali', cci: 107.46 },
    { code: '52', name: 'Provinsi Nusa Tenggara Barat', cci: 104.09 },
    { code: '53', name: 'Provinsi Nusa Tenggara Timur', cci: 92.42 },
    { code: '61', name: 'Provinsi Kalimantan Barat', cci: 107.34 },
    { code: '62', name: 'Provinsi Kalimantan Tengah', cci: 106.56 },
    { code: '63', name: 'Provinsi Kalimantan Selatan', cci: 100.70 },
    { code: '64', name: 'Provinsi Kalimantan Timur', cci: 118.30 },
    { code: '65', name: 'Provinsi Kalimantan Utara', cci: 107.52 },
    { code: '71', name: 'Provinsi Sulawesi Utara', cci: 100.77 },
    { code: '72', name: 'Provinsi Sulawesi Tengah', cci: 91.82 },
    { code: '73', name: 'Provinsi Sulawesi Selatan', cci: 95.91 },
    { code: '74', name: 'Provinsi Sulawesi Tenggara', cci: 94.71 },
    { code: '75', name: 'Provinsi Gorontalo', cci: 96.51 },
    { code: '76', name: 'Provinsi Sulawesi Barat', cci: 91.63 },
    { code: '81', name: 'Provinsi Maluku', cci: 106.52 },
    { code: '82', name: 'Provinsi Maluku Utara', cci: 114.09 },
    { code: '91', name: 'Provinsi Papua Barat', cci: 124.71 },
    { code: '92', name: 'Provinsi Papua Barat Daya', cci: 122.21 },
    { code: '94', name: 'Provinsi Papua', cci: 134.96 },
    { code: '95', name: 'Provinsi Papua Selatan', cci: 142.98 },
    { code: '96', name: 'Provinsi Papua Tengah', cci: 209.28 },
    { code: '97', name: 'Provinsi Papua Pegunungan', cci: 249.12 },
  ],
  inflasi: [
    { year: new Date().getFullYear(), value: 5.0 } // Default value for current year
  ]
};

const administratorSlice = createSlice({
  name: 'administrator',
  initialState,
  reducers: {
    updateProvinceCCI: (state, action) => {
      const { code, cci } = action.payload;
      const prov = state.provinces.find(p => p.code === code);
      if (prov) prov.cci = cci;
    },
    updateInflasi: (state, action) => {
      const { year, value } = action.payload;
      const idx = state.inflasi.findIndex(i => i.year === year);
      if (idx !== -1) {
        state.inflasi[idx].value = value;
      } else {
        state.inflasi.push({ year, value });
      }
    }
  }
});

export const { updateProvinceCCI, updateInflasi } = administratorSlice.actions;
export default administratorSlice.reducer;
