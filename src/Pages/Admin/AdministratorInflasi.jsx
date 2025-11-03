import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateInflasi } from '../../Provider/administratorSlice';

const AdministratorInflasi = () => {
  const inflasi = useSelector((state) => state.administrator.inflasi);
  const dispatch = useDispatch();
  const currentYear = new Date().getFullYear();
  const current = inflasi.find((i) => i.year === currentYear) || { year: currentYear, value: 0 };

  const handleChange = (value) => {
    const val = parseFloat(value);
    if (!isNaN(val)) {
      dispatch(updateInflasi({ year: currentYear, value: val }));
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
      <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-100 dark:border-gray-800">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
            <tr>
              <th className="px-4 py-3">Year</th>
              <th className="px-4 py-3">Inflation (%)</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <td className="px-4 py-3 text-gray-900 dark:text-gray-100">{currentYear}</td>
              <td className="px-4 py-3">
                <input
                  type="number"
                  className="w-28 px-2 py-1 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                  value={current.value}
                  onChange={(e) => handleChange(e.target.value)}
                  step="0.01"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdministratorInflasi;