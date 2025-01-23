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
    // ...other consumers
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