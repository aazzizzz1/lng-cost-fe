// simulatorSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  temperaturemin: '25',
  temperaturemax: '70',
  humidity: '60%',
  windDirection: 'North',
  windVelocity: '10 km/h',
  airPressure: '1013 hPa',
  heading: '5°',
  headingRate: '20°/s',
  roll: '10°',
  pitch: '20°',
  angularVelocity: '10°/s',
  speedofShipThroughWater: '20 km/h',
  waterCurrentSpeed: '5 km/h',
  waterDepth: '2000 m',
  headingMagnetic: '10°',
  headingDeviation: '5°',
  headingVariation: '9°',
  latitude: -6.949943,
  longitude: 107.619626,
  waypoints: [
    { latitude: -6.950943, longitude: 107.619126 },
  ], // Sample static waypoints
  errors: "",
};

const simulatorSlice = createSlice({
  name: 'simulator',
  initialState,
  reducers: {
    updatePosition: (state, action) => {
      state.latitude = action.payload.latitude;
      state.longitude = action.payload.longitude;
    },
    addWaypoint: (state, action) => {
      state.waypoints.push({
        latitude: action.payload.latitude,
        longitude: action.payload.longitude,
      });
    },
    validationData: (state) => {
      const errors = [];
      const temperatureMin = parseFloat(state.temperaturemin);
      const temperatureMax = parseFloat(state.temperaturemax);

      // Validasi untuk temperature min
      if (isNaN(temperatureMin) || temperatureMin === '' || temperatureMin > 70) {
        errors.push("Temperature min tidak boleh kosong dan tidak boleh lebih dari 70 derajat.");
      }

      // Validasi untuk temperature max
      if (isNaN(temperatureMax) || temperatureMax === '' || temperatureMax > 70) {
        errors.push("Temperature max tidak boleh kosong dan tidak boleh lebih dari 70 derajat.");
      }

      // Jika ada error, simpan dalam state errors
      state.errors = errors.length > 0 ? errors.join(' ') : "";
    },
    updateWaypoint: (state, action) => {
      const { index, waypoint } = action.payload;
      state.waypoints = state.waypoints.map((wp, i) => 
        i === index ? waypoint : wp
      );
    },
  },
});

export const { updatePosition, addWaypoint, updateWaypoint, setStaticData, validationData } = simulatorSlice.actions;
export default simulatorSlice.reducer;
