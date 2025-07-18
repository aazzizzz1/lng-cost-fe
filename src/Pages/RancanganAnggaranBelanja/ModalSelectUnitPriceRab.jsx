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
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 min-w-[340px] max-w-lg w-full">
          <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Data RAB</h3>
          <form
            onSubmit={e => {
              e.preventDefault();
              setStep(2);
            }}
          >
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
                {provinces.map(prov => (
                  <option key={prov.code} value={prov.name}>
                    {prov.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-2">
              <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">Jenis</label>
              <select
                value={jenis}
                onChange={e => setJenis(e.target.value)}
                className="w-full border rounded px-2 py-1"
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
              <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">Volume</label>
              <input
                type="number"
                value={volume}
                onChange={e => setVolume(e.target.value)}
                className="w-full border rounded px-2 py-1"
                required
              />
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
                Lanjut Pilih Harga Satuan
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Step 2: Pilih harga satuan
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 max-w-3xl w-full">
        <div className="flex justify-between items-center mb-2 border-b border-gray-200 dark:border-gray-700 pb-2">
          <div className="font-bold text-lg text-gray-900 dark:text-white">Pilih Harga Satuan</div>
          <button
            className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white text-2xl px-2 transition"
            onClick={onClose}
            aria-label="Tutup"
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
        <div className="overflow-x-auto max-h-80 rounded">
          <table className="w-full text-sm border-separate border-spacing-0">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800">
                <th className="px-2 py-2 border-b border-gray-200 dark:border-gray-700">Uraian</th>
                <th className="px-2 py-2 border-b border-gray-200 dark:border-gray-700">Satuan</th>
                <th className="px-2 py-2 border-b border-gray-200 dark:border-gray-700">Harga Satuan</th>
                <th className="px-2 py-2 border-b border-gray-200 dark:border-gray-700"></th>
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
    </div>
  );
};

export default ModalSelectUnitPriceRab;