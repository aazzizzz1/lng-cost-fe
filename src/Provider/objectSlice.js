import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const api = process.env.REACT_APP_API;

const initialState = {
  sensors: [],
  selectedSensor: null,
};

export const fetchObjects = createAsyncThunk('objects/fetchObjects', async () => {
  const response = await axios.get(`${api}/objects`);
  return response.data.data;
});

export const createObject = createAsyncThunk('objects/createObject', async (newObject) => {
  const response = await axios.post(`${api}/objects`, newObject);
  console.log(response.data);
  return response.data;
});

export const updateObject = createAsyncThunk('objects/updateObject', async ({ id, updatedObject }) => {
  const response = await axios.put(`${api}/objects/${id}`, updatedObject);
  return response.data;
});

export const deleteObject = createAsyncThunk('objects/deleteObject', async (id) => {
  await axios.delete(`${api}/objects/${id}`);
  return id;
});

export const deleteMultipleObjects = createAsyncThunk('objects/deleteMultipleObjects', async (ids) => {
  await Promise.all(ids.map(id => axios.delete(`${api}/objects/${id}`)));
  return ids;
});

export const fetchObjectById = createAsyncThunk('objects/fetchObjectById', async (id) => {
  const response = await axios.get(`${api}/objects/${id}`);
  return response.data;
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
              digitalType: interfaceData.digitalInterface.type,
              cardId: interfaceData.digitalInterface.card_id,
            };
            break;
          case 'analog':
            specificInterfaceData = {
              cardId: interfaceData.analogInterface.card_id,
            };
            break;
          case 'pulse':
            specificInterfaceData = {
              pulseType: interfaceData.pulseInterface.type,
              cardId: interfaceData.pulseInterface.card_id,
            };
            break;
          case 'network':
            specificInterfaceData = {
              clientIp: interfaceData.networkInterface.client_ip,
              netmask: interfaceData.networkInterface.netmask,
              port: interfaceData.networkInterface.port,
              protocol: interfaceData.networkInterface.protocol,
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
