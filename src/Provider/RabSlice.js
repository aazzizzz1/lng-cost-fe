import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  rabData: null, // { namaRab, tahun, inflasi, lokasi, jenis, volume }
  items: [],     // array of item RAB
};

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
    },
  },
});

export const { setRabData, addRabItem, setRabItems, clearRab } = rabSlice.actions;
export default rabSlice.reducer;
