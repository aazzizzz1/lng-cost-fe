import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

const CreateMatrixModal = ({ isOpen, onClose, onCreate, sensors, consumer }) => {
  const [selectedSensors, setSelectedSensors] = useState(consumer ? consumer.sensors : []);
  const [selectedSensor, setSelectedSensor] = useState(null);
  const [selectedSentences, setSelectedSentences] = useState([]);
  const [isNestedModalOpen, setIsNestedModalOpen] = useState(false);

  const handleAddSensor = (sensor) => {
    setSelectedSensor(sensor);
    setIsNestedModalOpen(true);
  };

  const handleAddSentence = (sentence) => {
    setSelectedSentences([...selectedSentences, sentence]);
  };

  const handleSaveSensor = () => {
    const updatedSensor = {
      ...selectedSensor,
      sentences: selectedSentences,
    };
    setSelectedSensors([...selectedSensors, updatedSensor]);
    setIsNestedModalOpen(false);
    setSelectedSensor(null);
    setSelectedSentences([]);
  };

  const handleSubmit = () => {
    const updatedConsumer = {
      ...consumer,
      sensors: selectedSensors,
    };
    onCreate(updatedConsumer);
    onClose();
  };

  useEffect(() => {
    if (consumer) {
      setSelectedSensors(consumer.sensors);
    }
  }, [consumer]);

  return isOpen ? (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm">
      <section className="bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-[48rem] max-h-[40rem] overflow-y-auto">
        <div className="p-6">
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Add Sensors to {consumer.name}</h2>
          <form action="#">
              <div className="flex flex-col">
                <label htmlFor="sensors" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Available Sensors
                </label>
                <div className="grid gap-4 grid-cols-4 sm:gap-6 w-full">
                  {sensors.map(sensor => (
                    <div
                      key={sensor.id}
                      className={`flex items-center border p-2 rounded ${selectedSensors.some(s => s.id === sensor.id) ? 'border-green-500 bg-green-100' : 'border-gray-300'}`}
                    >
                      <input
                        type="checkbox"
                        id={`sensor-${sensor.id}`}
                        className="mr-2"
                        onChange={() => handleAddSensor(sensor)}
                        checked={selectedSensors.some(s => s.id === sensor.id)}
                      />
                      <label htmlFor={`sensor-${sensor.id}`} className="text-gray-900 dark:text-white">
                        {sensor.name}
                      </label>
                    </div>
                  ))}
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
                Discard
              </button>
            </div>
          </form>
        </div>
      </section>
      {isNestedModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm">
          <section className="bg-white dark:bg-gray-900 rounded-lg shadow-lg min-w-[30rem] max-h-[20rem] overflow-y-auto">
            <div className="p-6">
              <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Select Sentences for {selectedSensor.name}</h2>
              <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 w-full">
                {selectedSensor.sentences.map(sentence => (
                  <div
                    key={sentence.id}
                    className={`flex items-center border p-2 rounded ${selectedSentences.includes(sentence) ? 'border-green-500 bg-green-100' : 'border-gray-300'}`}
                  >
                    <input
                      type="checkbox"
                      id={`sentence-${sentence.id}`}
                      className="mr-2"
                      onChange={() => handleAddSentence(sentence)}
                      checked={selectedSentences.includes(sentence)}
                    />
                    <label htmlFor={`sentence-${sentence.id}`} className="text-gray-900 dark:text-white">
                      {sentence.name}
                    </label>
                  </div>
                ))}
              </div>
              <div className="gap-2 flex flex-row mt-4">
                <button
                  type="button"
                  onClick={handleSaveSensor}
                  className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
                >
                  Save
                </button>
                <button
                  type="button"
                  className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-red-700 rounded-lg focus:ring-4 focus:ring-red-200 dark:focus:ring-red-900 hover:bg-red-800"
                  onClick={() => setIsNestedModalOpen(false)}
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

CreateMatrixModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
  sensors: PropTypes.array.isRequired,
  consumer: PropTypes.object,
};

export default CreateMatrixModal;