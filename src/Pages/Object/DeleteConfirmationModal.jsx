import React from "react";

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, selectedCount }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center"
      role="dialog"
      aria-labelledby="modal-title"
    >
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg max-w-md">
        <h3
          className="text-lg font-semibold text-gray-800 dark:text-gray-200"
          id="modal-title"
        >
          {selectedCount > 0
            ? "Are you sure you want to delete all selected objects?"
            : "Please select at least one object to delete."}
        </h3>
        <div className="mt-4 flex justify-end space-x-4">
          <button
            type="button"
            className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-white bg-gray-700 rounded-lg focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-900 hover:bg-gray-800"
            onClick={onClose}
          >
            Cancel
          </button>
          {selectedCount > 0 && (
            <button
              onClick={onConfirm}
              className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-white bg-red-700 rounded-lg focus:ring-4 focus:ring-red-200 dark:focus:ring-red-900 hover:bg-red-800"
            >
              Confirm
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
