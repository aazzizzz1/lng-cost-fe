import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const api = process.env.REACT_APP_API;

const initialState = {
  sensors: [],
  selectedSensor: null,
};

export const fetchObjects = createAsyncThunk('objects/fetchObjects', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${api}/objects`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching objects:', error);
    return rejectWithValue(error.response.data);
  }
});

export const createObject = createAsyncThunk('objects/createObject', async (newObject, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${api}/objects`, newObject);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating object:', error);
    return rejectWithValue(error.response.data);
  }
});

export const updateObject = createAsyncThunk('objects/updateObject', async ({ id, updatedObject }, { rejectWithValue }) => {
  try {
    const response = await axios.put(`${api}/objects/${id}`, updatedObject);
    return response.data;
  } catch (error) {
    console.error('Error updating object:', error);
    return rejectWithValue(error.response.data);
  }
});

export const deleteObject = createAsyncThunk('objects/deleteObject', async (id, { rejectWithValue }) => {
  try {
    await axios.delete(`${api}/objects/${id}`);
    return id;
  } catch (error) {
    console.error('Error deleting object:', error);
    return rejectWithValue(error.response.data);
  }
});

export const deleteMultipleObjects = createAsyncThunk('objects/deleteMultipleObjects', async (ids, { rejectWithValue }) => {
  try {
    await Promise.all(ids.map(id => axios.delete(`${api}/objects/${id}`)));
    return ids;
  } catch (error) {
    console.error('Error deleting multiple objects:', error);
    return rejectWithValue(error.response.data);
  }
});

export const fetchObjectById = createAsyncThunk('objects/fetchObjectById', async (id, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${api}/objects/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching object by ID:', error);
    return rejectWithValue(error.response.data);
  }
});

const objectSlice = createSlice({
  name: 'objects',
  initialState,
  reducers: {
    createSensor: (state, action) => {
      state.sensors.push(action.payload);
    },
    editSensor: (state, action) => {
      const index = state.sensors.findIndex(sensor => sensor.id === action.payload.id);
      if (index !== -1) {
        state.sensors[index] = action.payload;
      }
    },
    deleteSensor: (state, action) => {
      state.sensors = state.sensors.filter(sensor => sensor.id !== action.payload);
    },
    setSelectedSensor: (state, action) => {
      state.selectedSensor = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchObjects.fulfilled, (state, action) => {
      state.sensors = action.payload.map((obj) => {
        const interfaceData = obj.sensor ? obj.sensor.interface : obj.consumer.interface;
        const interfaceType = interfaceData.interface_type;
        let specificInterfaceData = {};

        switch (interfaceType) {
          case 'serial':
            specificInterfaceData = {
              serialType: interfaceData.serialInterface.type,
              baudRate: interfaceData.serialInterface.baud_rate,
              cardId: interfaceData.serialInterface.card_id,
            };
            break;
          case 'digital':
            specificInterfaceData = {
              signalType: interfaceData.digitalInterface.signal_type,
              cardId: interfaceData.digitalInterface.card_id,
              digitalType: interfaceData.digitalInterface.logic_type || interfaceData.digitalInterface.pulse_type,
            };
            break;
          case 'analog':
            specificInterfaceData = {
              cardId: interfaceData.analogInterface.card_id,
            };
            break;
          case 'ethernet':
            specificInterfaceData = {
              clientIp: interfaceData.ethernetInterface.client_ip,
              netmask: interfaceData.ethernetInterface.netmask,
              port: interfaceData.ethernetInterface.port,
              protocol: interfaceData.ethernetInterface.ethernet_protocol,
            };
            break;
          default:
            break;
        }

        return {
          id: obj.id,
          name: obj.object_name,
          objectType: obj.object_type,
          interfaceType,
          ...specificInterfaceData,
        };
      });
    });
    builder.addCase(createObject.fulfilled, (state, action) => {
      state.sensors.push(action.payload);
    });
    builder.addCase(updateObject.fulfilled, (state, action) => {
      const index = state.sensors.findIndex(sensor => sensor.id === action.payload.id);
      if (index !== -1) {
        state.sensors[index] = action.payload;
      }
    });
    builder.addCase(deleteObject.fulfilled, (state, action) => {
      state.sensors = state.sensors.filter(sensor => sensor.id !== action.payload);
    });
    builder.addCase(deleteMultipleObjects.fulfilled, (state, action) => {
      state.sensors = state.sensors.filter(sensor => !action.payload.includes(sensor.id));
    });
    builder.addCase(fetchObjectById.fulfilled, (state, action) => {
      state.selectedSensor = action.payload;
    });
  },
});

export const { createSensor, editSensor, deleteSensor, setSelectedSensor } = objectSlice.actions;
export default objectSlice.reducer;
