import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateConsumer, clearAllSensors } from "../../Provider/matrixSlice";
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
  const dispatch = useDispatch();
  const consumers = useSelector((state) => state.matrix.consumers);
  const sensors = useSelector((state) => state.matrix.sensorData);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedConsumer, setSelectedConsumer] = useState(null);
  const [expandedConsumerIds, setExpandedConsumerIds] = useState([]);

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

  const toggleConsumerExpansion = (consumerId) => {
    setExpandedConsumerIds((prevExpandedIds) =>
      prevExpandedIds.includes(consumerId)
        ? prevExpandedIds.filter((id) => id !== consumerId)
        : [...prevExpandedIds, consumerId]
    );
  };

  const handleCreateConsumer = (newConsumer) => {
    dispatch(updateConsumer(newConsumer));
  };

  const handleEditConsumer = (updatedConsumer) => {
    dispatch(updateConsumer(updatedConsumer));
  };

  const handleClearAllSensors = (updatedConsumer) => {
    dispatch(clearAllSensors(updatedConsumer.id));
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
