import React, { useState } from "react";
import PropTypes from "prop-types";

// Modal untuk tambah sensor baru
const CreateObjectModal = ({ isOpen, onClose, onCreate }) => {
  const [name, setName] = useState("");
  const [objectId, setObjectId] = useState(1); // Default to sensor
  // const [parameters, setParameters] = useState([
  //   "IP: 3120600087",
  //   "Measurement range: 700m",
  //   "Accuracy: 70%",
  //   "Baud rate: 50",
  //   "Format data: JSON",
  // ]);
  const [port, setPort] = useState("");
  const [communication, setCommunication] = useState(1);
  const [baudRate, setBaudRate] = useState(1);
  const [updateRate, setUpdateRate] = useState(1);

  const handleSubmit = () => {
    const newSensor = {
      id: Date.now(), // Membuat ID unik berdasarkan timestamp
      name,
      consumers: ["Consumer 1"],
      // parameters,
      objectId,
      port,
      communication,
      baudRate,
      updateRate,
    };
    onCreate(newSensor);
    onClose(); // Close modal after submit
  };

  return isOpen ? (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm">
      <section className="bg-white dark:bg-gray-900 rounded-lg shadow-lg min-w-[48rem] max-h-[40rem] overflow-y-auto">
        <div className="p-6">
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
            Add a new object
          </h2>
          <form action="#">
            <div className="grid gap-4 sm:grid-cols-1 sm:gap-6 w-full">
              <div>
                <label
                  htmlFor="object-id"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Object Type:
                </label>
                <select
                  id="object-id"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  value={objectId}
                  onChange={(e) => setObjectId(Number(e.target.value))} // Ubah string menjadi angka
                >
                  <option value={1}>Sensor</option>
                  <option value={2}>Consumer</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Object Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Object Name"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  required=""
                />
              </div>
              <div className="w-full">
                <label
                  htmlFor="brand"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Port
                </label>
                <input
                  type="number"
                  value={port}
                  onChange={(e) => setPort(e.target.value)}
                  name="port"
                  id="port"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Port"
                  required=""
                />
              </div>
              <div className="w-full">
                <label
                  htmlFor="communication"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Communication Type
                </label>
                <select
                  id="communication"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  value={communication}
                  onChange={(e) => setCommunication(Number(e.target.value))} // Ubah string menjadi angka
                >
                  <option value={1}>RS-422</option>
                  <option value={2}>RS-232</option>
                  <option value={3}>Analog</option>
                  <option value={4}>Ethernet</option>
                  <option value={5}>TCP/IP</option>
                  <option value={6}>Serial</option>
                </select>
              </div>
              <div className="w-full">
                <label
                  htmlFor="baud-rate"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Baud Rate
                </label>
                <select
                  id="baud-rate"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  value={baudRate}
                  onChange={(e) => setBaudRate(Number(e.target.value))} // Ubah string menjadi angka
                >
                  <option value={1}>110</option>
                  <option value={2}>300</option>
                  <option value={3}>600</option>
                  <option value={4}>1200</option>
                  <option value={5}>2400</option>
                  <option value={6}>4800</option>
                  <option value={7}>9600</option>
                  <option value={8}>14400</option>
                  <option value={9}>19200</option>
                  <option value={10}>38400</option>
                  <option value={11}>57600</option>
                  <option value={12}>115200</option>
                  <option value={13}>128000</option>
                  <option value={14}>256000</option>
                </select>
              </div>
              <div className="w-full">
                <label
                  htmlFor="update-rate"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Update Rate
                </label>
                <select
                  id="update-rate"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  value={updateRate}
                  onChange={(e) => setUpdateRate(Number(e.target.value))} // Ubah string menjadi angka
                >
                  <option value={1}>1</option>
                  <option value={2}>5</option>
                  <option value={3}>10</option>
                  <option value={4}>50</option>
                  <option value={5}>100</option>
                  <option value={6}>200</option>
                  <option value={7}>500</option>
                  <option value={8}>1000</option>
                </select>
              </div>
              {/* <div className="col-span-2">
                <label
                  htmlFor="description"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  rows={8}
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Your description here"
                  defaultValue={""}
                />
              </div> */}
              {/* <div className="col-span-2">
                {parameters.map((param, index) => (
                  <div key={index} className="mb-2">
                    <input
                      type="text"
                      value={param}
                      onChange={(e) => {
                        const newParams = [...parameters];
                        newParams[index] = e.target.value;
                        setParameters(newParams);
                      }}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Parameter"
                    />
                  </div>
                ))}
              </div> */}
            </div>
            <div className="gap-2 flex flex-row">
              <button
                type="submit"
                onClick={handleSubmit}
                className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
              >
                Add Object
              </button>
              <button
                data-modal-toggle="createProductModal2"
                type="button"
                className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-red-700 rounded-lg focus:ring-4 focus:ring-red-200 dark:focus:ring-red-900 hover:bg-red-800"
                onClick={onClose}
              >
                Discard
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  ) : null;
};

CreateObjectModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
};

export default CreateObjectModal;
