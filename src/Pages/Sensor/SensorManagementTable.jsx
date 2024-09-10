import React from 'react';
import { Button, Dropdown } from 'flowbite-react';
import PropTypes from 'prop-types';
import VerticalDropDownIcon from '../../Assets/Svg/Sensor/VerticalDropDownIcon';
import SettingIcon from '../../Assets/Svg/Sensor/SettingIcon';

// Sample sensor data
const sensorData = [
  {
    name: 'Weather System navigation sensor',
    consumers: ['Consumer 1', 'Consumer 2'],
    parameters: [
      'IP: 3120600087',
      'Measurement range: 700m',
      'Accuracy: 70%',
      'Baud rate: 50',
      'Format data: JSON'
    ]
  },
  {
    name: '2x DGPS sensor',
    consumers: ['Consumer 1', 'Consumer 3'],
    parameters: [
      'IP: 3120600087',
      'Accuracy: 70%',
      'Baud rate: 50',
      'Format data: JSON'
    ]
  },
  {
    name: 'W-AIS sensor',
    consumers: ['Consumer 1', 'Consumer 4'],
    parameters: [
      'IP: 3120600088',
      'Measurement range: 800m',
      'Accuracy: 80%',
      'Baud rate: 60',
      'Format data: XML'
    ]
  },
  {
    name: '2x Navigation Radar Sensor',
    consumers: ['Consumer 2', 'Consumer 5'],
    parameters: [
      'IP: 3120600089',
      'Measurement range: 600m',
      'Accuracy: 75%',
      'Baud rate: 55',
      'Format data: CSV'
    ]
  },
  {
    name: 'Speedlog navigation sensor',
    consumers: ['Consumer 3', 'Consumer 6'],
    parameters: [
      'IP: 3120600090',
      'Measurement range: 900m',
      'Accuracy: 85%',
      'Baud rate: 70',
      'Format data: JSON'
    ]
  },
  {
    name: 'Echo Sounder sensor',
    consumers: ['Consumer 4', 'Consumer 7'],
    parameters: [
      'IP: 3120600091',
      'Measurement range: 1000m',
      'Accuracy: 90%',
      'Baud rate: 80',
      'Format data: XML'
    ]
  },
  {
    name: 'Main Gyro sensor',
    consumers: ['Consumer 5', 'Consumer 8'],
    parameters: [
      'IP: 3120600092',
      'Measurement range: 1100m',
      'Accuracy: 95%',
      'Baud rate: 85',
      'Format data: CSV'
    ]
  },
  {
    name: 'Back-up Gyro sensor',
    consumers: ['Consumer 6', 'Consumer 9'],
    parameters: [
      'IP: 3120600093',
      'Measurement range: 1200m',
      'Accuracy: 92%',
      'Baud rate: 88',
      'Format data: JSON'
    ]
  },
  {
    name: 'Third Priority Gyro sensor',
    consumers: ['Consumer 7', 'Consumer 10'],
    parameters: [
      'IP: 3120600094',
      'Measurement range: 1300m',
      'Accuracy: 89%',
      'Baud rate: 90',
      'Format data: XML'
    ]
  },
  {
    name: 'Magnetic Compass sensor',
    consumers: ['Consumer 8', 'Consumer 11'],
    parameters: [
      'IP: 3120600095',
      'Measurement range: 1400m',
      'Accuracy: 87%',
      'Baud rate: 95',
      'Format data: CSV'
    ]
  }
];

// Sensor Management Table Component
const SensorManagementTable = ({ sensors }) => {
  const handleConfigureSensor = (sensorId) => {
    console.log(`Configuring sensor with ID: ${sensorId}`);
    // Add configuration logic here
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900 p-3">
      <div className="mx-auto max-w-screen-xl px-4 lg:px-4">
        <div className="bg-white dark:bg-gray-800 relative shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-4 py-3">No</th>
                  <th scope="col" className="px-4 py-3">Sensor name</th>
                  <th scope="col" className="px-4 py-3">Consumer sensor</th>
                  <th scope="col" className="px-4 py-3">Parameter sensor</th>
                  <th scope="col" className="px-4 py-3"> <SettingIcon/> </th>
                </tr>
              </thead>
              <tbody>
                {sensors.map((sensor, index) => (
                  <tr key={index} className="border-b dark:border-gray-700">
                    <th scope="row" className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">{index + 1}</th>
                    <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">{sensor.name}</td>
                    <td className="px-4 py-3">
                      {sensor.consumers.map((consumer, consumerIndex) => (
                        <span
                          key={consumerIndex}
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-1 ${
                            getConsumerClass(consumer)
                          }`}
                        >
                          {consumer}
                        </span>
                      ))}
                    </td>
                    <td className="px-4 py-3 space-y-1">
                      <div className="flex flex-wrap gap-1">
                        {sensor.parameters.map((parameter, paramIndex) => (
                          <span
                            key={paramIndex}
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              getParameterClass(parameter)
                            }`}
                          >
                            {parameter}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 flex items-center justify-end">
                      <Dropdown
                        label=""
                        placement="left"
                        dismissOnClick={false}
                        renderTrigger={() => (
                          <button>
                            <VerticalDropDownIcon />
                          </button>
                        )}
                      >
                        <div className="rounded-lg font-medium">
                          <Dropdown.Item className="text-sm text-gray-900">
                            Edit Sensor
                          </Dropdown.Item>
                          <Dropdown.Item className="text-sm text-gray-900">
                            Delete Sensor
                          </Dropdown.Item>
                          <Dropdown.Item className="text-sm text-gray-900">
                            View Detail Sensor
                          </Dropdown.Item>
                          <Dropdown.Item className="flex justify-start items-start hover:bg-gray-100 w-full">
                            <Button
                              className="w-full"
                              onClick={() => handleConfigureSensor(sensor.id)}
                            >
                              Configure Sensor
                            </Button>
                          </Dropdown.Item>
                        </div>
                      </Dropdown>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

// Helper functions for dynamic class assignment
const getConsumerClass = (consumer) => {
  switch (consumer) {
    case 'Consumer 1':
      return 'bg-blue-100 text-blue-800';
    case 'Consumer 2':
      return 'bg-green-100 text-green-800';
    case 'Consumer 3':
      return 'bg-yellow-100 text-yellow-800';
    case 'Consumer 4':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getParameterClass = (parameter) => {
  if (parameter.toLowerCase().includes('ip')) return 'bg-green-100 text-green-800';
  if (parameter.toLowerCase().includes('range')) return 'bg-yellow-100 text-yellow-800';
  if (parameter.toLowerCase().includes('accuracy')) return 'bg-red-100 text-red-800';
  if (parameter.toLowerCase().includes('baud')) return 'bg-blue-100 text-blue-800';
  if (parameter.toLowerCase().includes('format')) return 'bg-purple-100 text-purple-800';
  return 'bg-gray-100 text-gray-800';
};

// PropTypes validation
SensorManagementTable.propTypes = {
  sensors: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      consumers: PropTypes.arrayOf(PropTypes.string).isRequired,
      parameters: PropTypes.arrayOf(PropTypes.string).isRequired,
    })
  ).isRequired,
};

// Default props
SensorManagementTable.defaultProps = {
  sensors: sensorData,
};

export default SensorManagementTable;
