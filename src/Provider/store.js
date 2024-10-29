import { configureStore } from '@reduxjs/toolkit';
import positionReducer from './positionSlice';
import simulatorReducer from './simulatorSlice';
import selftestReducer from './selftestSlice'; // Import selftestReducer di sini

export default configureStore({
  reducer: {
    position: positionReducer,
    simulator: simulatorReducer,
    selftest: selftestReducer, // Tambahkan reducer selftest di sini
  },
});
