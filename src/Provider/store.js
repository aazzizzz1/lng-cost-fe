import { configureStore } from '@reduxjs/toolkit';
import positionReducer from './positionSlice';
import simulatorReducer from './simulatorSlice';
import selftestReducer from './selftestSlice';
import matrixReducer from './matrixSlice';
import objectReducer from './objectSlice';
import authReducer from './AuthSlice'; // Import auth reducer
import projectReducer from './ProjectSlice'; // Import project reducer
import jasaReducer from './jasaSlice'; // Import jasa reducer
import layoutReducer from './layoutSlice'; // Import layout reducer

export default configureStore({
  reducer: {
    position: positionReducer,
    simulator: simulatorReducer,
    selftest: selftestReducer,
    matrix: matrixReducer,
    objects: objectReducer,
    auth: authReducer,
    projects: projectReducer, // Add project reducer
    jasa: jasaReducer, // Add jasa reducer
    layout: layoutReducer, // Add layout reducer
  },
});
