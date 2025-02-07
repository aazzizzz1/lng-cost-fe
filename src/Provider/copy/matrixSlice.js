import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  consumers: [
    {
      id: 1,
      name: "Navigation Radar 1",
      sensors: [
        {
          id: 1,
          name: "Depth Sensor",
          value: "5790 ms",
          status: "pending",
        },
        {
          id: 2,
          name: "Gyroscope",
          value: "5790 rad/s",
          status: "success",
        },
        {
          id: 3,
          name: "Barometer",
          value: "5790 atm",
          status: "failed",
        },
        {
          id: 4,
          name: "Speed Sensor",
          value: "5790 mil/h",
          status: "pending",
        },
        {
          id: 5,
          name: "Temperature",
          value: "25°C",
          status: "success",
        },
      ],
    },
      {
        id: 2,
        name: "CMS 2",
        sensors: [
          {
            id: 1,
            name: "Depth Sensor",
            value: "1234 ms",
            status: "success",
          },
          {
            id: 2,
            name: "Gyroscope",
            value: "5678 rad/s",
            status: "pending",
          },
        ],
      },
      {
        id: 3,
        name: "ECDIS 3",
        sensors: [
          {
            id: 1,
            name: "Barometer",
            value: "910 atm",
            status: "failed",
          },
          {
            id: 2,
            name: "Speed Sensor",
            value: "112 mil/h",
            status: "success",
          },
        ],
      },
      {
        id: 4,
        name: "Navigation Radar 4",
        sensors: [
          {
            id: 1,
            name: "Depth Sensor",
            value: "5790 ms",
            status: "pending",
          },
          {
            id: 2,
            name: "Gyroscope",
            value: "5790 rad/s",
            status: "success",
          },
          {
            id: 3,
            name: "Barometer",
            value: "5790 atm",
            status: "failed",
          },
          {
            id: 5,
            name: "Temperature",
            value: "25°C",
            status: "success",
          },
        ],
      },
      {
        id: 5,
        name: "CMS 5",
        sensors: [
          {
            id: 1,
            name: "Depth Sensor",
            value: "5790 ms",
            status: "pending",
          },
          {
            id: 2,
            name: "Gyroscope",
            value: "5790 rad/s",
            status: "success",
          },
          {
            id: 3,
            name: "Barometer",
            value: "5790 atm",
            status: "failed",
          },
          {
            id: 4,
            name: "Speed Sensor",
            value: "5790 mil/h",
            status: "pending",
          },
          {
            id: 5,
            name: "Temperature",
            value: "25°C",
            status: "success",
          },
        ],
      },
      {
        id: 6,
        name: "ECDIS 6",
        sensors: [
          {
            id: 3,
            name: "Barometer",
            value: "5790 atm",
            status: "failed",
          },
          {
            id: 4,
            name: "Speed Sensor",
            value: "5790 mil/h",
            status: "pending",
          },
          {
            id: 5,
            name: "Temperature",
            value: "25°C",
            status: "success",
          },
        ],
      },
      {
        id: 7,
        name: "Navigation Radar 7",
        sensors: [
          {
            id: 1,
            name: "Depth Sensor",
            value: "5790 ms",
            status: "pending",
          },
          {
            id: 2,
            name: "Gyroscope",
            value: "5790 rad/s",
            status: "success",
          },
          {
            id: 3,
            name: "Barometer",
            value: "5790 atm",
            status: "failed",
          },
        ],
      },
  ],
  sensorData: [
    {
      id: 1,
      name: "Depth Sensor",
      value: "5790 ms",
      status: "pending",
      sentences: [
        { id: 1, name: "Depth", value: "5790 ms", status: "pending" },
        { id: 2, name: "Altitude", value: "5790 m", status: "success" },
        { id: 3, name: "Pressure", value: "5790 atm", status: "failed" },
        { id: 4, name: "Distance", value: "5790 m", status: "pending" },
      ],
    },
    {
      id: 2,
      name: "Gyroscope",
      value: "5790 rad/s",
      status: "success",
      sentences: [
        {
          id: 1,
          name: "Angular Velocity",
          value: "5790 rad/s",
          status: "success",
        },
        { id: 2, name: "Orientation", value: "45°", status: "pending" },
      ],
    },
    {
      id: 3,
      name: "Barometer",
      value: "5790 atm",
      status: "failed",
      sentences: [
        { id: 1, name: "Pressure", value: "5790 atm", status: "failed" },
        { id: 2, name: "Altitude", value: "1000 m", status: "pending" },
      ],
    },
    {
      id: 4,
      name: "Speed Sensor",
      value: "5790 mil/h",
      status: "pending",
      sentences: [
        { id: 1, name: "Speed", value: "5790 mil/h", status: "pending" },
        {
          id: 2,
          name: "Acceleration",
          value: "10 m/s²",
          status: "success",
        },
      ],
    },
    {
      id: 5,
      name: "Temperature",
      value: "25°C",
      status: "success",
      sentences: [
        { id: 1, name: "Temperature", value: "25°C", status: "success" },
        { id: 2, name: "Humidity", value: "60%", status: "pending" },
      ],
    },
    {
      id: 6,
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
      status: "pending",
      sentences: [
        {
          id: 1,
          name: "Connection Status",
          value: "Connected",
          status: "pending",
        },
        { id: 2, name: "Data Rate", value: "100 Mbps", status: "success" },
      ],
    },
    {
      id: 7,
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
      status: "success",
      sentences: [
        { id: 1, name: "Temperature", value: "25°C", status: "success" },
        { id: 2, name: "Humidity", value: "60%", status: "pending" },
      ],
    },
    {
      id: 8,
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
      status: "failed",
      sentences: [
        { id: 1, name: "Pressure", value: "5790 atm", status: "failed" },
        { id: 2, name: "Altitude", value: "1000 m", status: "pending" },
      ],
    },
    {
      id: 9,
      name: "Ais",
      objectId: 2,
      port: 10000,
      communication: 4,
      baudRate: 230400,
      updateRate: 7,
      cardId: 4,
      protocol: "UDP",
      ipClient: "192.168.1.1",
      netmask: "8.8.8.8",
      digitalOption: "Negative Pulse",
      interfaceType: "Analog",
      serialType: "RS-232",
      status: "pending",
      sentences: [
        { id: 1, name: "VDM", value: "5790 ms", status: "pending" },
        { id: 2, name: "VDO", value: "5790 m", status: "success" },
        { id: 3, name: "DSC", value: "5790 atm", status: "failed" },
        { id: 4, name: "RMC", value: "5790 m", status: "pending" },
      ],
    },
  ],
};

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
});

export const { setConsumers, updateConsumer, clearAllSensors } = matrixSlice.actions;

export default matrixSlice.reducer;

// Thunk for fetching consumers from an API (commented out for now)
// export const fetchConsumers = () => async dispatch => {
//   const response = await fetch('/api/consumers');
//   const data = await response.json();
//   dispatch(setConsumers(data));
// };