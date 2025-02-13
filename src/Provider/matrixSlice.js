import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const api = process.env.REACT_APP_API;

const initialState = {
  consumers: [],
  sensorData: [],
};

export const fetchMatrix = createAsyncThunk('matrix/fetchMatrix', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${api}/matrix`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching matrix:', error);
    return rejectWithValue(error.response.data);
  }
});

const matrixSlice = createSlice({
  name: 'matrix',
  initialState,
  reducers: {
    setConsumers(state, action) {
      state.consumers = action.payload;
    },
    updateConsumer(state, action) {
      const updatedConsumer = action.payload;
      state.consumers = state.consumers.map(consumer =>
        consumer.id === updatedConsumer.id ? updatedConsumer : consumer
      );
    },
    clearAllSensors(state, action) {
      const consumerId = action.payload;
      state.consumers = state.consumers.map(consumer =>
        consumer.id === consumerId ? { ...consumer, sensors: [] } : consumer
      );
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMatrix.fulfilled, (state, action) => {
      state.consumers = action.payload.map((matrix) => ({
        id: matrix.id,
        name: matrix.name,
        sensors: matrix.sensor.map((sensor) => ({
          id: sensor.id,
          name: sensor.name,
          status: sensor.statusSensor,
        })),
        totalSensor: matrix.totalSensor,
        totalsSensorPending: matrix.totalsSensorPending,
        totalsSensorSuccess: matrix.totalsSensorSuccess,
        totalsSensorFailed: matrix.totalsSensorFailed,
      }));
    });
    builder.addCase(fetchMatrix.rejected, (state, action) => {
      console.error('Error fetching matrix:', action.payload);
    });
  },
});

export const { setConsumers, updateConsumer, clearAllSensors } = matrixSlice.actions;
export default matrixSlice.reducer;