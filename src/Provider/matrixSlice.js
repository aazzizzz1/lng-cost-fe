import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const api = process.env.REACT_APP_API;

const initialState = {
  consumers: [],
  sensors: [], // Ensure sensors is initialized as an empty array
  successMessage: '',
  errorMessage: '',
  shouldfetchMatrix: false,
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

export const updateMatrix = createAsyncThunk('matrix/updateMatrix', async ({ consumerId, sensors }, { rejectWithValue }) => {
  try {
    const payload = {
      sensor: sensors.map(sensor => {
        const enable = sensor.sentence_enable || [];
        return {
          sensor_id: sensor.id,
          sentence_enable: enable,
          sentence_disable: defaultSentences.filter(item => !enable.includes(item)),
        };
      }),
    };
    console.log("Sending updateMatrix payload:", payload);
    const response = await axios.put(`${api}/matrix/${consumerId}`, payload);
    return response.data;
  } catch (error) {
    console.error('Error updating matrix:', error);
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
      // Set flag to fetch matrix after clear operation
      state.shouldfetchMatrix = true;
    },
    clearMessages(state) {
      state.successMessage = '';
      state.errorMessage = '';
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
      // state.successMessage = 'Matrix fetched successfully';
      // state.errorMessage = '';
    });
    builder.addCase(fetchMatrix.rejected, (state, action) => {
      state.errorMessage = 'Error fetching matrix';
      state.successMessage = '';
    });
    builder.addCase(fetchSensors.fulfilled, (state, action) => {
      state.sensors = action.payload; // Ensure sensors are set correctly
    });
    builder.addCase(fetchSensors.rejected, (state, action) => {
      console.error('Error fetching sensors:', action.payload);
    });
    builder.addCase(postMatrix.fulfilled, (state, action) => {
      state.successMessage = 'Matrix created successfully';
      state.errorMessage = '';
      state.shouldfetchMatrix = true;
    });
    builder.addCase(postMatrix.rejected, (state, action) => {
      state.errorMessage = 'Error creating matrix';
      state.successMessage = '';
    });
    builder.addCase(resetMatrix.fulfilled, (state) => {
      state.consumers = [];
      state.successMessage = 'Matrix reset successfully';
      state.errorMessage = '';
      state.shouldfetchMatrix = true;
    });
    builder.addCase(resetMatrix.rejected, (state, action) => {
      state.errorMessage = 'Error resetting matrix';
      state.successMessage = '';
    });
    builder.addCase(deleteConsumer.fulfilled, (state, action) => {
      state.consumers = state.consumers.filter(consumer => consumer.id !== action.payload);
      state.successMessage = 'Matrix consumer deleted successfully';
      state.errorMessage = '';
      // Add shouldfetchMatrix flag after deletion
      state.shouldfetchMatrix = true;
    });
    builder.addCase(deleteConsumer.rejected, (state, action) => {
      state.errorMessage = 'Error deleting consumer';
      state.successMessage = '';
    });
    builder.addCase(deleteSensorsFromMatrix.fulfilled, (state, action) => {
      const { consumerId, sensorIds } = action.payload;
      state.consumers = state.consumers.map(consumer =>
        consumer.id === consumerId
          ? { ...consumer, sensors: consumer.sensors.filter(sensor => !sensorIds.includes(sensor.id)) }
          : consumer
      );
      state.successMessage = 'Sensors deleted successfully';
      state.errorMessage = '';
      state.shouldfetchMatrix = true;
    });
    builder.addCase(deleteSensorsFromMatrix.rejected, (state, action) => {
      state.errorMessage = 'Error deleting sensors from matrix';
      state.successMessage = '';
    });
    builder.addCase(updateMatrix.fulfilled, (state, action) => {
      const updatedConsumer = action.payload;
      state.consumers = state.consumers.map(consumer =>
        consumer.id === updatedConsumer.id ? updatedConsumer : consumer
      );
      state.successMessage = 'Matrix updated successfully';
      state.errorMessage = '';
      state.shouldfetchMatrix = true;
    });
    builder.addCase(updateMatrix.rejected, (state, action) => {
      state.errorMessage = 'Error updating matrix';
      state.successMessage = '';
    });
  },
});

export const { setConsumers, updateConsumer, clearAllSensors, clearMessages } = matrixSlice.actions;
export { defaultSentences }; // Correctly export default sentences
export default matrixSlice.reducer;