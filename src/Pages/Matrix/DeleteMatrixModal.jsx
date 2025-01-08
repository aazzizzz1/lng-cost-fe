import React from "react";
import PropTypes from "prop-types";

const DeleteMatrixModal = ({ isOpen, onClose, onDelete, consumer }) => {
  const handleDeleteAll = () => {
    const updatedConsumer = {
      ...consumer,
      sensors: [],
    };
    onDelete(updatedConsumer);
    onClose();
  };

  return isOpen ? (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm">
      <section className="bg-white dark:bg-gray-900 rounded-lg shadow-lg min-w-[48rem] max-h-[40rem] overflow-y-auto">
        <div className="p-6">
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Delete All Sensors from {consumer.name}</h2>
          <p className="mb-4 text-gray-900 dark:text-white">
            Are you sure you want to delete all sensors from this consumer?
          </p>
          <div className="gap-2 flex flex-row mt-4">
            <button
              type="button"
              className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-red-700 rounded-lg focus:ring-4 focus:ring-red-200 dark:focus:ring-red-900 hover:bg-red-800"
              onClick={handleDeleteAll}
            >
              Yes, Delete All
            </button>
            <button
              type="button"
              className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </section>
    </div>
  ) : null;
};

DeleteMatrixModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  consumer: PropTypes.object,
};

export default DeleteMatrixModal;