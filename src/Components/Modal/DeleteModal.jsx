import React, { useEffect, useRef } from 'react';

// Reusable Delete / Confirm Modal
const DeleteModal = ({
  isOpen,
  title = "Confirm Deletion",
  message = "Are you sure you want to delete this data? This action cannot be undone.",
  confirmText = "Yes, delete",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  loading = false,
  danger = true,
}) => {
  const confirmRef = useRef(null);

  useEffect(() => {
    if (isOpen && confirmRef.current) {
      confirmRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-sm p-6 relative">
        <h3 id="delete-modal-title" className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
          {title}
        </h3>
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-5 leading-relaxed">
          {message}
        </p>
        <div className="flex gap-2">
          <button
            ref={confirmRef}
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 inline-flex justify-center items-center px-4 py-2.5 text-xs font-semibold rounded-lg text-white focus:outline-none focus:ring-2 ${
              danger
                ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500/40'
                : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500/40'
            } disabled:opacity-60`}
          >
            {loading ? 'Processing...' : confirmText}
          </button>
            <button
              onClick={onCancel}
              className="flex-1 inline-flex justify-center items-center px-4 py-2.5 text-xs font-medium rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            >
              {cancelText}
            </button>
        </div>
        <button
          onClick={onCancel}
          className="absolute top-3 right-3 w-7 h-7 inline-flex items-center justify-center rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-500"
          aria-label="Close"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default DeleteModal;