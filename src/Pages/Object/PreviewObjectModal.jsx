import React from "react";
import PropTypes from "prop-types";
import SensorIcon from "../../Assets/Svg/Object/SensorIcon";
import ConsumerIcon from "../../Assets/Svg/Object/ConsumerIcon";

const PreviewObjectModal = ({ isOpen, onClose, sensor }) => {
  return isOpen ? (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-lg shadow-lg dark:bg-gray-900 w-1/3">
        <div className="flex justify-between mb-4 rounded-t sm:mb-5">
          <div className="text-lg text-gray-900 md:text-xl dark:text-white">
            <h3 className="font-semibold ">{sensor.name}</h3>
            <div className="flex flex-row gap-2">
              <div>
                {(() => {
                  if (sensor.objectId === 1) return <SensorIcon />;
                  if (sensor.objectId === 2) return <ConsumerIcon />;
                  return sensor.objectId;
                })()}
              </div>
              {(() => {
                if (sensor.objectId === 1) return "sensor";
                if (sensor.objectId === 2) return "consumer";
                return sensor.objectId;
              })()}
            </div>
          </div>
          <div>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 inline-flex dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-toggle="readProductModal"
              onClick={onClose}
            >
              <svg
                aria-hidden="true"
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
        </div>
        <dl>
          <dt className="mb-2 font-semibold leading-none text-gray-900 dark:text-white">
            Details
          </dt>
          <dd className="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">
            {/* {sensor.parameters.map((param, index) => (
            <li key={index}>{param}</li>
          ))} */}
            <span>
              Port: {sensor.port}
              <br />
              Communication:{" "}
              {(() => {
                switch (sensor.communication) {
                  case 1:
                    return "RS-422";
                  case 2:
                    return "RS-232";
                  case 3:
                    return "Analog";
                  case 4:
                    return "Ethernet";
                  case 5:
                    return "TCP/IP";
                  case 6:
                    return "Serial";
                  default:
                    return sensor.communication;
                }
              })()}
              <br />
              Baud rate: {""}
              {(() => {
                switch (sensor.baudRate) {
                  case 1:
                    return "110";
                  case 2:
                    return "300";
                  case 3:
                    return "600";
                  case 4:
                    return "1200";
                  case 5:
                    return "2400";
                  case 6:
                    return "4800";
                  case 7:
                    return "9600";
                  case 8:
                    return "14400";
                  case 9:
                    return "19200";
                  case 10:
                    return "38400";
                  case 11:
                    return "57600";
                  case 12:
                    return "115200";
                  case 13:
                    return "128000";
                  case 14:
                    return "256000";
                  default:
                    return sensor.baudRate;
                }
              })()}
              <br />
              Update rate: {""}
              {(() => {
                switch (sensor.updateRate) {
                  case 1:
                    return "1";
                  case 2:
                    return "5";
                  case 3:
                    return "10";
                  case 4:
                    return "50";
                  case 5:
                    return "100";
                  case 6:
                    return "200";
                  case 7:
                    return "500";
                  case 8:
                    return "1000";
                  default:
                    return sensor.updateRate;
                }
              })()}
            </span>
          </dd>
        </dl>
      </div>
    </div>
  ) : null;
};

PreviewObjectModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  sensor: PropTypes.object.isRequired,
};

export default PreviewObjectModal;
