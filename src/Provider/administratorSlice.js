import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';

const getAuthHeaders = () => {
  const token = Cookies.get('accessToken');
  return { Authorization: `Bearer ${token}` };
};

const initialState = {
  provinces: [],
  inflasi: [],
  selectedProvince: null,
};

const administratorSlice = createSlice({
  name: 'administrator',
  initialState,
  reducers: {
    setProvinces: (state, action) => {
      state.provinces = action.payload;
    },
    setInflasi: (state, action) => {
      state.inflasi = action.payload;
    },
    updateProvinceCCI: (state, action) => {
      const { code, cci } = action.payload;
      const prov = state.provinces.find((p) => p.code === code);
      if (prov) prov.cci = cci;
    },
    updateInflasi: (state, action) => {
      const { year, value } = action.payload;
      const idx = state.inflasi.findIndex((i) => i.year === year);
      if (idx !== -1) {
        state.inflasi[idx].value = value;
      } else {
        state.inflasi.push({ year, value });
      }
    },
    addProvince: (state, action) => {
      state.provinces.push(action.payload);
    },
    patchProvince: (state, action) => {
      const { id, patch } = action.payload;
      const idx = state.provinces.findIndex((p) => p.id === id);
      if (idx !== -1) {
        state.provinces[idx] = { ...state.provinces[idx], ...patch };
      }
    },
    removeProvince: (state, action) => {
      const id = action.payload;
      state.provinces = state.provinces.filter((p) => p.id !== id);
    },
    setSelectedProvince: (state, action) => {
      state.selectedProvince = action.payload;
    },
  },
});

export const {
  setProvinces,
  setInflasi,
  updateProvinceCCI,
  updateInflasi,
  addProvince,
  patchProvince,
  removeProvince,
  setSelectedProvince,
} = administratorSlice.actions;

export const fetchProvinces = () => async (dispatch) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API}/cci`, {
      headers: getAuthHeaders(),
    });
    const provinces = (response.data?.data || []).map((item) => ({
      id: item.id,
      code: item.kodeProvinsi,
      name: item.provinsi,
      cci: item.cci,
      delivery: item.delivery,
    }));
    dispatch(setProvinces(provinces));
  } catch (error) {
    console.error('Error fetching provinces:', error);
  }
};

export const fetchProvinceById = (id) => async (dispatch) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API}/cci/${id}`, {
      headers: getAuthHeaders(),
    });
    const item = response.data?.data;
    if (item) {
      const mapped = {
        id: item.id,
        code: item.kodeProvinsi,
        name: item.provinsi,
        cci: item.cci,
        delivery: item.delivery,
      };
      dispatch(setSelectedProvince(mapped));
    } else {
      dispatch(setSelectedProvince(null));
    }
  } catch (error) {
    console.error('Error fetching province by id:', error);
    dispatch(setSelectedProvince(null));
  }
};

export const createCCI = ({ kodeProvinsi, provinsi, cci, delivery }) => async (dispatch) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API}/cci`,
      { kodeProvinsi, provinsi, cci, delivery },
      { headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' } }
    );
    const item = response.data?.data || response.data;
    if (item) {
      dispatch(
        addProvince({
          id: item.id,
          code: item.kodeProvinsi,
          name: item.provinsi,
          cci: item.cci,
          delivery: item.delivery,
        })
      );
    }
  } catch (error) {
    console.error('Error creating CCI:', error);
  }
};

export const updateCCIById = ({ id, payload }) => async (dispatch) => {
  try {
    const response = await axios.put(
      `${process.env.REACT_APP_API}/cci/${id}`,
      payload,
      { headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' } }
    );
    const item = response.data?.data || response.data;
    const patch = item
      ? {
          code: item.kodeProvinsi,
          name: item.provinsi,
          cci: item.cci,
          delivery: item.delivery,
        }
      : payload;
    dispatch(patchProvince({ id, patch }));
  } catch (error) {
    console.error('Error updating CCI:', error);
  }
};

export const deleteCCIById = (id) => async (dispatch) => {
  try {
    await axios.delete(`${process.env.REACT_APP_API}/cci/${id}`, {
      headers: getAuthHeaders(),
    });
    dispatch(removeProvince(id));
  } catch (error) {
    console.error('Error deleting CCI:', error);
  }
};

export const fetchInflasi = () => async (dispatch) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API}/inflasi`, {
      headers: getAuthHeaders(),
    });
    dispatch(setInflasi(response.data.data));
  } catch (error) {
    console.error('Error fetching inflation data:', error);
  }
};

export default administratorSlice.reducer;
