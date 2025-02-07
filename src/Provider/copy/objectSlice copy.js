import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sensors: [
    {
      id: 1,
      name: "CMS",
      objectId: 2,
      port: 8000,
      communication: 1,
      baudRate: 2,
      updateRate: 4,
      cardId: 1,
      protocol: "TCP/IP",
      ipClient: "192.168.1.1",
      netmask: "255.255.255.0",
      digitalOption: "Positive Pulse",
      interfaceType: "Ethernet",
      serialType: "RS-232",
      signalType: "digital",
    },
    {
      id: 2,
      name: "Temperature Sensor",
      objectId: 1,
      port: 8080,
      communication: 2,
      baudRate: 9600,
      updateRate: 5,
      cardId: 2,
      protocol: "HTTP",
      ipClient: "192.168.1.2",
      netmask: "255.255.255.0",
      digitalOption: "Negative Pulse",
      interfaceType: "Serial",
      serialType: "RS-422",
      signalType: "pulse",
    },
    {
      id: 3,
      name: "Pressure Sensor",
      objectId: 1,
      port: 9000,
      communication: 3,
      baudRate: 115200,
      updateRate: 6,
      cardId: 3,
      protocol: "Modbus",
      ipClient: "192.168.1.3",
      netmask: "255.255.255.0",
      digitalOption: "Positive Pulse",
      interfaceType: "Digital",
      serialType: "RS-485",
      signalType: "digital",
    },
  ],
};

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
  },
});

export const { createSensor, editSensor, deleteSensor } = objectSlice.actions;
export default objectSlice.reducer;