import React, { useEffect, useState } from "react";
// import { Button, Dropdown } from 'flowbite-react';
import PropTypes from "prop-types";
import SensorIcon from "../../Assets/Svg/Object/SensorIcon";
import ConsumerIcon from "../../Assets/Svg/Object/ConsumerIcon";
// import VerticalDropDownIcon from '../../Assets/Svg/Sensor/VerticalDropDownIcon';
// import SettingIcon from '../../Assets/Svg/Sensor/SettingIcon';
import CreateObjectModal from "./CreateObjectModal";
import EditObjectModal from "./EditObjectModal";
import DeleteObjectModal from "./DeleteObjectModal";
import PreviewObjectModal from "./PreviewObjectModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal"; // Import komponen konfirmasi
import CreateIcon from "../../Assets/Svg/Object/CreateIcon";
import DeleteIcon from "../../Assets/Svg/Object/DeleteIcon";
import PreviewIcon from "../../Assets/Svg/Object/PreviewIcon";
import EditIcon from "../../Assets/Svg/Object/EditIcon";

// Sample sensor data
const sensorData = [
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
  },
];
// Sensor Management Table Component
const ObjectManagementTable = ({ sensors }) => {
  // const handleConfigureSensor = (sensorId) => {
  //   console.log(Configuring sensor with ID: ${sensorId});
  //   // Add configuration logic here
  // };

  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isPreviewModalOpen, setPreviewModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false); // State for the delete confirmation modal
  const [selectedSensor, setSelectedSensor] = useState(null);
  const [sensorList, setSensorList] = useState(sensors);

  const handleCreateSensor = (newSensor) => {
    setSensorList([...sensorList, newSensor]);
  };

  const handleEditSensor = (updatedSensor) => {
    setSensorList(
      sensorList.map((sensor) =>
        sensor.id === updatedSensor.id ? updatedSensor : sensor
      )
    );
  };

  const handleDeleteSensor = (sensorId) => {
    setSensorList(sensorList.filter((sensor) => sensor.id !== sensorId));
  };

  const [isAllSelected, setIsAllSelected] = useState(false);
  const [selectedSensors, setSelectedSensors] = useState([]);

  // Fungsi untuk menangani perubahan checkbox
  const handleCheckboxChange = (sensorId) => {
    setSelectedSensors((prevSelected) => {
      if (prevSelected.includes(sensorId)) {
        return prevSelected.filter((id) => id !== sensorId); // Hapus dari seleksi
      } else {
        return [...prevSelected, sensorId]; // Tambahkan ke seleksi
      }
    });
  };

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedSensors([]); // Jika sudah dipilih semua, batalkan semua pilihan
    } else {
      setSelectedSensors(sensorList.map((sensor) => sensor.id)); // Pilih semua
    }
    setIsAllSelected(!isAllSelected); // Ubah status "select all"
  };

  // Fungsi untuk menghapus sensor yang dicentang
  // const handleDeleteSelected = () => {
  //   setSensorList((prevSensors) =>
  //     prevSensors.filter((sensor) => !selectedSensors.includes(sensor.id))
  //   );
  //   setSelectedSensors([]); // Reset selected setelah delete
  // };

  const handleDeleteConfirmation = () => {
    if (selectedSensors.length === 0) {
      alert("Please select at least one sensor to delete.");
      return;
    }
    setSensorList((prevSensors) =>
      prevSensors.filter((sensor) => !selectedSensors.includes(sensor.id))
    );
    setDeleteConfirmationOpen(false);
    setSelectedSensors([]);
  };

  const [toggleStates, setToggleStates] = useState({});

  const handleToggleChange = (sensorId) => {
    setToggleStates((prevStates) => ({
      ...prevStates,
      [sensorId]: !prevStates[sensorId],
    }));
  };

  useEffect(() => {
    const initialToggleStates = sensors.reduce((acc, sensor) => {
      acc[sensor.id] = false;
      return acc;
    }, {});
    setToggleStates(initialToggleStates);
  }, [sensors]);

  useEffect(() => {
    if (selectedSensors.length === sensorList.length) {
      setIsAllSelected(true); // Semua dipilih
    } else {
      setIsAllSelected(false); // Tidak semua dipilih
    }
  }, [selectedSensors, sensorList.length]);

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto">
        <div className="bg-white dark:bg-gray-800 relative shadow-md rounded-lg overflow-hidden">
          <div className="flex flex-col md:flex-row items-stretch md:items-center md:space-x-3 space-y-3 md:space-y-0 justify-between mx-4 py-4 border-t dark:border-gray-700">
            <div className="w-full md:w-1/2 flex flex-row gap-2">
              <button
                type="button"
                id="createProductButton"
                data-modal-toggle="createProductModal"
                className="flex items-center justify-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
                onClick={() => setCreateModalOpen(true)}
              >
                <CreateIcon />
                Add Object
              </button>
              {selectedSensors.length > 0 && (
                <button
                  type="button"
                  data-modal-target="delete-modal"
                  data-modal-toggle="delete-modal"
                  className="flex items-center text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-2 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                  onClick={() => setDeleteConfirmationOpen(true)} // Open the confirmation modal
                >
                  <DeleteIcon />
                  Delete Selected
                </button>
              )}
            </div>
            {/* <div className="w-full md:w-1/2 flex flex-row gap-2 justify-end">
              <button
                type="button"
                id="createProductButton"
                data-modal-toggle="createProductModal"
                className="flex items-center justify-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
                onClick={() => setCreateModalOpen(true)}
              >
                <CreateIcon />
                Add NDDU
              </button>
            </div> */}
          </div>
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="p-4">
                    <div className="flex items-center">
                      <input
                        id="checkbox-all"
                        type="checkbox"
                        className="w-4 h-4 text-primary-600 bg-gray-100 rounded border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        checked={isAllSelected} // Status checkbox "select all"
                        onChange={handleSelectAll} // Fungsi untuk mengatur pilih semua
                      />
                      <label htmlFor="checkbox-all" className="sr-only">
                        checkbox
                      </label>
                    </div>
                  </th>
                  {/* <th scope="col" className="px-4 py-3">No</th> */}
                  <th scope="col" className="px-4 py-3">
                    Sensor name
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Object
                  </th>
                  {/* <th scope="col" className="px-4 py-3">
                    Consumer sensor
                  </th> */}
                  <th scope="col" className="px-4 py-3">
                    Parameter
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Setting
                  </th>
                </tr>
              </thead>
              <tbody>
                {sensorList.map((sensor) => (
                  <tr key={sensor.id} className="border-b dark:border-gray-700">
                    {/* <th scope="row" className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">{index + 1}</th> */}
                    <td className="p-4 w-4">
                      <div className="flex items-center">
                        <input
                          id="checkbox-table-search-1"
                          type="checkbox"
                          onclick="event.stopPropagation()"
                          className="w-4 h-4 text-primary-600 bg-gray-100 rounded border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          checked={selectedSensors.includes(sensor.id)}
                          onChange={() => handleCheckboxChange(sensor.id)}
                        />
                        <label
                          htmlFor="checkbox-table-search-1"
                          className="sr-only"
                        >
                          checkbox
                        </label>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {sensor.name}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      <div className="flex flex-row gap-2">
                        <div>
                          {(() => {
                            if (sensor.objectId === 1) return <SensorIcon />;
                            if (sensor.objectId === 2) return <ConsumerIcon />;
                            return sensor.objectId;
                          })()}
                        </div>
                        {sensorObjectType(sensor.objectId)}
                      </div>
                    </td>
                    {/* <td className="px-4 py-3">
                      {sensor.consumers.map((consumer, consumerIndex) => (
                        <span
                          key={consumerIndex}
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-1 ${getConsumerClass(
                            consumer
                          )}`}
                        >
                          {consumer}
                        </span>
                      ))}
                    </td> */}
                    <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      <div className="flex flex-wrap gap-1">
                        {sensor.interfaceType && (
                          <>
                            <span>Interface Type: {sensor.interfaceType}</span>
                            {sensor.interfaceType === "Serial" && (
                              <>
                                {sensor.serialType && (
                                  <span>Serial Type: {sensor.serialType}</span>
                                )}
                                {sensor.baudRate && (
                                  <span>Baud Rate: {sensor.baudRate}</span>
                                )}
                                {sensor.cardId && (
                                  <span>Card ID: {sensor.cardId}</span>
                                )}
                              </>
                            )}
                            {sensor.interfaceType === "Ethernet" && (
                              <>
                                {sensor.protocol && (
                                  <span>Protocol: {sensor.protocol}</span>
                                )}
                                {sensor.ipClient && (
                                  <span>IP Client: {sensor.ipClient}</span>
                                )}
                                {sensor.netmask && (
                                  <span>Netmask: {sensor.netmask}</span>
                                )}
                                {sensor.port && (
                                  <span>Port: {sensor.port}</span>
                                )}
                              </>
                            )}
                            {sensor.interfaceType === "Digital" && (
                              <>
                                {sensor.digitalOption && (
                                  <span>
                                    Digital Option: {sensor.digitalOption}
                                  </span>
                                )}
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      <div className="flex items-center space-x-4">
                        <button
                          type="button"
                          data-drawer-target="drawer-update-product"
                          data-drawer-show="drawer-update-product"
                          aria-controls="drawer-update-product"
                          className="py-2 px-3 flex items-center text-sm font-medium text-center text-white bg-primary-700 rounded-lg hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                          onClick={() => {
                            setSelectedSensor(sensor);
                            setEditModalOpen(true);
                          }}
                        >
                          <EditIcon />
                          Edit
                        </button>
                        <button
                          type="button"
                          data-drawer-target="drawer-read-product-advanced"
                          data-drawer-show="drawer-read-product-advanced"
                          aria-controls="drawer-read-product-advanced"
                          className="py-2 px-3 flex items-center text-sm font-medium text-center text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                          onClick={() => {
                            setSelectedSensor(sensor);
                            setPreviewModalOpen(true);
                          }}
                        >
                          <PreviewIcon />
                          Preview
                        </button>
                        <button
                          type="button"
                          data-modal-target="delete-modal"
                          data-modal-toggle="delete-modal"
                          className="flex items-center text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-2 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                          onClick={() => {
                            setSelectedSensor(sensor);
                            setDeleteModalOpen(true);
                          }}
                        >
                          <DeleteIcon />
                          Delete
                        </button>
                        <label className="inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={toggleStates[sensor.id] || false}
                            onChange={() => handleToggleChange(sensor.id)}
                          />
                          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600" />
                          <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                            {toggleStates[sensor.id] ? "Enabled" : "Disabled"}
                          </span>
                        </label>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Modals */}
        <CreateObjectModal
          isOpen={isCreateModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onCreate={handleCreateSensor}
        />
        <EditObjectModal
          isOpen={isEditModalOpen}
          onClose={() => setEditModalOpen(false)}
          onUpdate={handleEditSensor}
          sensor={selectedSensor}
        />
        <DeleteObjectModal
          isOpen={isDeleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onDelete={handleDeleteSensor}
          sensor={selectedSensor}
        />
        <PreviewObjectModal
          isOpen={isPreviewModalOpen}
          onClose={() => setPreviewModalOpen(false)}
          sensor={selectedSensor}
        />
        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={isDeleteConfirmationOpen}
          onClose={() => setDeleteConfirmationOpen(false)}
          onConfirm={handleDeleteConfirmation}
          selectedCount={selectedSensors.length}
        />
      </div>
    </section>
  );
};

// Helper functions for dynamic class assignment
// const getConsumerClass = (consumer) => {
//   switch (consumer) {
//     case "Consumer 1":
// Helper function to get sensor object type
const sensorObjectType = (objectId) => {
  if (objectId === 1) return "source";
  if (objectId === 2) return "consumer";
  return objectId;
};

// Helper functions for dynamic class assignment
//     case "Consumer 2":
//       return "bg-green-100 text-green-800";
//     case "Consumer 3":
//       return "bg-yellow-100 text-yellow-800";
//     case "Consumer 4":
//       return "bg-red-100 text-red-800";
//     default:
// Helper functions for dynamic class assignment

// const getCommunicationType = (communication) => {
//   switch (communication) {
//     case 1:
//       return "RS-422";
//     case 2:
//       return "RS-232";
//     case 3:
//       return "Analog";
//     case 4:
//       return "Ethernet";
//     case 5:
//       return "TCP/IP";
//     case 6:
//       return "Serial";
//     default:
//       return communication;
//   }
// };

//   }
// };

// const getParameterClass = (parameter) => {
//   if (parameter.toLowerCase().includes("ip"))
//     return "bg-green-100 text-green-800";
//   if (parameter.toLowerCase().includes("range"))
//     return "bg-yellow-100 text-yellow-800";
//   if (parameter.toLowerCase().includes("accuracy"))
//     return "bg-red-100 text-red-800";
//   if (parameter.toLowerCase().includes("baud"))
//     return "bg-blue-100 text-blue-800";
//   if (parameter.toLowerCase().includes("format"))
//     return "bg-purple-100 text-purple-800";
//   return "bg-gray-100 text-gray-800";
// };

// PropTypes validation
ObjectManagementTable.propTypes = {
  sensors: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      consumers: PropTypes.arrayOf(PropTypes.string).isRequired,
      parameters: PropTypes.arrayOf(PropTypes.string).isRequired,
      objectId: PropTypes.string.isRequired,
      port: PropTypes.number.isRequired,
      communication: PropTypes.number.isRequired,
      baudRate: PropTypes.number.isRequired,
    })
  ).isRequired,
};

// Default props
ObjectManagementTable.defaultProps = {
  sensors: sensorData,
};

export default ObjectManagementTable;
