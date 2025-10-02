import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setInput, calculateCostAPI, fetchReferenceData } from '../../Provider/CapacityFactorSlice';
import { fetchProvinces } from '../../Provider/administratorSlice';

const satuanByJenis = {
  "LNG Plant": "MTPA",
  "Offshore LNG Plant": "MTPA",
  "LNG Carrier": "m³",
  "LNG Trucking": "CBM",
  "FSRU": "m³ / MMSCFD",
  "ORF": "MMSCFD",
  "OTS": "MMSCFD",
  "ORU": "m³ / MMSCFD",
  "LNGBV": "m³",
  "Mini LNG Plant": "MMscfd",
  "LNGC": "m³",
};

const methodOptions = [
  'Capacity Factor Method',
  'Linear Regression',
  'Log-log Regression',
];

const ModalCapacityFactor = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { input, result, r2, r2Interpretation, referenceData, loading, error } = useSelector(state => state.capacityFactor);
  const provinces = useSelector(state => state.administrator.provinces);

  // Tambahkan state tahun, lokasi, inflasi
  const [tahun, setTahun] = useState(new Date().getFullYear());
  const [lokasi, setLokasi] = useState('');
  const [inflasi, setInflasi] = useState(5.0);
  const [information, setInformation] = useState('');

  // Ambil tipe dari data referensi backend
  const jenisOptions = Object.keys(referenceData);

  // Ambil daftar information unik sesuai infrastruktur yang dipilih
  const informationOptions = input.type
    ? Array.from(
        new Set(
          (referenceData[input.type] || []).map(item => item.information).filter(Boolean)
        )
      )
    : [];

  useEffect(() => {
    if (isOpen && jenisOptions.length === 0) {
      dispatch(fetchReferenceData());
    }
    if (isOpen && provinces.length === 0) {
      dispatch(fetchProvinces());
    }
  }, [isOpen, dispatch, jenisOptions.length, provinces.length]);

  // Reset information jika infrastruktur berubah
  useEffect(() => {
    setInformation('');
  }, [input.type]);

  const handleChange = (field, value) => {
    dispatch(setInput({ [field]: value }));
  };

  const handleCalculate = (e) => {
    e.preventDefault();
    dispatch(setInput({
      tahun: Number(tahun),
      lokasi,
      inflasi: Number(inflasi),
      information,
    }));
    dispatch(calculateCostAPI({
      ...input,
      tahun: Number(tahun),
      lokasi,
      inflasi: Number(inflasi),
      information,
    }));
  };

  return isOpen ? (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm">
      <section className="bg-white dark:bg-gray-900 rounded-lg shadow-lg min-w-[32rem] max-h-[40rem] overflow-y-auto">
        <div className="p-6">
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
            Kalkulasi Cepat Estimasi Infrastruktur LNG
          </h2>
          {loading && <div className="mb-2 text-blue-600">Loading data...</div>}
          {error && <div className="mb-2 text-red-600">{error}</div>}
          <form onSubmit={handleCalculate}>
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 sm:gap-6 w-full">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Infrastruktur
                </label>
                <select
                  value={input.type}
                  onChange={e => handleChange('type', e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  required
                >
                  <option value="" disabled>Pilih tipe</option>
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
              {/* Tahun */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Tahun
                </label>
                <input
                  type="number"
                  value={tahun}
                  onChange={(e) => setTahun(e.target.value)}
                  placeholder="Tahun"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                />
              </div>
              {/* Inflasi */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Asumsi Inflasi (%)
                </label>
                <input
                  type="number"
                  value={inflasi}
                  onChange={(e) => setInflasi(e.target.value)}
                  placeholder="5%"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                />
              </div>
              {/* Lokasi */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Lokasi
                </label>
                <select
                  value={lokasi}
                  onChange={(e) => setLokasi(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  required
                >
                  <option value="">Pilih Lokasi</option>
                  {provinces.map((prov) => (
                    <option key={prov.code} value={prov.name}>
                      {prov.name}
                    </option>
                  ))}
                </select>
              </div>
              {/* Information */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Information (Opsional)
                </label>
                <select
                  value={information}
                  onChange={e => setInformation(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  disabled={informationOptions.length === 0}
                >
                  <option value="">Pilih Information (opsional)</option>
                  {informationOptions.map((info, idx) => (
                    <option key={idx} value={info}>{info}</option>
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
                      {input.type && satuanByJenis[input.type] ? satuanByJenis[input.type] : "-"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="gap-2 flex flex-row mt-4">
              <button
                type="submit"
                className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
                disabled={loading}
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
                <div>
                  <span className="font-semibold">Estimasi Cost:</span> Rp{result}
                  {/* .toLocaleString('id-ID') */}
                </div>
                <div>
                  <span className="font-semibold">R²:</span> {r2}
                </div>
                <div>
                  <span className="font-semibold">Interpretasi R²:</span> {r2Interpretation}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  ) : null;
};

export default ModalCapacityFactor;