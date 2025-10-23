import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios'; // NEW
import Cookies from 'js-cookie'; // NEW

const initialState = {
  rabData: null, // { namaRab, tahun, inflasi, lokasi, jenis, volume }
  items: [],     // array of item RAB
  // NEW: save states
  saving: false,
  saveResult: null,
};

const getAuthHeaders = () => { // NEW
  const token = Cookies.get('accessToken');
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
};

// NEW: save current RAB as a project
export const saveRabAsProject = createAsyncThunk(
  'rab/saveRabAsProject',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { rab } = getState();
      const rabData = rab?.rabData || {};
      const items = Array.isArray(rab?.items) ? rab.items : [];

      if (!rabData?.namaRab || !rabData?.jenis || !rabData?.lokasi) {
        throw new Error('Lengkapi data RAB terlebih dahulu.');
      }

      const payload = {
        name: rabData.namaRab,
        infrastruktur: rabData.jenis,
        lokasi: rabData.lokasi,
        kategori: 'project-rab',
        tahun: Number(rabData.tahun) || new Date().getFullYear(),
        volume: Number(rabData.volume) || 0,
        inflasi: rabData.inflasi === '' || rabData.inflasi === undefined ? null : Number(rabData.inflasi),
        // optional: satuan can be left empty or derived by backend
        satuan: '',
        constructionCosts: items.map((it) => ({
          workcode: it.workcode || '',
          uraian: it.uraian || '',
          specification: it.specification || '',
          qty: Number(it.qty) || 0,
          satuan: it.satuan || '',
          hargaSatuan: Number(it.hargaSatuan) || 0,
          totalHarga: Number(it.totalHarga ?? (Number(it.qty || 0) * Number(it.hargaSatuan || 0))) || 0,
          aaceClass: Number(it.aaceClass) || 5,
          accuracyLow: Number.isFinite(it.accuracyLow) ? it.accuracyLow : 0,
          accuracyHigh: Number.isFinite(it.accuracyHigh) ? it.accuracyHigh : 0,
          tahun: Number(rabData.tahun) || new Date().getFullYear(),
          infrastruktur: rabData.jenis,
          volume: Number(rabData.volume) || 0,
          satuanVolume: it.satuanVolume || '',
          kelompok: it.kelompok || '',
          kelompokDetail: it.kelompokDetail || '',
          lokasi: rabData.lokasi,
          tipe: it.tipe || '',
        })),
      };

      const res = await axios.post(
        `${process.env.REACT_APP_API}/projects`,
        payload,
        { headers: getAuthHeaders() }
      );
      // CHANGED: return message + data for UI feedback/navigation
      return {
        data: res.data?.data,
        message: res.data?.message || 'Berhasil menyimpan RAB ke Project.',
      };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Gagal menyimpan RAB ke Project.');
    }
  }
);

const rabSlice = createSlice({
  name: 'rab',
  initialState,
  reducers: {
    setRabData: (state, action) => {
      state.rabData = action.payload;
    },
    addRabItem: (state, action) => {
      state.items.push(action.payload);
    },
    setRabItems: (state, action) => {
      state.items = action.payload;
    },
    clearRab: (state) => {
      state.rabData = null;
      state.items = [];
      state.saveResult = null; // NEW
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveRabAsProject.pending, (state) => {
        state.saving = true;
        state.saveResult = null;
      })
      .addCase(saveRabAsProject.fulfilled, (state, action) => {
        state.saving = false;
        state.saveResult = { type: 'success', message: action.payload?.message || 'Berhasil menyimpan RAB ke Project.', data: action.payload?.data };
      })
      .addCase(saveRabAsProject.rejected, (state, action) => {
        state.saving = false;
        state.saveResult = { type: 'error', message: action.payload || 'Gagal menyimpan RAB ke Project.' };
      });
  },
});

export const { setRabData, addRabItem, setRabItems, clearRab } = rabSlice.actions;
export default rabSlice.reducer;
