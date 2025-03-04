import { configureStore } from '@reduxjs/toolkit';
import positionReducer from './positionSlice';
import simulatorReducer from './simulatorSlice';
import selftestReducer from './selftestSlice';
import matrixReducer from './matrixSlice';
import objectReducer from './objectSlice';
import authReducer from './AuthSlice'; // Import auth reducer

export default configureStore({
  reducer: {
    position: positionReducer,
    simulator: simulatorReducer,
    selftest: selftestReducer,
    matrix: matrixReducer,
    objects: objectReducer,
    auth: authReducer, // Add auth reducer
  },
});
