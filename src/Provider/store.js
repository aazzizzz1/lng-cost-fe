import { configureStore } from '@reduxjs/toolkit';
import authReducer from './AuthSlice'; // Import auth reducer
import projectReducer from './ProjectSlice'; // Import project reducer
import jasaReducer from './jasaSlice'; // Import jasa reducer
import layoutReducer from './layoutSlice'; // Import layout reducer
import materialReducer from './materialSlice'; // Import material reducer
import constractionCostReducer from './ConstractionCostSlice'; // Import constraction cost reducer
import materialAndPackageReducer from './HargaSatuan/MaterialAndPackageSlice'; // Import materialAndPackage reducer
import globalReducer from './GlobalSlice'; // Tambahkan ini
import capacityFactorReducer from './CapacityFactorSlice'; // Tambahkan import
import administratorReducer from './administratorSlice'; // Tambahkan import
import transportReducer from './HargaSatuan/transportSlice'; // Tambahkan ini
import detailCreateProjectConstructionReducer from './detailCreateProjectConstructionSlice'; // Import detailCreateProjectConstruction reducer

export default configureStore({
  reducer: {
    auth: authReducer,
    projects: projectReducer, // Add project reducer
    jasa: jasaReducer, // Add jasa reducer
    layout: layoutReducer, // Add layout reducer
    material: materialReducer, // Add material reducer
    constractionCost: constractionCostReducer, // Add constraction cost reducer
    materialAndPackage: materialAndPackageReducer, // Add materialAndPackage reducer
    global: globalReducer, // Tambahkan ini
    capacityFactor: capacityFactorReducer, // Tambahkan ini
    administrator: administratorReducer, // Tambahkan ini
    transport: transportReducer, // Tambahkan ini
    detailCreateProjectConstruction: detailCreateProjectConstructionReducer, // Tambahkan ini
  },
});
