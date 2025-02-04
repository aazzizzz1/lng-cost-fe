import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const api = process.env.REACT_APP_API;

const initialState = {
  objects: [],
  selectedObject: null,
  successMessage: '',
  errorMessage: '',
  shouldfetchObjects: false,
};

export const fetchObjects = createAsyncThunk('objects/fetchObjects', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${api}/objects`);
    console.log(response.data.data)
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
    // Renamed to avoid duplicate naming with async thunks
    addObject: (state, action) => {
      state.objects.push(action.payload);
    },
    updateObjectSync: (state, action) => {
      const index = state.objects.findIndex(object => object.id === action.payload.id);
      if (index !== -1) {
        state.objects[index] = action.payload;
      }
    },
    removeObject: (state, action) => {
      state.objects = state.objects.filter(object => object.id !== action.payload);
    },
    setSelectedObject: (state, action) => {
      state.selectedObject = action.payload;
    },
    clearMessages: (state) => {
      state.successMessage = '';
      state.errorMessage = '';
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchObjects.fulfilled, (state, action) => {
      state.objects = action.payload.map((obj) => {
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
      // state.successMessage = 'Objects fetched successfully';
      state.errorMessage = '';
      state.shouldfetchObjects = false;
    });
    builder.addCase(fetchObjects.rejected, (state, action) => {
      state.errorMessage = 'Error fetching objects';
      state.successMessage = '';
    });
    builder.addCase(createObject.fulfilled, (state, action) => {
      state.objects.push(action.payload);
      state.successMessage = 'Object created successfully';
      state.errorMessage = '';
      state.shouldfetchObjects = true;
    });
    builder.addCase(createObject.rejected, (state, action) => {
      state.errorMessage = 'Error creating object';
      state.successMessage = '';
    });
    builder.addCase(updateObject.fulfilled, (state, action) => {
      const index = state.objects.findIndex(object => object.id === action.payload.id);
      if (index !== -1) {
        state.objects[index] = action.payload;
      }
      state.successMessage = 'Object updated successfully';
      state.errorMessage = '';
      state.shouldfetchObjects = true;
    });
    builder.addCase(updateObject.rejected, (state, action) => {
      state.errorMessage = 'Error updating object';
      state.successMessage = '';
    });
    builder.addCase(deleteObject.fulfilled, (state, action) => {
      state.objects = state.objects.filter(object => object.id !== action.payload);
      state.successMessage = 'Object deleted successfully';
      state.errorMessage = '';
      state.shouldfetchObjects = true;
    });
    builder.addCase(deleteObject.rejected, (state, action) => {
      state.errorMessage = 'Error deleting object';
      state.successMessage = '';
    });
    builder.addCase(deleteMultipleObjects.fulfilled, (state, action) => {
      state.objects = state.objects.filter(object => !action.payload.includes(object.id));
      state.successMessage = 'Objects deleted successfully';
      state.errorMessage = '';
      state.shouldfetchObjects = true;
    });
    builder.addCase(deleteMultipleObjects.rejected, (state, action) => {
      state.errorMessage = 'Error deleting multiple objects';
      state.successMessage = '';
    });
    builder.addCase(fetchObjectById.fulfilled, (state, action) => {
      state.selectedObject = action.payload;
      state.successMessage = 'Object fetched successfully';
      state.errorMessage = '';
    });
    builder.addCase(fetchObjectById.rejected, (state, action) => {
      state.errorMessage = 'Error fetching object by ID';
      state.successMessage = '';
    });
  },
});

export const { addObject, updateObjectSync, removeObject, setSelectedObject, clearMessages } = objectSlice.actions;
export default objectSlice.reducer;
