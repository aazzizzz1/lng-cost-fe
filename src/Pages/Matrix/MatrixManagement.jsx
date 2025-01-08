import React, { useState, useEffect } from "react";
import DeepthSensorIcon from "../../Assets/Svg/Layout/DeepthSensorIcon";
import GyroscopeSensorIcon from "../../Assets/Svg/Layout/GyroscopeSensorIcon";
import BarometerSensorIcon from "../../Assets/Svg/Layout/BarometerSensorIcon";
import SpeedSensorIcon from "../../Assets/Svg/Layout/SpeedSensorIcon";
import TemperatureSensorIcon from "../../Assets/Svg/Layout/TemperatureSensorIcon";
import ConsumerIcon from "../../Assets/Svg/Object/ConsumerIcon";
import EditIcon from "../../Assets/Svg/Object/EditIcon";
import DeleteIcon from "../../Assets/Svg/Object/DeleteIcon";
import CreateIcon from "../../Assets/Svg/Object/CreateIcon";
import ChevronDownIcon from "../../Assets/Svg/Matrix/ChevronDownIcon";
import SensorIcon from "../../Assets/Svg/Object/SensorIcon";
import CreateMatrixModal from "./CreateMatrixModal";
import EditMatrixModal from "./EditMatrixModal";
import DeleteMatrixModal from "./DeleteMatrixModal";

const MatrixManagement = () => {
  const [consumers, setConsumers] = useState([
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
  ]);

  const iconMapping = {
    "depth sensor": DeepthSensorIcon,
    gyroscope: GyroscopeSensorIcon,
    barometer: BarometerSensorIcon,
    "speed sensor": SpeedSensorIcon,
    temperature: TemperatureSensorIcon,
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case "pending":
        return "border-yellow-500 bg-yellow-100 dark:bg-yellow-500";
      case "success":
        return "border-green-500 bg-green-100 dark:bg-green-500";
      case "failed":
        return "border-red-500 bg-red-100 dark:bg-red-500";
      default:
        return "border-gray-700 bg-gray-100 dark:bg-gray-500";
    }
  };

  const getIconBgColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-200 dark:bg-yellow-600";
      case "success":
        return "bg-green-200 dark:bg-green-600";
      case "failed":
        return "bg-red-200 dark:bg-red-600";
      default:
        return "bg-gray-200 dark:bg-gray-600";
    }
  };

  const getStatusCountStyles = (status) => {
    switch (status) {
      case "pending":
        return "border-yellow-500 bg-yellow-100 dark:bg-yellow-500";
      case "success":
        return "border-green-500 bg-green-100 dark:bg-green-500";
      case "failed":
        return "border-red-500 bg-red-100 dark:bg-red-500";
      default:
        return "border-gray-700 bg-gray-100 dark:bg-gray-500";
    }
  };

  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedConsumer, setSelectedConsumer] = useState(null);
  const [sensors, setSensors] = useState([]);
  const [expandedConsumerIds, setExpandedConsumerIds] = useState([]);

  const toggleConsumerExpansion = (consumerId) => {
    setExpandedConsumerIds((prevExpandedIds) =>
      prevExpandedIds.includes(consumerId)
        ? prevExpandedIds.filter((id) => id !== consumerId)
        : [...prevExpandedIds, consumerId]
    );
  };

  useEffect(() => {
    // Fetch sensors from ObjectManagementTable or any other source
    const fetchSensors = () => {
      // Dummy data from ObjectManagementTable
      const sensorData = [
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
      ];
      setSensors(sensorData);
    };

    fetchSensors();
  }, []);

  const handleCreateConsumer = (newConsumer) => {
    setConsumers(
      consumers.map((consumer) =>
        consumer.id === newConsumer.id ? newConsumer : consumer
      )
    );
  };

  const handleEditConsumer = (updatedConsumer) => {
    setConsumers(
      consumers.map((consumer) =>
        consumer.id === updatedConsumer.id ? updatedConsumer : consumer
      )
    );
  };

  const handleClearAllSensors = (updatedConsumer) => {
    setConsumers(
      consumers.map((consumer) =>
        consumer.id === updatedConsumer.id ? updatedConsumer : consumer
      )
    );
  };

  const calculateStatusCounts = (sensors) => {
    const statusCounts = { pending: 0, success: 0, failed: 0, total: 0 };
    sensors.forEach((sensor) => {
      statusCounts[sensor.status] += 1;
      statusCounts.total += 1;
    });
    return statusCounts;
  };

  return (
    <div className="grid grid-cols-4 sm:grid-cols-1 grid-flow-row gap-4 dark:text-white dark:bg-darkmode">
      {consumers.map((consumer) => {
        const statusCounts = calculateStatusCounts(consumer.sensors);
        const isExpanded = expandedConsumerIds.includes(consumer.id);
        return (
          <div
            key={consumer.id}
            className="border p-2 rounded shadow dark:bg-gray-800 dark:border-gray-700"
          >
            <div class="flex mb-2">
              <div class="flex-none">
                <ConsumerIcon />
              </div>
              <div class="flex grow justify-center">
                <p className="text-base font-bold text-gray-900 dark:text-white">
                  {consumer.name}
                </p>
              </div>
            </div>
            <div className="flex justify-between mb-2 gap-[2px]">
              <button
                type="button"
                id="createProductButton"
                data-modal-toggle="createProductModal"
                className="px-2 py-1 flex items-center justify-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
                onClick={() => {
                  setSelectedConsumer(consumer);
                  setCreateModalOpen(true);
                }}
              >
                <CreateIcon />
                Add
              </button>
              <button
                type="button"
                data-drawer-target="drawer-update-product"
                data-drawer-show="drawer-update-product"
                aria-controls="drawer-update-product"
                className="px-2 py-1 flex items-center text-sm font-medium text-center text-white bg-primary-700 rounded-lg hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                onClick={() => {
                  setSelectedConsumer(consumer);
                  setEditModalOpen(true);
                }}
              >
                <EditIcon />
                Edit
              </button>
              <button
                type="button"
                data-modal-target="delete-modal"
                data-modal-toggle="delete-modal"
                className="px-1 py-1 flex items-center text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                onClick={() => {
                  setSelectedConsumer(consumer);
                  setDeleteModalOpen(true);
                }}
              >
                <DeleteIcon />
                Clear
              </button>
              <button
                type="button"
                data-drawer-target="drawer-update-product"
                data-drawer-show="drawer-update-product"
                aria-controls="drawer-update-product"
                className="px-2 py-1 flex items-center text-sm font-medium text-center text-white bg-primary-700 rounded-lg hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                onClick={() => {
                  toggleConsumerExpansion(consumer.id);
                }}
              >
                <ChevronDownIcon />
              </button>
            </div>
            {!isExpanded && (
              <div className="flex flex-col">
                <p
                  className={`text-sm text-gray-900 dark:text-white p-1 rounded ${getStatusCountStyles(
                    "total"
                  )}`}
                >
                  Total: {statusCounts.total}
                </p>
                <div className="mt-2 mb-2 grid grid-cols-3 gap-1">
                  <p
                    className={`text-sm text-gray-900 dark:text-white p-1 rounded ${getStatusCountStyles(
                      "pending"
                    )}`}
                  >
                    Pending: {statusCounts.pending}
                  </p>
                  <p
                    className={`text-sm text-gray-900 dark:text-white p-1 rounded ${getStatusCountStyles(
                      "success"
                    )}`}
                  >
                    Success: {statusCounts.success}
                  </p>
                  <p
                    className={`text-sm text-gray-900 dark:text-white p-1 rounded ${getStatusCountStyles(
                      "failed"
                    )}`}
                  >
                    Failed: {statusCounts.failed}
                  </p>
                </div>
              </div>
            )}
            {isExpanded && (
              <ul>
                <div className="grid grid-cols-2 gap-2">
                  {consumer.sensors &&
                    consumer.sensors.map((sensor) => {
                      const IconComponent =
                        iconMapping[sensor.name.toLowerCase()];
                      return (
                        <div
                          key={sensor.id}
                          className={`border p-1 rounded ${getStatusStyles(
                            sensor.status
                          )}`}
                        >
                          <div className="flex items-center space-x-2">
                            <div
                              className={`p-1 rounded ${getIconBgColor(
                                sensor.status
                              )}`}
                            >
                              {IconComponent ? (
                                <IconComponent />
                              ) : (
                                <SensorIcon />
                              )}
                            </div>
                            <p className="text-xs text-gray-900 dark:text-white">
                              {sensor.name}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </ul>
            )}
          </div>
        );
      })}
      <CreateMatrixModal
        isOpen={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreate={handleCreateConsumer}
        sensors={sensors}
        consumer={selectedConsumer}
      />
      <EditMatrixModal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        onUpdate={handleEditConsumer}
        sensors={sensors}
        consumer={selectedConsumer}
      />
      <DeleteMatrixModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onDelete={handleClearAllSensors}
        consumer={selectedConsumer}
      />
    </div>
  );
};

export default MatrixManagement;
