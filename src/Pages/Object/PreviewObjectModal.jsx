import React from "react";
import PropTypes from "prop-types";
import SensorIcon from "../../Assets/Svg/Object/SensorIcon";
import ConsumerIcon from "../../Assets/Svg/Object/ConsumerIcon";

const PreviewObjectModal = ({ isOpen, onClose, object }) => {
  return isOpen ? (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-lg shadow-lg dark:bg-gray-900 w-1/3">
        <div className="flex justify-between mb-4 rounded-t sm:mb-5">
          <div className="text-lg text-gray-900 md:text-xl dark:text-white">
            <h3 className="font-semibold ">{object.name}</h3>
            <div className="flex flex-row gap-2">
              <div>
                {(() => {
                  if (object.objectType === 'sensor') return <SensorIcon />;
                  if (object.objectType === 'consumer') return <ConsumerIcon />;
                  return object.objectType;
                })()}
              </div>
              {object.objectType}
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
            {object.interfaceType && (
              <>
                <span>Interface Type: {object.interfaceType}</span>
                <br />
                {object.interfaceType === "serial" && (
                  <>
                    {object.serialType && (
                      <>
                        <span>Serial Type: {object.serialType}</span>
                        <br />
                      </>
                    )}
                    {object.baudRate && (
                      <>
                        <span>Baud Rate: {object.baudRate}</span>
                        <br />
                      </>
                    )}
                    {object.cardId && (
                      <>
                        <span>Card ID: {object.cardId}</span>
                        <br />
                      </>
                    )}
                  </>
                )}
                {object.interfaceType === "ethernet" && (
                  <>
                    {object.protocol && (
                      <>
                        <span>Protocol: {object.protocol}</span>
                        <br />
                      </>
                    )}
                    {object.clientIp && (
                      <>
                        <span>Client IP: {object.clientIp}</span>
                        <br />
                      </>
                    )}
                    {object.netmask && (
                      <>
                        <span>Netmask: {object.netmask}</span>
                        <br />
                      </>
                    )}
                    {object.port && (
                      <>
                        <span>Port: {object.port}</span>
                        <br />
                      </>
                    )}
                  </>
                )}
                {object.interfaceType === "digital" && (
                  <>
                    {object.signalType && (
                      <>
                        <span>Signal Type: {object.signalType}</span>
                        <br />
                      </>
                    )}
                    {object.digitalType && (
                      <>
                        <span>Digital Type: {object.digitalType}</span>
                        <br />
                      </>
                    )}
                    {object.cardId && (
                      <>
                        <span>Card ID: {object.cardId}</span>
                        <br />
                      </>
                    )}
                  </>
                )}
                {object.interfaceType === "analog" && (
                  <>
                    {object.cardId && (
                      <>
                        <span>Card ID: {object.cardId}</span>
                        <br />
                      </>
                    )}
                  </>
                )}
                {object.interfaceType === "pulse" && (
                  <>
                    {object.pulseType && (
                      <>
                        <span>Pulse Type: {object.pulseType}</span>
                        <br />
                      </>
                    )}
                    {object.cardId && (
                      <>
                        <span>Card ID: {object.cardId}</span>
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
  object: PropTypes.object.isRequired,
};

export default PreviewObjectModal;