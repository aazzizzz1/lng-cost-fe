import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

// Modal untuk edit sensor yang sudah ada
const EditObjectModal = ({ isOpen, onClose, onUpdate, sensor }) => {
  const [name, setName] = useState(sensor?.name || "");
  const [objectId, setObjectId] = useState(sensor?.objectId || 1);
  const [interfaceType, setInterfaceType] = useState(
    sensor?.interfaceType || ""
  );
  const [serialType, setSerialType] = useState(sensor?.serialType || "RS-232");
  const [baudRate, setBaudRate] = useState(sensor?.baudRate || 9600);
  const [cardId, setCardId] = useState(sensor?.cardId || 1);
  const [protocol, setProtocol] = useState(sensor?.protocol || "TCP/IP");
  const [ipClient, setIpClient] = useState(sensor?.ipClient || "");
  const [netmask, setNetmask] = useState(sensor?.netmask || "");
  const [port, setPort] = useState(sensor?.port || "");
  const [digitalOption, setDigitalOption] = useState(
    sensor?.digitalOption || ""
  );
  const [signalType, setSignalType] = useState(sensor?.signalType || "digital");

  useEffect(() => {
    if (sensor) {
      setName(sensor.name);
      setObjectId(sensor.objectId);
      setInterfaceType(sensor.interfaceType);
      setSerialType(sensor.serialType);
      setBaudRate(sensor.baudRate);
      setCardId(sensor.cardId);
      setProtocol(sensor.protocol);
      setIpClient(sensor.ipClient);
      setNetmask(sensor.netmask);
      setPort(sensor.port);
      setDigitalOption(sensor.digitalOption);
      setSignalType(sensor.signalType);
    }
  }, [sensor]);

  const handleSubmit = () => {
    const updatedSensor = {
      ...sensor,
      name,
      objectId,
      interfaceType,
      serialType,
      baudRate,
      cardId,
      protocol,
      ipClient,
      netmask,
      port,
      digitalOption,
      signalType,
    };
    onUpdate(updatedSensor);
    onClose();
  };

  return isOpen ? (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm">
      <section className="bg-white dark:bg-gray-900 p-2 rounded-lg shadow-lg min-w-[48rem] max-h-[40rem] overflow-y-auto">
        <div className="p-6">
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
            Edit Object {name}
          </h2>
          <form action="#">
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
              <div>
                <label
                  htmlFor="object-id"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Object Type
                </label>
                <select
                  id="object-id"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  value={objectId}
                  onChange={(e) => setObjectId(Number(e.target.value))}
                >
                  <option value={1}>Data Source</option>
                  <option value={2}>Data Consumer</option>
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
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="interface-type"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Interface
                </label>
                <select
                  id="interface-type"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  value={interfaceType}
                  onChange={(e) => setInterfaceType(e.target.value)}
                >
                  <option value="">Select Interface</option>
                  <option value="Serial">Serial</option>
                  <option value="Ethernet">Ethernet</option>
                  <option value="Digital">Digital</option>
                  <option value="Analog">Analog</option>
                </select>
              </div>

              {interfaceType === "Serial" && (
                <>
                  <div>
                    <label
                      htmlFor="serial-type"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Serial Type
                    </label>
                    <select
                      id="serial-type"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      value={serialType}
                      onChange={(e) => setSerialType(e.target.value)}
                    >
                      <option value="RS-232">RS-232</option>
                      <option value="RS-422">RS-422</option>
                      <option value="RS-485">RS-485</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="baud-rate"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Baud Rate (bps)
                    </label>
                    <select
                      id="baud-rate"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      value={baudRate}
                      onChange={(e) => setBaudRate(Number(e.target.value))}
                    >
                      {[
                        1200, 2400, 4800, 9600, 14400, 19200, 38400, 57600,
                        115200,
                      ].map((rate) => (
                        <option key={rate} value={rate}>
                          {rate}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="card-id"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Card ID
                    </label>
                    <select
                      id="card-id"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      value={cardId}
                      onChange={(e) => setCardId(Number(e.target.value))}
                    >
                      {[1, 2, 3, 4, 5].map((id) => (
                        <option key={id} value={id}>
                          Card ID {id}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {interfaceType === "Ethernet" && (
                <>
                  <div>
                    <label
                      htmlFor="protocol"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Protocol
                    </label>
                    <select
                      id="protocol"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      value={protocol}
                      onChange={(e) => setProtocol(e.target.value)}
                    >
                      <option value="TCP/IP">TCP/IP</option>
                      <option value="UDPU">UDP (unicase)</option>
                      <option value="UDPM">UDP (multicase)</option>
                      <option value="UDPB">UDP (broadcast)</option>
                      <option value="MQTT">MQTT</option>
                    </select>
                  </div>

                  {protocol !== "MQTT" && protocol !== "UDPB" && (
                    <div>
                      <label
                        htmlFor="ip-client"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        IP Client
                      </label>
                      <input
                        type="text"
                        id="ip-client"
                        value={ipClient}
                        onChange={(e) => setIpClient(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder={
                          protocol === "UDPM"
                            ? "Add IP Multicast"
                            : "Add IP Client"
                        }
                      />
                    </div>
                  )}

                  {protocol !== "MQTT" && (
                    <div>
                      <label
                        htmlFor="netmask"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Netmask
                      </label>
                      <input
                        type="text"
                        id="netmask"
                        value={netmask}
                        onChange={(e) => setNetmask(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="Netmask"
                      />
                    </div>
                  )}

                  <div>
                    <label
                      htmlFor="port"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Port
                    </label>
                    <input
                      type="number"
                      id="port"
                      value={port}
                      onChange={(e) => setPort(e.target.value)}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Port"
                    />
                  </div>
                </>
              )}

              {interfaceType === "Digital" && (
                <>
                  <div>
                    <label
                      htmlFor="digital-option"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Signal Type:
                    </label>
                    <select
                      id="digital-option"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      value={signalType}
                      onChange={(e) => setSignalType(e.target.value)}
                    >
                      <option value="digital">Digital</option>
                      <option value="pulse">Pulse</option>
                    </select>
                  </div>
                  {objectId === 1 ? (
                    <>
                      {signalType === "digital" ? (
                        <div>
                          <label
                            htmlFor="digital-option"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Digital Option (Digital)
                          </label>
                          <select
                            id="digital-option"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            value={digitalOption}
                            onChange={(e) => setDigitalOption(e.target.value)}
                          >
                            <option value="High-Z">High-Z</option>
                            <option value="Enable Pull Up">
                              Enable Pull Up
                            </option>
                            <option value="Enable Pull Down">
                              Enable Pull Down
                            </option>
                          </select>
                        </div>
                      ) : (
                        <div>
                          <label
                            htmlFor="digital-option"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Digital Option (Pulse)
                          </label>
                          <select
                            id="digital-option"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            value={digitalOption}
                            onChange={(e) => setDigitalOption(e.target.value)}
                          >
                            <option value="Positive Pulse">
                              Positive Pulse
                            </option>
                            <option value="Negative Pulse">
                              Negative Pulse
                            </option>
                          </select>
                        </div>
                      )}
                      <div>
                        <label
                          htmlFor="card-id"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Card ID:
                        </label>
                        <select
                          id="card-id"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          value={cardId}
                          onChange={(e) => setCardId(Number(e.target.value))}
                        >
                          {[1, 2, 3, 4, 5].map((id) => (
                            <option key={id} value={id}>
                              Card ID {id}
                            </option>
                          ))}
                        </select>
                      </div>
                    </>
                  ) : (
                    <>
                      {signalType === "digital" ? (
                        <div>
                          <label
                            htmlFor="digital-option"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Digital Option (Digital)
                          </label>
                          <select
                            id="digital-option"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            value={digitalOption}
                            onChange={(e) => setDigitalOption(e.target.value)}
                          >
                            <option value="High-Z">High-Z</option>
                            <option value="Enable Pull Up">
                              Enable Pull Up
                            </option>
                            <option value="Enable Pull Down">
                              Enable Pull Down
                            </option>
                          </select>
                        </div>
                      ) : (
                        <div>
                          <label
                            htmlFor="digital-option"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Digital Option (Pulse)
                          </label>
                          <select
                            id="digital-option"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            value={digitalOption}
                            onChange={(e) => setDigitalOption(e.target.value)}
                          >
                            <option value="Positive Pulse">
                              Positive Pulse
                            </option>
                            <option value="Negative Pulse">
                              Negative Pulse
                            </option>
                          </select>
                        </div>
                      )}
                      <div>
                        <label
                          htmlFor="card-id"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Card ID:
                        </label>
                        <select
                          id="card-id"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          value={cardId}
                          onChange={(e) => setCardId(Number(e.target.value))}
                        >
                          {[1, 2, 3, 4, 5].map((id) => (
                            <option key={id} value={id}>
                              Card ID {id}
                            </option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>

            <div className="gap-2 flex flex-row">
              <button
                type="submit"
                onClick={handleSubmit}
                className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
              >
                Edit Object
              </button>
              <button
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

EditObjectModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  sensor: PropTypes.object.isRequired,
};

export default EditObjectModal;
