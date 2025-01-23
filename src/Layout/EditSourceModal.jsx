import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

const EditSourceModal = ({ isOpen, onClose, onUpdate, sensor }) => {
  const [value, setValue] = useState(sensor?.value || "");

  useEffect(() => {
    if (sensor) {
      setValue(sensor.value);
    }
  }, [sensor]);

  const handleSubmit = () => {
    const updatedSensor = { ...sensor, value };
    onUpdate(updatedSensor);
    onClose();
  };

  return isOpen ? (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm">
      <section className="bg-white dark:bg-gray-900 p-2 rounded-lg shadow-lg overflow-y-auto">
        <div className="p-6">
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
            Edit Sensor
          </h2>
          <form action="#">
            <div className="grid gap-4 grid-cols-1">
              <div className="col-span-2">
                <label
                  htmlFor="value"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Sensor Value
                </label>
                <input
                  type="text"
                  id="value"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="Sensor Value"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  required
                />
              </div>
            </div>

            <div className="gap-2 flex flex-row">
              <button
                type="submit"
                onClick={handleSubmit}
                className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
              >
                Save
              </button>
              <button
                type="button"
                className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-red-700 rounded-lg focus:ring-4 focus:ring-red-200 dark:focus:ring-red-900 hover:bg-red-800"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  ) : null;
};

EditSourceModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  sensor: PropTypes.object,
};

export default EditSourceModal;
