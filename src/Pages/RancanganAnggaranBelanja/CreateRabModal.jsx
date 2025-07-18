import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSubTypeInfra } from '../../Provider/HargaSatuan/unitPriceSlice'; // Import fetchSubTypeInfra

const satuanByJenis = {
  "Onshore LNG Plant": "MTPA",
  "Offshore LNG Plant": "MTPA",
  "LNG Carrier": "m³",
  "LNG Trucking": "CBM",
  FSRU: "m³ / MMSCFD",
  ORF: "MMSCFD",
  OTS: "MMSCFD",
  ORU: "m³ / MMSCFD",
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 min-w-[340px] max-w-lg w-full">
        <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Data RAB</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">Nama RAB</label>
            <input
              type="text"
              value={namaRab}
              onChange={e => setNamaRab(e.target.value)}
              className="w-full border rounded px-2 py-1"
              required
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">Tahun</label>
            <input
              type="number"
              value={tahun}
              onChange={e => setTahun(e.target.value)}
              className="w-full border rounded px-2 py-1"
              required
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">Asumsi Inflasi (%)</label>
            <input
              type="number"
              value={inflasi}
              onChange={e => setInflasi(e.target.value)}
              className="w-full border rounded px-2 py-1"
              required
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">Lokasi</label>
            <select
              value={lokasi}
              onChange={e => setLokasi(e.target.value)}
              className="w-full border rounded px-2 py-1"
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
          <div className="mb-2">
            <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">Jenis</label>
            <select
              value={selectedSubType}
              onChange={e => setSelectedSubType(e.target.value)}
              className="w-full border rounded px-2 py-1"
              required
            >
              <option value="">Pilih Sub-Jenis</option>
              {subTypeInfra.map((subType) => (
                <option key={subType} value={subType}>
                  {subType}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">Volume</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={volume}
                onChange={e => setVolume(e.target.value)}
                className="w-full border rounded px-2 py-1"
                required
              />
              <span className="text-sm flex items-center">{satuanByJenis[selectedSubType] || "-"}</span>
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-1 rounded"
              onClick={onClose}
            >
              Batal
            </button>
            <button
              type="submit"
              className="bg-primary-700 hover:bg-primary-800 text-white px-4 py-1 rounded"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRabModal;