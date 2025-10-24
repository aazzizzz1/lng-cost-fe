import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRecommendedUnitPrices, fetchUniqueFields } from "../../Provider/HargaSatuan/unitPriceSlice";

const ModalSelectUnitPriceRab = ({ onClose, onSubmit, rabData }) => {
  const dispatch = useDispatch();
  const recommendedPrices = useSelector(state => state.unitPrice.recommendedPrices || []);
  const uniqueFields = useSelector(state => state.unitPrice.uniqueFields || {});
  const provinces = useSelector(state => state.administrator.provinces || []);
  const inflasiList = useSelector(state => state.administrator.inflasi || []);
  const [loading, setLoading] = useState(false);

  // State for form inputs
  const [step, setStep] = useState(rabData ? 2 : 1);
  const [namaRab, setNamaRab] = useState(rabData?.namaRab || "");
  const [tahun, setTahun] = useState(rabData?.tahun || new Date().getFullYear());
  const [inflasi, setInflasi] = useState(rabData?.inflasi || "");
  const [lokasi, setLokasi] = useState(rabData?.lokasi || "");
  const [jenis, setJenis] = useState(rabData?.jenis || "");
  const [volume, setVolume] = useState(rabData?.volume || "");
  const [search, setSearch] = useState("");

  // Fetch unique fields (e.g., jenis, satuan) from backend
  useEffect(() => {
    dispatch(fetchUniqueFields());
  }, [dispatch]);

  // Update inflasi based on selected year
  useEffect(() => {
    if (tahun && inflasiList.length > 0) {
      const inf = inflasiList.find(i => Number(i.year) === Number(tahun));
      setInflasi(inf ? inf.value : "");
    }
  }, [tahun, inflasiList]);

  // Handler for fetching recommended unit prices
  const handleFetchRecommendations = async () => {
    setLoading(true);
    const payload = {
      name: namaRab,
      infrastruktur: jenis || "LNGBV", // Default to LNGBV if no type is selected
      lokasi,
      volume: Number(volume),
      tahun: Number(tahun),
      kategori: "MID SCALE LNG BV", // Adjust as needed
      inflasi: Number(inflasi),
    };
    try {
      await dispatch(fetchRecommendedUnitPrices(payload));
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    }
    setLoading(false);
  };

  // Step 1: Form input data RAB
  if (!rabData && step === 1) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <section className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg ring-1 ring-black/5">
          <div className="p-6 md:p-8">
            <h3 className="text-2xl font-extrabold mb-4 text-gray-900 dark:text-white">RAB Data</h3>
            <form
              onSubmit={e => {
                e.preventDefault();
                setStep(2);
              }}
            >
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">RAB Name</label>
                <input
                  type="text"
                  value={namaRab}
                  onChange={e => setNamaRab(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg p-3 focus:ring-2 focus:ring-primary-400 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">Tahun</label>
                <input
                  type="number"
                  value={tahun}
                  onChange={e => setTahun(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg p-3 focus:ring-2 focus:ring-primary-400 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">Asumsi Inflasi (%)</label>
                <input
                  type="number"
                  value={inflasi}
                  onChange={e => setInflasi(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg p-3 focus:ring-2 focus:ring-primary-400 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">Lokasi</label>
                <select
                  value={lokasi}
                  onChange={e => setLokasi(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg p-3 focus:ring-2 focus:ring-primary-400 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  required
                >
                  <option value="">Pilih Lokasi</option>
                  {provinces.map(prov => (
                    <option key={prov.code} value={prov.name}>
                      {prov.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">Jenis</label>
                <select
                  value={jenis}
                  onChange={e => setJenis(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg p-3 focus:ring-2 focus:ring-primary-400 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  required
                >
                  <option value="">Pilih Jenis</option>
                  {uniqueFields.tipe?.map(j => (
                    <option key={j} value={j}>
                      {j}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">Volume</label>
                <input
                  type="number"
                  value={volume}
                  onChange={e => setVolume(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg p-3 focus:ring-2 focus:ring-primary-400 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  required
                />
              </div>
              <div className="flex gap-2 justify-end mt-4">
                <button type="button" className="px-5 py-2.5 text-sm font-medium text-white bg-gray-500 rounded-lg hover:bg-gray-600" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 text-sm font-semibold text-white bg-primary-700 hover:bg-primary-800 rounded-lg">
                  Continue
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    );
  }

  // Step 2: Pilih harga satuan
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <section className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-3xl ring-1 ring-black/5">
        <div className="p-6 md:p-8">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">Select Unit Price</h3>
            <button
              className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white text-2xl px-2 transition"
              onClick={onClose}
              aria-label="Close"
            >
              &times;
            </button>
          </div>
          <input
            type="text"
            className="w-full mb-3 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500 transition"
            placeholder="Cari..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            autoFocus
          />
          <div className="flex justify-end mb-4">
            <button
              type="button"
              className="bg-primary-700 hover:bg-primary-800 text-white px-4 py-2 rounded"
              onClick={handleFetchRecommendations}
              disabled={loading}
            >
              {loading ? "Memuat..." : "Tambahkan Harga Satuan"}
            </button>
          </div>
          <div className="overflow-x-auto max-h-80 rounded-lg border border-gray-100 dark:border-gray-800">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
                <tr>
                  <th className="px-4 py-3">Uraian</th>
                  <th className="px-4 py-3">Satuan</th>
                  <th className="px-4 py-3">Harga Satuan</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {recommendedPrices.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="text-center text-gray-400 dark:text-gray-500 py-6"
                    >
                      Tidak ada data rekomendasi.
                    </td>
                  </tr>
                ) : (
                  recommendedPrices.map((row, idx) => (
                    <tr
                      key={row.id || idx}
                      className="hover:bg-primary-50 dark:hover:bg-gray-800 transition"
                    >
                      <td className="px-2 py-2 border-b border-gray-100 dark:border-gray-800">
                        {row.uraian}
                      </td>
                      <td className="px-2 py-2 border-b border-gray-100 dark:border-gray-800">
                        {row.satuan}
                      </td>
                      <td className="px-2 py-2 border-b border-gray-100 dark:border-gray-800">
                        {row.hargaSatuan}
                      </td>
                      <td className="px-2 py-2 border-b border-gray-100 dark:border-gray-800">
                        <button
                          type="button"
                          className="bg-primary-700 hover:bg-primary-800 text-white px-3 py-1 rounded text-xs font-semibold shadow-sm transition"
                          onClick={() => onSubmit(row)}
                        >
                          Tambah
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ModalSelectUnitPriceRab;