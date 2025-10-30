import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSubTypeInfra } from '../../Provider/HargaSatuan/unitPriceSlice'; // Import fetchSubTypeInfra

const satuanByJenis = {
  "LNGBV": "m³/CBM",
  "Onshore LNG Plant": "MMSCFD",
  "Offshore LNG Plant": "MMSCFD",
  "LNGC": "m³/CBM",
  "LNG Carrier": "m³/CBM", // alias
  "LNG Trucking": "m³/CBM",
  "FSRU": "m³/CBM",
  "Onshore Receiving Facility (ORF)": "MMSCFD",
  "OTS": "m³/CBM",
  "Onshore Regasification Unit (ORU)": "MMSCFD",
  "Self-Propelled Barge (SPB)": "m³/CBM",
  "Self-Propelled Barge": "m³/CBM",
  "Dolphin SPB Infrastructure": "m³/CBM",
  "Dolphin LNGBV Infrastructure": "m³/CBM",
  "Jetty SPB Infrastructure": "m³/CBM",
  "Jetty LNGBV Infrastructure": "m³/CBM",
};

const CreateRabModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const dispatch = useDispatch();
  const provinces = useSelector(state => state.administrator.provinces || []);
  const subTypeInfra = useSelector(state => state.unitPrice.subTypeInfra || []); // Use subTypeInfra from slice
  const [namaRab, setNamaRab] = useState(initialData?.namaRab || "");
  const [tahun, setTahun] = useState(initialData?.tahun || 2025);
  const [inflasi, setInflasi] = useState(initialData?.inflasi || 5);
  const [lokasi, setLokasi] = useState(initialData?.lokasi || "");
  const [selectedSubType, setSelectedSubType] = useState(initialData?.jenis || "");
  const [volume, setVolume] = useState(initialData?.volume || "");

  useEffect(() => {
    dispatch(fetchSubTypeInfra()); // Fetch subtypes on mount
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      namaRab,
      tahun,
      inflasi,
      lokasi,
      jenis: selectedSubType,
      volume,
    });
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <section className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[80vh] overflow-y-auto ring-1 ring-black/5">
        <div className="p-6 md:p-8">
          <h2 className="mb-4 text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
            Create Project Cost Plan (RAB)
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Fill RAB details to proceed.</p>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 sm:gap-6 w-full">
              <div className="sm:col-span-2">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">RAB Name</label>
                <input
                  type="text"
                  value={namaRab}
                  onChange={e => setNamaRab(e.target.value)}
                  className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-500 block w-full p-3 dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-400 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Year</label>
                <input
                  type="number"
                  value={tahun}
                  onChange={e => setTahun(e.target.value)}
                  className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg block w-full p-3 focus:ring-2 focus:ring-primary-300 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Inflation (%)</label>
                <input
                  type="number"
                  value={inflasi}
                  onChange={e => setInflasi(e.target.value)}
                  className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg block w-full p-3 focus:ring-2 focus:ring-primary-300 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Location</label>
                <select
                  value={lokasi}
                  onChange={e => setLokasi(e.target.value)}
                  className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg block w-full p-3 focus:ring-2 focus:ring-primary-300 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  required
                >
                  <option value="">Select Location</option>
                  {provinces.map((prov) => (
                    <option key={prov.code} value={prov.name}>{prov.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Subtype</label>
                <select
                  value={selectedSubType}
                  onChange={e => setSelectedSubType(e.target.value)}
                  className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg block w-full p-3 focus:ring-2 focus:ring-primary-300 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  required
                >
                  <option value="">Select Subtype</option>
                  {subTypeInfra.map((subType) => (
                    <option key={subType} value={subType}>{subType}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Volume</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={volume}
                    onChange={e => setVolume(e.target.value)}
                    className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg block w-full p-3 focus:ring-2 focus:ring-primary-300 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    required
                  />
                  <span className="text-sm flex items-center text-gray-700 dark:text-gray-300">
                    {satuanByJenis[selectedSubType] || "-"}
                  </span>
                </div>
              </div>
            </div>
            <div className="gap-2 flex flex-row mt-4">
              <button type="submit" className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-primary-600 to-primary-500 rounded-lg shadow-lg hover:scale-[1.01] transform transition">
                Save
              </button>
              <button type="button" className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg shadow-sm hover:bg-red-700 transition" onClick={onClose}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default CreateRabModal;