import { configureStore } from '@reduxjs/toolkit';
import authReducer from './AuthSlice'; // Import auth reducer
import projectReducer from './Project/ProjectSlice'; // Corrected path
import layoutReducer from './layoutSlice'; // Import layout reducer
import constractionCostReducer from './ConstructionCost/ConstractionCostSlice'; // Corrected path
import globalReducer from './GlobalSlice'; // Tambahkan ini
import capacityFactorReducer from './CapacityFactorSlice'; // Tambahkan import
import administratorReducer from './administratorSlice'; // Tambahkan import
import detailCreateProjectConstructionReducer from './Project/detailCreateProjectConstructionSlice'; // Corrected path
import rabReducer from './RabSlice'; // Tambahkan import RabSlice
import unitPriceReducer from './HargaSatuan/unitPriceSlice'; // Tambahkan import unitPriceSlice
import dashboardReducer from './dashboardSlice'; // Tambahkan import dashboardSlice
import opexReducer from './Opex/OpexSlice'; // NEW: Opex slice
import libraryPreviewReducer from './Library/PreviewSlice'; // NEW
import plantOpexReducer from './Opex/PlantOpexSlice'; // NEW: Onshore LNG Plant OPEX

export default configureStore({
  reducer: {
    auth: authReducer,
    projects: projectReducer, // Add project reducer
    layout: layoutReducer, // Add layout reducer
    constractionCost: constractionCostReducer, // Add constraction cost reducer
    global: globalReducer, // Tambahkan ini
    capacityFactor: capacityFactorReducer, // Tambahkan ini
    administrator: administratorReducer, // Tambahkan ini
    detailCreateProjectConstruction: detailCreateProjectConstructionReducer, // Tambahkan ini
    rab: rabReducer, // Tambahkan reducer rab di sini
    unitPrice: unitPriceReducer, // Tambahkan ini
    dashboard: dashboardReducer, // Tambahkan ini
    opex: opexReducer, // NEW: Opex
    libraryPreview: libraryPreviewReducer, // NEW
    plantOpex: plantOpexReducer, // NEW
  },
});
