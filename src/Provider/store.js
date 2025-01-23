import { configureStore } from '@reduxjs/toolkit';
import positionReducer from './positionSlice';
import simulatorReducer from './simulatorSlice';
import selftestReducer from './selftestSlice';
import matrixReducer from './matrixSlice'; // Import matrixReducer

export default configureStore({
  reducer: {
    position: positionReducer,
    simulator: simulatorReducer,
    selftest: selftestReducer,
    matrix: matrixReducer, // Add matrix reducer
  },
});
