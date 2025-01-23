import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import EditIcon from "../../Assets/Svg/Object/EditIcon";

const EditMatrixModal = ({ isOpen, onClose, onUpdate, sensors, consumer }) => {
  const [selectedSensors, setSelectedSensors] = useState(consumer ? consumer.sensors : []);
  const [selectedSensor, setSelectedSensor] = useState(null);
  const [selectedSentences, setSelectedSentences] = useState([]);
  const [isNestedModalOpen, setIsNestedModalOpen] = useState(false);

  useEffect(() => {
    if (consumer) {
      setSelectedSensors(consumer.sensors || []);
    }
  }, [consumer]);

  const handleEditSensor = (sensor) => {
    setSelectedSensor(sensor);
    setSelectedSentences(sensor.sentences || []);
    setIsNestedModalOpen(true);
  };

  const handleSaveSensor = () => {
    const updatedSensor = {
      ...selectedSensor,
      sentences: selectedSentences,
    };
    setSelectedSensors((prevSensors) =>
      prevSensors.map((sensor) => (sensor.id === updatedSensor.id ? updatedSensor : sensor))
    );
    setIsNestedModalOpen(false);
    setSelectedSensor(null);
    setSelectedSentences([]);
  };

  const handleRemoveSensor = (sensorId) => {
    setSelectedSensors((prevSensors) => prevSensors.filter((sensor) => sensor.id !== sensorId));
  };

  const handleToggleSensorStatus = (sensorId, status) => {
    setSelectedSensors((prevSensors) =>
      prevSensors.map((sensor) =>
        sensor.id === sensorId ? { ...sensor, status: status } : sensor
      )
    );
  };

  const handleSubmit = () => {
    const updatedConsumer = {
      ...consumer,
      sensors: selectedSensors,
    };
    onUpdate(updatedConsumer);
    onClose();
  };

  return isOpen ? (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm">
      <section className="bg-white dark:bg-gray-900 rounded-lg shadow-lg min-w-[48rem] max-h-[40rem] overflow-y-auto">
        <div className="p-6">
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
            Edit Sensors for {consumer.name}
          </h2>
          <ul className="grid gap-4 grid-cols-2 sm:gap-6 w-full">
            {selectedSensors.map((sensor) => (
              <li key={sensor.id} className="flex justify-between items-center border p-2 rounded">
                <span>{sensor.name}</span>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => handleEditSensor(sensor)}
                    className="flex flex-row px-2 py-1 text-sm font-medium text-white bg-primary-700 rounded-lg hover:bg-primary-800"
                  >
                    <EditIcon />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggleSensorStatus(sensor.id, "enabled")}
                    className={`px-2 py-1 text-sm font-medium rounded-lg ${
                      sensor.status === "enabled"
                        ? "border-green-500 bg-green-100 text-green-700"
                        : "border-gray-300 text-gray-700 dark:text-white"
                    }`}
                  >
                    Enable
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggleSensorStatus(sensor.id, "disabled")}
                    className={`px-2 py-1 text-sm font-medium rounded-lg ${
                      sensor.status === "disabled"
                        ? "border-red-500 bg-red-100 text-red-700"
                        : "border-gray-300 text-gray-700 dark:text-white"
                    }`}
                  >
                    Disable
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveSensor(sensor.id)}
                    className="px-2 py-1 text-sm font-medium text-white bg-red-700 rounded-lg hover:bg-red-800"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="gap-2 flex flex-row mt-4">
            <button
              type="submit"
              onClick={handleSubmit}
              className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-white bg-primary-700 rounded-lg hover:bg-primary-800"
            >
              Update Sensors
            </button>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-white bg-red-700 rounded-lg hover:bg-red-800"
            >
              Cancel
            </button>
          </div>
        </div>
      </section>
      {isNestedModalOpen && selectedSensor && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm">
          <section className="bg-white dark:bg-gray-900 rounded-lg shadow-lg min-w-[30rem] max-h-[20rem] overflow-y-auto">
            <div className="p-6">
              <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                Select Sentences for {selectedSensor.name}
              </h2>
              <ul className="grid gap-4 sm:grid-cols-2 sm:gap-6 w-full">
                {sensors
                  .find((sensor) => sensor.id === selectedSensor.id)
                  ?.sentences.map((sentence) => (
                    <li key={sentence.id} className="flex items-center justify-between">
                      <label>
                        <input
                          type="checkbox"
                          checked={selectedSentences.some((s) => s.id === sentence.id)}
                          onChange={() =>
                            setSelectedSentences((prev) =>
                              prev.includes(sentence)
                                ? prev.filter((s) => s.id !== sentence.id)
                                : [...prev, sentence]
                            )
                          }
                          className="mr-2"
                        />
                        {sentence.name}
                      </label>
                    </li>
                  ))}
              </ul>
              <div className="gap-2 flex flex-row mt-4">
                <button
                  type="button"
                  onClick={handleSaveSensor}
                  className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-white bg-primary-700 rounded-lg hover:bg-primary-800"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsNestedModalOpen(false)}
                  className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-white bg-red-700 rounded-lg hover:bg-red-800"
                >
                  Cancel
                </button>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  ) : null;
};

EditMatrixModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  sensors: PropTypes.array.isRequired,
  consumer: PropTypes.object,
};

export default EditMatrixModal;
