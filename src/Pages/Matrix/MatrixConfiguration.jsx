import React from "react";
import DeepthSensorIcon from "../../Assets/Svg/Layout/DeepthSensorIcon";
import GyroscopeSensorIcon from "../../Assets/Svg/Layout/GyroscopeSensorIcon";
import BarometerSensorIcon from "../../Assets/Svg/Layout/BarometerSensorIcon";
import SpeedSensorIcon from "../../Assets/Svg/Layout/SpeedSensorIcon";
import TemperatureSensorIcon from "../../Assets/Svg/Layout/TemperatureSensorIcon";
import ConsumerIcon from "../../Assets/Svg/Object/ConsumerIcon";
import EditIcon from "../../Assets/Svg/Object/EditIcon";
import DeleteIcon from "../../Assets/Svg/Object/DeleteIcon";

const MatrixConfiguration = () => {
  const iconMapping = {
    "depth sensor": DeepthSensorIcon,
    gyroscope: GyroscopeSensorIcon,
    barometer: BarometerSensorIcon,
    "speed sensor": SpeedSensorIcon,
    temperature: TemperatureSensorIcon,
  };

  // Data dummy statis untuk sensor
  const sensors = [
    {
      id: 1,
      name: "Depth Sensor",
      value: "5790 ms",
    },
    {
      id: 2,
      name: "Gyroscope",
      value: "5790 rad/s",
    },
    {
      id: 3,
      name: "Barometer",
      value: "5790 atm",
    },
    {
      id: 4,
      name: "Speed Sensor",
      value: "5790 mil/h",
    },
    {
      id: 5,
      name: "Temperature",
      value: "25°C",
    },
    {
      id: 6,
      name: "Temperature",
      value: "25°C",
    },
    {
      id: 7,
      name: "Temperature",
      value: "25°C",
    },
    {
      id: 8,
      name: "Temperature",
      value: "25°C",
    },
    {
      id: 9,
      name: "Temperature",
      value: "25°C",
    },
    {
      id: 10,
      name: "Temperature",
      value: "25°C",
    },
    {
      id: 11,
      name: "Temperature",
      value: "25°C",
    },
    {
      id: 12,
      name: "Temperature",
      value: "25°C",
    },
    {
        id: 13,
        name: "Temperature",
        value: "25°C",
    },
  ];

  // Data dummy statis untuk consumer
  const consumers = [
    { id: 1, name: "Consumer 1" },
    { id: 2, name: "Consumer 2" },
    { id: 3, name: "Consumer 3" },
    { id: 4, name: "Consumer 4" },
    { id: 5, name: "Consumer 5" },
    { id: 6, name: "Consumer 6" },
    { id: 7, name: "Consumer 7" },
    { id: 8, name: "Consumer 8" },
    { id: 9, name: "Consumer 9" },
    { id: 10, name: "Consumer 10" },
    { id: 11, name: "Consumer 11" },
    { id: 12, name: "Consumer 12" },
    { id: 13, name: "Consumer 13" },
  ];

  return (
    <section className="flex flex-col">
      <div className="overflow-x-auto custom-scrollbar mb-4">
        {/* Consumer */}
        <div className="flex space-x-1">
          {consumers.map((consumer) => (
            <div
              key={consumer.id}
              className="max-h-56 w-64 flex flex-col justify-center items-center rounded border-[1px] bg-white dark:bg-gray-800 p-3"
            >
              <div className="flex flex-row mb-2 items-center space-x-2">
                <ConsumerIcon />
                <p className="text-base font-bold text-gray-900 dark:text-white">
                  {consumer.name}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  data-drawer-target="drawer-update-product"
                  data-drawer-show="drawer-update-product"
                  aria-controls="drawer-update-product"
                  className="py-2 px-3 flex items-center text-sm font-medium text-center text-white bg-primary-700 rounded-lg hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  onClick={() => {
                    // setSelectedSensor(sensor);
                    // setEditModalOpen(true);
                  }}
                >
                  <EditIcon />
                  Edit
                </button>
                <button
                  type="button"
                  data-modal-target="delete-modal"
                  data-modal-toggle="delete-modal"
                  className="flex items-center text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-2 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                  onClick={() => {
                    // setSelectedSensor(sensor);
                    // setDeleteModalOpen(true);
                  }}
                >
                  <DeleteIcon />
                  Delete
                </button>
              </div>
              <div className="grid grid-cols-2">
                {Object.keys(iconMapping).map((key) => {
                  const IconComponent = iconMapping[key];
                  return (
                    <div key={key} className="flex items-center space-x-2">
                      <IconComponent />
                      <p className="text-sm text-gray-900 dark:text-white">{key}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="overflow-x-auto custom-scrollbar">
        {/* Tambahkan elemen sensor lainnya di sini */}
        <div className="grid grid-flow-col grid-rows-2 gap-1">
          {sensors.map((sensor) => {
            const IconComponent = iconMapping[sensor.name.toLowerCase()];
            return (
              <div
                key={sensor.id}
                className="flex-none h-[82px] w-52 rounded border-[1px] bg-white dark:bg-gray-800 p-3"
              >
                <div className="flex flex-col justify-start items-start">
                  <div className="flex items-center space-x-2">
                    {IconComponent ? <IconComponent /> : "icon tidak ada"}
                    <p className="text-base text-gray-900 dark:text-white">
                      {sensor.name}
                    </p>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {sensor.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default MatrixConfiguration;
