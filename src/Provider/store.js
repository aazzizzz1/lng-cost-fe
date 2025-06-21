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
import materialReducer from './materialSlice'; // Import material reducer
import constractionCostReducer from './ConstractionCostSlice'; // Import constraction cost reducer
import materialAndPackageReducer from './MaterialAndPackageSlice'; // Import materialAndPackage reducer
import globalReducer from './GlobalSlice'; // Tambahkan ini
import capacityFactorReducer from './CapacityFactorSlice'; // Tambahkan import

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
    material: materialReducer, // Add material reducer
    constractionCost: constractionCostReducer, // Add constraction cost reducer
    materialAndPackage: materialAndPackageReducer, // Add materialAndPackage reducer
    global: globalReducer, // Tambahkan ini
    capacityFactor: capacityFactorReducer, // Tambahkan ini
  },
});
