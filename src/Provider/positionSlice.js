import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    latitude: 0, // Default latitude
    longitude: 0, // Default longitude
    altitude: null, // Default altitude
    error: null,
};

const positionSlice = createSlice({
  name: 'position',
  initialState,
  reducers: {
    updatePosition: (state, action) => {
      state.latitude = action.payload.latitude;
      state.longitude = action.payload.longitude;
      state.altitude = action.payload.altitude;
      state.error = null; // Reset error if position is valid
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { updatePosition, setError } = positionSlice.actions;
export default positionSlice.reducer;
