// simulatorSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  temperaturemin: '25',
  temperaturemax: 80,
  humidity: '60%',
  windDirection: 'North',
  windVelocity: '500',
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
  isFormValid: true, // To check if form is valid before submission
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
    // Update form input values
    updateFormInput: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
    },

    validationData: (state) => {
      const errors = [];
      const temperatureMin = parseFloat(state.temperaturemin);
      const temperatureMax = parseFloat(state.temperaturemax);
      const humidity = parseFloat(state.humidity);
      const windVelocity = parseFloat(state.windVelocity);
      const airPressure = parseFloat(state.airPressure);
      const heading = parseFloat(state.heading);
      const headingRate = parseFloat(state.headingRate);
      const roll = parseFloat(state.roll);
      const pitch = parseFloat(state.pitch);
      const angularVelocity = parseFloat(state.angularVelocity);
      const speedofShipThroughWater = parseFloat(state.speedofShipThroughWater);
      const waterCurrentSpeed = parseFloat(state.waterCurrentSpeed);
      const waterDepth = parseFloat(state.waterDepth);
      const headingMagnetic = parseFloat(state.headingMagnetic);
      const headingDeviation = parseFloat(state.headingDeviation);
      const headingVariation = parseFloat(state.headingVariation);

      // Validation for temperature min
      if (isNaN(temperatureMin) || temperatureMin > 70) {
        errors.push("Temperature minimum tidak boleh lebih dari 70 derajat.");
      }

      // Validation for temperature max
      if (isNaN(temperatureMax) || temperatureMax > 70) {
        errors.push("Temperature maksimum tidak boleh lebih dari 70 derajat.");
      }

      // Validate humidity (must be a percentage)
      if (isNaN(humidity) || humidity < 0 || humidity > 100) {
        errors.push("Humidity harus antara 0% dan 100%.");
      }

      // Validate windVelocity (e.g., "10 km/h")
      if (isNaN(windVelocity) || windVelocity < 0 || windVelocity > 300) {
        errors.push("Kecepatan angin harus antara 0 dan 300 km/h.");
      }

      // Validate airPressure (normal range around sea level is 870 to 1080 hPa)
      if (isNaN(airPressure) || airPressure < 870 || airPressure > 1080) {
        errors.push("Tekanan udara harus antara 870 dan 1080 hPa.");
      }

      // Validate heading (should be between 0° and 360°)
      if (isNaN(heading) || heading < 0 || heading >= 360) {
        errors.push("Heading harus antara 0° dan 360°.");
      }

      // Validate headingRate (rate of turn should be reasonable)
      if (isNaN(headingRate) || headingRate < 0 || headingRate > 100) {
        errors.push("Heading rate harus antara 0°/s dan 100°/s.");
      }

      // Validate roll and pitch (typical roll and pitch values are between -90° and 90°)
      if (isNaN(roll) || roll < -90 || roll > 90) {
        errors.push("Roll harus antara -90° dan 90°.");
      }
      if (isNaN(pitch) || pitch < -90 || pitch > 90) {
        errors.push("Pitch harus antara -90° dan 90°.");
      }

      // Validate angularVelocity (reasonable range)
      if (isNaN(angularVelocity) || angularVelocity < 0 || angularVelocity > 50) {
        errors.push("Kecepatan sudut harus antara 0°/s dan 50°/s.");
      }

      // Validate speedofShipThroughWater (reasonable range for a ship)
      if (isNaN(speedofShipThroughWater) || speedofShipThroughWater < 0 || speedofShipThroughWater > 60) {
        errors.push("Kecepatan kapal harus antara 0 dan 60 km/h.");
      }

      // Validate waterCurrentSpeed (current speed in reasonable limits)
      if (isNaN(waterCurrentSpeed) || waterCurrentSpeed < 0 || waterCurrentSpeed > 20) {
        errors.push("Kecepatan arus air harus antara 0 dan 20 km/h.");
      }

      // Validate waterDepth (depth of the water must be positive)
      if (isNaN(waterDepth) || waterDepth < 0) {
        errors.push("Kedalaman air harus positif.");
      }

      // Validate headingMagnetic (same as heading)
      if (isNaN(headingMagnetic) || headingMagnetic < 0 || headingMagnetic >= 360) {
        errors.push("Heading magnetic harus antara 0° dan 360°.");
      }

      // Validate headingDeviation and headingVariation
      if (isNaN(headingDeviation) || headingDeviation < -30 || headingDeviation > 30) {
        errors.push("Heading deviation harus antara -30° dan 30°.");
      }
      if (isNaN(headingVariation) || headingVariation < -30 || headingVariation > 30) {
        errors.push("Heading variation harus antara -30° dan 30°.");
      }

      // Validate latitude and longitude for the main location
      if (isNaN(state.latitude) || state.latitude < -90 || state.latitude > 90) {
        errors.push("Latitude harus antara -90° dan 90°.");
      }
      if (isNaN(state.longitude) || state.longitude < -180 || state.longitude > 180) {
        errors.push("Longitude harus antara -180° dan 180°.");
      }

      // Validate waypoints
      state.waypoints.forEach((waypoint, index) => {
        if (isNaN(waypoint.latitude) || waypoint.latitude < -90 || waypoint.latitude > 90) {
          errors.push(`Waypoint ${index + 1}: Latitude harus antara -90° dan 90°.`);
        }
        if (isNaN(waypoint.longitude) || waypoint.longitude < -180 || waypoint.longitude > 180) {
          errors.push(`Waypoint ${index + 1}: Longitude harus antara -180° dan 180°.`);
        }
      });

      // Setting form validity and storing errors
      state.errors = errors.length > 0 ? errors.join(' ') : "";
      state.isFormValid = errors.length === 0;
    },

    updateWaypoint: (state, action) => {
      const { index, waypoint } = action.payload;
      state.waypoints = state.waypoints.map((wp, i) => 
        i === index ? waypoint : wp
      );
    },
  },
});

export const { updatePosition, addWaypoint, updateWaypoint, setStaticData, updateFormInput, validationData } = simulatorSlice.actions;
export default simulatorSlice.reducer;