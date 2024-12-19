import React, { memo, useState } from "react";
import { Handle, Position } from "@xyflow/react";

function CustomNode({ data }) {
  const [isModalOpen, setModalOpen] = useState(false);

  const handleDoubleClick = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <div
        className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-stone-400"
        onDoubleClick={handleDoubleClick}
      >
        <div className="flex">
          <div className="rounded-full w-12 h-12 flex justify-center items-center bg-gray-100 dark:bg-gray-900">
            {data.emoji}
          </div>
          <div className="ml-2">
            <div className="text-lg font-bold">{data.label}</div>
            <div className="text-gray-500">{data.sensor}</div>
          </div>
        </div>
        <Handle
          type="target"
          position={Position.Top}
          className="w-16 !bg-teal-500"
        />
        <Handle
          type="source"
          position={Position.Bottom}
          className="w-16 !bg-teal-500"
        />
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center"
          onClick={closeModal}
        >
          <div
            className="bg-white p-6 rounded shadow-lg w-auto max-w-lg h-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">{data.label}</h2>
            <p>
              <strong>Sensor:</strong> {data.sensor}
            </p>
            <p>
              <strong>Job:</strong> {data.job}
            </p>
            <p>
              <strong>Object:</strong>
            </p>
            <div className="flex flex-row mt-4">
              <p>{data.sensor}</p>
              <div className="flex items-center space-x-1 ml-4">
                <button
                  type="submit"
                  className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-2 py-2 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Enable
                </button>
                <button
                  type="button"
                  className="text-red-600 inline-flex items-center hover:text-white border border-red-600 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-2 py-2 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                >
                  Disable
                </button>
              </div>
            </div>
            <button
              className="mt-4 bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default memo(CustomNode);
