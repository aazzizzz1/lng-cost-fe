import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { updateObject } from "../../Provider/objectSlice";

// Modal untuk edit sensor yang sudah ada
const EditObjectModal = ({ isOpen, onClose, object }) => {
  const dispatch = useDispatch();
  const [name, setName] = useState(object?.name || "");
  const [objectType, setObjectType] = useState(object?.objectType || "sensor");
  const [interfaceType, setInterfaceType] = useState(
    object?.interfaceType || ""
  );
  const [serialType, setSerialType] = useState(object?.serialType || "RS-232");
  const [baudRate, setBaudRate] = useState(object?.baudRate || 9600);
  const [cardId, setCardId] = useState(object?.cardId || 1);
  const [protocol, setProtocol] = useState(object?.protocol || "TCP");
  const [clientIp, setClientIp] = useState(object?.clientIp || "");
  const [netmask, setNetmask] = useState(object?.netmask || "");
  const [port, setPort] = useState(object?.port || "");
  const [digitalType, setDigitalType] = useState(object?.digitalType || "");
  const [signalType, setSignalType] = useState(object?.signalType || "");
  const [pulseType, setPulseType] = useState(object?.pulseType || "");

  useEffect(() => {
    if (object) {
      setName(object.name);
      setObjectType(object.objectType);
      setInterfaceType(object.interfaceType);
      setSerialType(object.serialType);
      setBaudRate(object.baudRate);
      setCardId(object.cardId);
      setProtocol(object.protocol);
      setClientIp(object.clientIp);
      setNetmask(object.netmask);
      setPort(object.port);
      setDigitalType(object.digitalType);
      setSignalType(object.signalType);
      setPulseType(object.pulseType);
    }
  }, [object]);

  const handleSubmit = () => {
    const updatedObject = {
      objectName: name,
      objectType,
      interfaceType,
      cardID: cardId,
      updateRate: 1, // Assuming updateRate is 1
      serialType,
      baudrate: baudRate,
      ipClient: clientIp,
      netmask,
      port,
      ethernetProtocol: protocol,
      signalType,
      digitalType,
      pulseType,
    };

    dispatch(updateObject({ id: object.id, updatedObject }));
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
                  htmlFor="object-type"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Object Type
                </label>
                <select
                  id="object-type"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  value={objectType}
                  onChange={(e) => setObjectType(e.target.value)}
                >
                  <option value="sensor">Sensor</option>
                  <option value="consumer">Consumer</option>
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
                  <option value="serial">Serial</option>
                  <option value="ethernet">Ethernet</option>
                  <option value="digital">Digital</option>
                  <option value="analog">Analog</option>
                </select>
              </div>

              {interfaceType === "serial" && (
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

              {interfaceType === "ethernet" && (
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
                        htmlFor="client-ip"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Client IP
                      </label>
                      <input
                        type="text"
                        id="client-ip"
                        value={clientIp}
                        onChange={(e) => setClientIp(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="Client IP"
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

              {interfaceType === "digital" && (
                <>
                  <div>
                    <label
                      htmlFor="signal-type"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Signal Type
                    </label>
                    <select
                      id="signal-type"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      value={signalType}
                      onChange={(e) => setSignalType(e.target.value)}
                    >
                      <option value="digital">Digital</option>
                      <option value="pulse">Pulse</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="digital-type"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Digital Type
                    </label>
                    <select
                      id="digital-type"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      value={digitalType}
                      onChange={(e) => setDigitalType(e.target.value)}
                    >
                      {signalType === "digital" ? (
                        <>
                          <option value="high-z">High Z</option>
                          <option value="enable-pull-up">Enable Pull Up</option>
                          <option value="enable-pull-down">
                            Enable Pull Down
                          </option>
                        </>
                      ) : (
                        <>
                          <option value="positive-pulse">
                            Positive Pulse
                          </option>
                          <option value="negative-pulse">
                            Negative Pulse
                          </option>
                        </>
                      )}
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
  object: PropTypes.object.isRequired,
};

export default EditObjectModal;
