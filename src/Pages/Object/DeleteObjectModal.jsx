import React from "react";
import PropTypes from "prop-types";

// Modal untuk hapus sensor
const DeleteObjectModal = ({ isOpen, onClose, onDelete, sensor }) => {
  const handleDelete = () => {
    onDelete(sensor.id); // Delete by objectId or any unique identifier
    onClose();
  };

  return isOpen ? (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg">
        <div className="p-6 text-center">
          <svg
            aria-hidden="true"
            className="mx-auto mb-4 text-gray-400 w-14 h-14 dark:text-gray-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mb-5 text-lg font-normal text-gray-900 dark:text-white">
            Are you sure you want to delete this {sensor.name}?
          </h3>
          <button
            data-modal-toggle="delete-modal"
            type="button"
            className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
            onClick={handleDelete}
          >
            Yes, I'm sure
          </button>
          <button
            data-modal-toggle="delete-modal"
            type="button"
            className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
            onClick={onClose}
          >
            No, cancel
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

DeleteObjectModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  sensor: PropTypes.object.isRequired,
};

export default DeleteObjectModal;
