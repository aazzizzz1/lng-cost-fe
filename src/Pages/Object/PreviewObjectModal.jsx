import React from "react";
import PropTypes from "prop-types";
import SensorIcon from "../../Assets/Svg/Object/SensorIcon";
import ConsumerIcon from "../../Assets/Svg/Object/ConsumerIcon";

const PreviewObjectModal = ({ isOpen, onClose, sensor }) => {
  return isOpen ? (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-lg shadow-lg dark:bg-gray-900 w-1/3">
        <div className="flex justify-between mb-4 rounded-t sm:mb-5">
          <div className="text-lg text-gray-900 md:text-xl dark:text-white">
            <h3 className="font-semibold ">{sensor.name}</h3>
            <div className="flex flex-row gap-2">
              <div>
                {(() => {
                  if (sensor.objectType === 'sensor') return <SensorIcon />;
                  if (sensor.objectType === 'consumer') return <ConsumerIcon />;
                  return sensor.objectType;
                })()}
              </div>
              {sensor.objectType}
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
            {sensor.interfaceType && (
              <>
                <span>Interface Type: {sensor.interfaceType}</span>
                <br />
                {sensor.interfaceType === "serial" && (
                  <>
                    {sensor.serialType && (
                      <>
                        <span>Serial Type: {sensor.serialType}</span>
                        <br />
                      </>
                    )}
                    {sensor.baudRate && (
                      <>
                        <span>Baud Rate: {sensor.baudRate}</span>
                        <br />
                      </>
                    )}
                    {sensor.cardId && (
                      <>
                        <span>Card ID: {sensor.cardId}</span>
                        <br />
                      </>
                    )}
                  </>
                )}
                {sensor.interfaceType === "ethernet" && (
                  <>
                    {sensor.protocol && (
                      <>
                        <span>Protocol: {sensor.protocol}</span>
                        <br />
                      </>
                    )}
                    {sensor.clientIp && (
                      <>
                        <span>Client IP: {sensor.clientIp}</span>
                        <br />
                      </>
                    )}
                    {sensor.netmask && (
                      <>
                        <span>Netmask: {sensor.netmask}</span>
                        <br />
                      </>
                    )}
                    {sensor.port && (
                      <>
                        <span>Port: {sensor.port}</span>
                        <br />
                      </>
                    )}
                  </>
                )}
                {sensor.interfaceType === "digital" && (
                  <>
                    {sensor.signalType && (
                      <>
                        <span>Signal Type: {sensor.signalType}</span>
                        <br />
                      </>
                    )}
                    {sensor.digitalType && (
                      <>
                        <span>Digital Type: {sensor.digitalType}</span>
                        <br />
                      </>
                    )}
                    {sensor.cardId && (
                      <>
                        <span>Card ID: {sensor.cardId}</span>
                        <br />
                      </>
                    )}
                  </>
                )}
                {sensor.interfaceType === "analog" && (
                  <>
                    {sensor.cardId && (
                      <>
                        <span>Card ID: {sensor.cardId}</span>
                        <br />
                      </>
                    )}
                  </>
                )}
                {sensor.interfaceType === "pulse" && (
                  <>
                    {sensor.pulseType && (
                      <>
                        <span>Pulse Type: {sensor.pulseType}</span>
                        <br />
                      </>
                    )}
                    {sensor.cardId && (
                      <>
                        <span>Card ID: {sensor.cardId}</span>
                        <br />
                      </>
                    )}
                  </>
                )}
              </>
            )}
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