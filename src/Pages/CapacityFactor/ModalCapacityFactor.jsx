import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setInput, calculateCost } from '../../Provider/CapacityFactorSlice';

const satuanByJenis = {
  "Onshore LNG Plant": "MTPA",
  "Offshore LNG Plant": "MTPA",
  "LNG Carrier": "m³",
  "LNG Trucking": "CBM",
  "FSRU": "m³ / MMSCFD",
  "ORF": "MMSCFD",
  "OTS": "MMSCFD",
  "ORU": "m³ / MMSCFD",
  "LNG Bunkering Vessel": "m³",
  "Mini LNG Plant": "MMscfd",
  "LNG Carrier (LNGC)": "m³",
};

const jenisOptions = Object.keys(satuanByJenis);
const methodOptions = [
  'Linear Regression',
  'Log-log Regression',
  'Capacity Factor Method',
];

const ModalCapacityFactor = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { input, result } = useSelector(state => state.capacityFactor);

  const handleChange = (field, value) => {
    dispatch(setInput({ [field]: value }));
  };

  const handleCalculate = (e) => {
    e.preventDefault();
    dispatch(calculateCost());
  };

  return isOpen ? (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm">
      <section className="bg-white dark:bg-gray-900 rounded-lg shadow-lg min-w-[32rem] max-h-[40rem] overflow-y-auto">
        <div className="p-6">
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
            Kalkulasi Capacity Factor
          </h2>
          <form onSubmit={handleCalculate}>
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 sm:gap-6 w-full">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Type
                </label>
                <select
                  value={input.type}
                  onChange={e => handleChange('type', e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                >
                  {jenisOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Method
                </label>
                <select
                  value={input.method}
                  onChange={e => handleChange('method', e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                >
                  {methodOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Kapasitas yang Diinginkan
                </label>
                <div className="flex flex-row gap-2">
                  <input
                    type="number"
                    value={input.capacity}
                    onChange={e => handleChange('capacity', e.target.value)}
                    placeholder="Masukkan kapasitas"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    required
                  />
                  <div className="text-sm text-light bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                    <span className="text-gray-500 dark:text-gray-400">
                      {satuanByJenis[input.type] || "-"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="gap-2 flex flex-row mt-4">
              <button
                type="submit"
                className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
              >
                Calculate
              </button>
              <button
                type="button"
                className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-red-700 rounded-lg focus:ring-4 focus:ring-red-200 dark:focus:ring-red-900 hover:bg-red-800"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </form>
          <div className="mt-6">
            {result !== null && (
              <div className="p-4 bg-green-100 dark:bg-green-900 rounded-lg">
                <span className="font-semibold">Estimasi Cost:</span> Rp{result.toLocaleString('id-ID')}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  ) : null;
};

export default ModalCapacityFactor;