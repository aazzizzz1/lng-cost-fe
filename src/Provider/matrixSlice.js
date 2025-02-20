import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const api = process.env.REACT_APP_API;

const initialState = {
  consumers: [],
  sensors: [], // Ensure sensors is initialized as an empty array
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

export const fetchSensors = createAsyncThunk('matrix/fetchSensors', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${api}/sensors`);
    return response.data.data; // Ensure the correct data path is returned
  } catch (error) {
    console.error('Error fetching sensors:', error);
    return rejectWithValue(error.response.data);
  }
});

export const postMatrix = createAsyncThunk('matrix/postMatrix', async ({ consumerId, sensors }, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${api}/matrix`, {
      consumer_id: consumerId,
      sensor: sensors.map(sensor => ({
        sensor_id: sensor.id,
        sentence_enable: sensor.sentence_enable,
        sentence_disable: sensor.sentence_disable,
      })),
    });
    return response.data;
  } catch (error) {
    console.error('Error posting matrix:', error);
    return rejectWithValue(error.response.data);
  }
});

export const resetMatrix = createAsyncThunk('matrix/resetMatrix', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.delete(`${api}/matrix`);
    return response.data;
  } catch (error) {
    console.error('Error resetting matrix:', error);
    return rejectWithValue(error.response.data);
  }
});

export const deleteConsumer = createAsyncThunk('matrix/deleteConsumer', async (consumerId, { rejectWithValue }) => {
  try {
    const response = await axios.delete(`${api}/matrix/consumer/${consumerId}`);
    console.log('Consumer deleted:', response.data);
    return consumerId;
  } catch (error) {
    console.error('Error deleting consumer:', error);
    return rejectWithValue(error.response.data);
  }
});

export const deleteSensorsFromMatrix = createAsyncThunk('matrix/deleteSensorsFromMatrix', async ({ consumerId, sensorIds }, { rejectWithValue }) => {
  try {
    const response = await axios.delete(`${api}/matrix/deletesensor/${consumerId}`, {
      data: { sensor_id: sensorIds }
    });
    console.log('Sensors deleted:', response.data);
    return { consumerId, sensorIds };
  } catch (error) {
    console.error('Error deleting sensors from matrix:', error);
    return rejectWithValue(error.response.data);
  }
});

const defaultSentences = ["GGA", "GGL", "RMC", "VTG"]; // Default sentences

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
          sentence_enable: sensor.sentence_enable,
          sentence_disable: sensor.sentence_disable,
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
    builder.addCase(fetchSensors.fulfilled, (state, action) => {
      state.sensors = action.payload; // Ensure sensors are set correctly
    });
    builder.addCase(fetchSensors.rejected, (state, action) => {
      console.error('Error fetching sensors:', action.payload);
    });
    builder.addCase(resetMatrix.fulfilled, (state) => {
      state.consumers = [];
    });
    builder.addCase(resetMatrix.rejected, (state, action) => {
      console.error('Error resetting matrix:', action.payload);
    });
    builder.addCase(deleteConsumer.fulfilled, (state, action) => {
      state.consumers = state.consumers.filter(consumer => consumer.id !== action.payload);
    });
    builder.addCase(deleteConsumer.rejected, (state, action) => {
      console.error('Error deleting consumer:', action.payload);
    });
    builder.addCase(deleteSensorsFromMatrix.fulfilled, (state, action) => {
      const { consumerId, sensorIds } = action.payload;
      state.consumers = state.consumers.map(consumer =>
        consumer.id === consumerId
          ? { ...consumer, sensors: consumer.sensors.filter(sensor => !sensorIds.includes(sensor.id)) }
          : consumer
      );
    });
    builder.addCase(deleteSensorsFromMatrix.rejected, (state, action) => {
      console.error('Error deleting sensors from matrix:', action.payload);
    });
  },
});

export const { setConsumers, updateConsumer, clearAllSensors } = matrixSlice.actions;
export { defaultSentences }; // Correctly export default sentences
export default matrixSlice.reducer;