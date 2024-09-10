import { configureStore } from '@reduxjs/toolkit';
import positionReducer from './positionSlice';
import simulatorReducer from './simulatorSlice';

export default configureStore({
  reducer: {
    position: positionReducer,
    simulator: simulatorReducer,
  },
});
