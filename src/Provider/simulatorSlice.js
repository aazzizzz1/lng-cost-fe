// simulatorSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  temperaturemin: 25,
  temperaturemax: 8,
  humiditymin: 60,
  humiditymax: 8,
  windDirection: "North",
  windVelocitymin: 50,
  windVelocitymax: 10,
  airPressuremin: 999,
  airPressuremax: 103,
  heading: 5,
  headingRate: 20,
  roll: 10,
  pitch: 20,
  angularVelocity: 10,
  speedofShipThroughWaterMin: 20,
  speedofShipThroughWaterMax: 30,
  waterCurrentSpeedMin: 5,
  waterCurrentSpeedMax: 10,
  waterDepth: 2000,
  headingMagneticMin: 10,
  headingMagneticMax: 20,
  headingDeviationMin: 5,
  headingDeviationMax: 10,
  headingVariationMin: 9,
  headingVariationMax: 15,
  latitude: -6.949943,
  longitude: 107.619626,
  waypoints: [{ latitude: -6.950943, longitude: 107.619126 }], // Sample static waypoints
  errors: "",
  errorMessage: "",
  successMessage: "",
  isFormValid: true, // Default form validity is false, ensuring that validation is required
};

const simulatorSlice = createSlice({
  name: "simulator",
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
      const humiditymin = parseFloat(state.humiditymin);
      const humiditymax = parseFloat(state.humiditymax);
      const windVelocitymin = parseFloat(state.windVelocitymin);
      const windVelocitymax = parseFloat(state.windVelocitymax);
      const airPressuremin = parseFloat(state.airPressuremin);
      const airPressuremax = parseFloat(state.airPressuremax);
      const heading = parseFloat(state.heading);
      const headingRate = parseFloat(state.headingRate);
      const roll = parseFloat(state.roll);
      const pitch = parseFloat(state.pitch);
      const angularVelocity = parseFloat(state.angularVelocity);
      const speedofShipThroughWaterMin = parseFloat(
        state.speedofShipThroughWaterMin
      );
      const speedofShipThroughWaterMax = parseFloat(
        state.speedofShipThroughWaterMax
      );
      const waterCurrentSpeedMin = parseFloat(state.waterCurrentSpeedMin);
      const waterCurrentSpeedMax = parseFloat(state.waterCurrentSpeedMax);
      const waterDepth = parseFloat(state.waterDepth);
      const headingMagneticMin = parseFloat(state.headingMagneticMin);
      const headingMagneticMax = parseFloat(state.headingMagneticMax);
      const headingDeviationMin = parseFloat(state.headingDeviationMin);
      const headingDeviationMax = parseFloat(state.headingDeviationMax);
      const headingVariationMin = parseFloat(state.headingVariationMin);
      const headingVariationMax = parseFloat(state.headingVariationMax);

      // Validation for temperature min
      if (
        isNaN(temperatureMin) ||
        isNaN(temperatureMax) ||
        temperatureMin < 0 ||
        temperatureMax > 70
      ) {
        errors.push(
          "Temperature minimum tidak boleh kurang dari 0 derajat dan tidak boleh lebih dari 70 derajat."
        );
      }

      // Validate humidity (must be a percentage)
      if (
        isNaN(humiditymin) ||
        isNaN(humiditymax) ||
        humiditymin < 0 ||
        humiditymax > 100
      ) {
        errors.push("Humidity harus antara 0% dan 100%.");
      }

      // Validate windVelocity (e.g., "10 km/h")
      if (
        isNaN(windVelocitymin) ||
        isNaN(windVelocitymax) ||
        windVelocitymin < 0 ||
        windVelocitymax > 300
      ) {
        errors.push("Kecepatan angin harus antara 0 dan 300 km/h.");
      }

      // Validate airPressure (normal range around sea level is 870 to 1080 hPa)
      if (
        isNaN(airPressuremin) ||
        isNaN(airPressuremax) ||
        airPressuremin < 870 ||
        airPressuremax > 1080
      ) {
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
      if (
        isNaN(angularVelocity) ||
        angularVelocity < 0 ||
        angularVelocity > 50
      ) {
        errors.push("Kecepatan sudut harus antara 0°/s dan 50°/s.");
      }

      // Validate speedofShipThroughWater (reasonable range for a ship)
      if (
        isNaN(speedofShipThroughWaterMin) ||
        isNaN(speedofShipThroughWaterMax) ||
        speedofShipThroughWaterMin < 0 ||
        speedofShipThroughWaterMax > 60
      ) {
        errors.push("Kecepatan kapal harus antara 0 dan 60 km/h.");
      }

      // Validate waterCurrentSpeed (current speed in reasonable limits)
      if (
        isNaN(waterCurrentSpeedMin) ||
        isNaN(waterCurrentSpeedMax) ||
        waterCurrentSpeedMin < 0 ||
        waterCurrentSpeedMax > 20
      ) {
        errors.push("Kecepatan arus air harus antara 0 dan 20 km/h.");
      }

      // Validate waterDepth (depth of the water must be positive)
      if (isNaN(waterDepth) || waterDepth < 0) {
        errors.push("Kedalaman air harus positif.");
      }

      // Validate headingMagnetic (same as heading)
      if (
        isNaN(headingMagneticMin) ||
        headingMagneticMin < 0 ||
        headingMagneticMax >= 360
      ) {
        errors.push("Heading magnetic harus antara 0° dan 360°.");
      }

      // Validate headingDeviation and headingVariation
      if (
        isNaN(headingDeviationMin) ||
        headingDeviationMin < -30 ||
        headingDeviationMax > 30
      ) {
        errors.push("Heading deviation harus antara -30° dan 30°.");
      }
      if (
        isNaN(headingVariationMin) ||
        headingVariationMin < -30 ||
        headingVariationMax > 30
      ) {
        errors.push("Heading variation harus antara -30° dan 30°.");
      }

      // Validate latitude and longitude for the main location
      if (
        isNaN(state.latitude) ||
        state.latitude < -90 ||
        state.latitude > 90
      ) {
        errors.push("Latitude harus antara -90° dan 90°.");
      }
      if (
        isNaN(state.longitude) ||
        state.longitude < -180 ||
        state.longitude > 180
      ) {
        errors.push("Longitude harus antara -180° dan 180°.");
      }

      // Validate waypoints
      state.waypoints.forEach((waypoint, index) => {
        if (
          isNaN(waypoint.latitude) ||
          waypoint.latitude < -90 ||
          waypoint.latitude > 90
        ) {
          errors.push(
            `Waypoint ${index + 1}: Latitude harus antara -90° dan 90°.`
          );
        }
        if (
          isNaN(waypoint.longitude) ||
          waypoint.longitude < -180 ||
          waypoint.longitude > 180
        ) {
          errors.push(
            `Waypoint ${index + 1}: Longitude harus antara -180° dan 180°.`
          );
        }
      });

      // Setting form validity and storing errors
      state.errors = errors.length > 0 ? errors.join(" ") : "";
      state.isFormValid = errors.length === 0; // Only valid if there are no errors
    },

    updateWaypoint: (state, action) => {
      const { index, waypoint } = action.payload;
      state.waypoints = state.waypoints.map((wp, i) =>
        i === index ? waypoint : wp
      );
    },

    // Fungsi untuk submit form
    submitForm: (state) => {
      state.errors = []; // Reset error dulu

      // Kalau tidak ada error, maka set form sebagai valid
      if (state.isFormValid) {
        console.log("Form data ready for submission:", state);
      }
    },

    // Error and success messages
    setError: (state, action) => {
      state.errorMessage = action.payload;
    },
    setSuccess: (state, action) => {
      state.successMessage = action.payload;
    },
    clearMessages: (state) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
  },
});

export const {
  updatePosition,
  addWaypoint,
  updateWaypoint,
  setStaticData,
  updateFormInput,
  validationData,
  submitForm,
  setError,
  setSuccess,
  clearMessages,
} = simulatorSlice.actions;
export default simulatorSlice.reducer;
