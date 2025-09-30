import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie'; // Import Cookies to retrieve the token

const getAuthHeaders = () => {
  const token = Cookies.get('accessToken'); // Retrieve the token from cookies
  return { Authorization: `Bearer ${token}` };
};

const initialState = {
  provinces: [],
  inflasi: [],
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
  },
});

export const { setProvinces, setInflasi, updateProvinceCCI, updateInflasi } = administratorSlice.actions;

export const fetchProvinces = () => async (dispatch) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API}/cci`, {
      headers: getAuthHeaders(),
    }); // Use REACT_APP_API for base URL
    const provinces = response.data.data.map((item) => ({
      code: item.kodeProvinsi,
      name: item.provinsi,
      cci: item.cci,
    }));
    dispatch(setProvinces(provinces));
  } catch (error) {
    console.error('Error fetching provinces:', error);
  }
};

export const fetchInflasi = () => async (dispatch) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API}/inflasi`, {
      headers: getAuthHeaders(),
    }); // Replace with actual endpoint
    dispatch(setInflasi(response.data.data));
  } catch (error) {
    console.error('Error fetching inflation data:', error);
  }
};

export default administratorSlice.reducer;
