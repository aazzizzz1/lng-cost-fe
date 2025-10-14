import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUnitPriceDataForModal, fetchTypes } from "../../Provider/HargaSatuan/unitPriceSlice";
import {
  updateItem,
  closeModal,
  selectModal,
  setModalSearch,
} from "../../Provider/Project/detailCreateProjectConstructionSlice";

const DetailCreateProjectConstructionModal = ({ project, provinces, inflasiList }) => {
  const dispatch = useDispatch();
  const modal = useSelector(selectModal);
  const { types = [], transport: { data = [] }, modalLoading } = useSelector((state) => state.unitPrice); // FIX selector
  const search = modal.search || "";

  const [selectedType, setSelectedType] = useState("");
  const [selectedRow, setSelectedRow] = useState(null); // NEW: Track selected row for composing prices modal

  useEffect(() => {
    dispatch(fetchTypes());
  }, [dispatch]);

  useEffect(() => {
    if (selectedType) {
      dispatch(fetchUnitPriceDataForModal({ tipe: selectedType, search }));
    }
  }, [dispatch, selectedType, search]);

  const modalColumns = [
    { key: "workcode", label: "Workcode" },
    { key: "recommendedPrice", label: "Harga Rekomendasi" },
    { key: "uraian", label: "Uraian" },
    { key: "spesifikasi", label: "Spesifikasi" },
    { key: "lokasi", label: "Lokasi" },
    { key: "proyek", label: "Proyek" },
    { key: "tahun", label: "Tahun" },
  ];

  // Helper untuk ambil nilai dengan fallback ke recommendedItem
  const getCellValue = (row, key) => {
    if (key === "recommendedPrice") return row.recommendedPrice ?? "-";
    if (key === "spesifikasi") {
      return row.spesifikasi || row.specification || row.recommendedItem?.specification || row.recommendedItem?.spesifikasi || "-";
    }
    return row[key] ?? row.recommendedItem?.[key] ?? "-";
  };

  const getCCI = (nama) => {
    const prov = provinces.find((p) => p.name === nama);
    return prov ? prov.cci : 100;
  };

  const handleSelectFromModal = (row) => {
    const tahunProject = project?.tahun;
    const lokasiProject = project?.lokasi;
    const inflasiProject = (() => {
      const inf = inflasiList.find((i) => Number(i.year) === Number(tahunProject));
      return inf ? inf.value : 5.0;
    })();
    const tahunItem = row.tahun || tahunProject;
    const lokasiItem = row.lokasi || lokasiProject;
    const hargaSatuanItem = row.recommendedPrice ?? row.hargaSatuan ?? 0; // <-- pakai recommendedPrice jika ada

    // Step 1: Update harga ke tahun project
    const n = Number(tahunProject) - Number(tahunItem);
    const r = Number(inflasiProject) / 100;
    let hargaTahunProject = hargaSatuanItem;
    if (n > 0) {
      hargaTahunProject = hargaSatuanItem * Math.pow(1 + r, n);
    }

    // Step 2: Konversi ke harga benchmark (Banjarmasin)
    const cciItem = getCCI(lokasiItem);
    const cciBanjarmasin = getCCI("Banjarmasin");
    let hargaBanjarmasin = hargaTahunProject * (cciBanjarmasin / cciItem);

    // Step 3: Konversi ke lokasi project
    const cciProject = getCCI(lokasiProject);
    let hargaLokasiProject = hargaBanjarmasin * (cciProject / 100);

    // Step 4: Adjust quantity using capacity factor
    const calculateQuantityUsingCapacityFactor = (baseQty, baseVolume, targetVolume) => {
      const factor = 0.73;
      return baseQty * Math.pow(targetVolume / baseVolume, factor);
    };
    const adjustedQty = calculateQuantityUsingCapacityFactor(
      row.qty || 1,
      row.volume || 1,
      project?.volume || 1
    );

    dispatch(
      updateItem({
        idx: modal.itemIdx,
        field: "workcode",
        value: row.workcode || "",
      })
    );
    dispatch(
      updateItem({
        idx: modal.itemIdx,
        field: "kode",
        value: row.workcode || row.kode || "", // NEW: sync kode with workcode
      })
    );
    dispatch(
      updateItem({
        idx: modal.itemIdx,
        field: "uraian",
        value: row.uraian || "",
      })
    );
    // ensure specification
    dispatch(
      updateItem({
        idx: modal.itemIdx,
        field: "specification",
        value: row.spesifikasi || row.specification || "",
      })
    );
    dispatch(
      updateItem({
        idx: modal.itemIdx,
        field: "satuan",
        value: row.satuan || "",
      })
    );
    dispatch(
      updateItem({
        idx: modal.itemIdx,
        field: "hargaSatuan",
        value: Math.round(hargaLokasiProject),
      })
    );
    dispatch(
      updateItem({
        idx: modal.itemIdx,
        field: "qty",
        value: Math.round(adjustedQty),
      })
    );
    dispatch(
      updateItem({
        idx: modal.itemIdx,
        field: "totalHarga",
        value: Math.round(adjustedQty * Math.round(hargaLokasiProject)),
      })
    );

    // supportive fields
    dispatch(
      updateItem({
        idx: modal.itemIdx,
        field: "tahun",
        value: Number(tahunProject) || Number(row.tahun) || new Date().getFullYear(),
      })
    );
    dispatch(
      updateItem({
        idx: modal.itemIdx,
        field: "lokasi",
        value: lokasiProject || row.lokasi || "",
      })
    );
    dispatch(
      updateItem({
        idx: modal.itemIdx,
        field: "infrastruktur",
        value: project?.infrastruktur || row.infrastruktur || "",
      })
    );
    dispatch(
      updateItem({
        idx: modal.itemIdx,
        field: "volume",
        value: Number(project?.volume || row.volume || 0),
      })
    );
    dispatch(
      updateItem({
        idx: modal.itemIdx,
        field: "satuanVolume",
        value: row.satuanVolume || "",
      })
    );
    dispatch(
      updateItem({
        idx: modal.itemIdx,
        field: "kelompok",
        value: row.kelompok || "",
      })
    );
    dispatch(
      updateItem({
        idx: modal.itemIdx,
        field: "kelompokDetail",
        value: row.kelompokDetail || "",
      })
    );
    // NEW: set tipe from source (row or selectedType)
    dispatch(
      updateItem({
        idx: modal.itemIdx,
        field: "tipe",
        value: row.tipe || selectedType || "",
      })
    );
    // NEW: stamp owning project id
    dispatch(
      updateItem({
        idx: modal.itemIdx,
        field: "projectId",
        value: Number(project?.id) || undefined,
      })
    );

    dispatch(closeModal());
  };

  // Tambahkan ikon untuk tombol komposisi
  const CompositionIcon = ({ className = "w-4 h-4" }) => (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a4 4 0 014-4h6M9 17H7a4 4 0 01-4-4V7a4 4 0 014-4h10a4 4 0 014 4v6a4 4 0 01-4 4h-2" />
    </svg>
  );

  // Helper: pilih dari baris komposisi menggunakan logika existing
  const handleSelectFromComposition = (parentRow, comp) => {
    // Tutup panel komposisi dulu agar tidak flicker
    setSelectedRow(null);

    // Bentuk row kompatibel dengan handleSelectFromModal
    const composedRow = {
      ...parentRow,
      // override dengan data komponen
      workcode: comp.workcode ?? parentRow.workcode,
      uraian: comp.uraian ?? parentRow.uraian,
      spesifikasi: comp.spesifikasi ?? comp.specification ?? parentRow.spesifikasi ?? parentRow.specification,
      specification: comp.specification ?? comp.spesifikasi ?? parentRow.specification ?? parentRow.spesifikasi,
      satuan: comp.satuan ?? parentRow.satuan,
      tahun: comp.tahun ?? parentRow.tahun,
      lokasi: comp.lokasi ?? parentRow.lokasi,
      // pakai harga komponen sebagai recommended
      recommendedPrice: comp.hargaSatuan ?? parentRow.recommendedPrice ?? parentRow.hargaSatuan ?? 0,
      hargaSatuan: comp.hargaSatuan ?? parentRow.hargaSatuan ?? 0,
    };

    handleSelectFromModal(composedRow);
  };

  if (!modal.open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 transition-colors">
      {/* Main Modal */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 max-w-4xl w-full p-6 transition-all duration-200">
        <div className="flex justify-between items-center mb-2 border-b border-gray-200 dark:border-gray-700 pb-2">
          <div className="font-bold text-lg text-gray-900 dark:text-white">
            Pilih Harga Satuan
          </div>
          <button
            className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white text-2xl px-2 transition"
            onClick={() => dispatch(closeModal())}
            aria-label="Tutup"
          >
            &times;
          </button>
        </div>
        <div className="flex gap-2 mb-3">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 border rounded text-sm"
          >
            <option value="">Pilih Tipe</option>
            {types.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <input
            type="text"
            className="flex-1 px-3 py-2 border rounded text-sm"
            placeholder="Cari..."
            value={search}
            onChange={(e) => dispatch(setModalSearch(e.target.value))}
          />
        </div>
        <div className="overflow-x-auto max-h-[32rem] rounded">
          <table className="w-full text-sm border-separate border-spacing-0">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800">
                {modalColumns.map((col) => (
                  <th
                    key={col.key}
                    className="px-2 py-2 border-b border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-semibold sticky top-0 z-10 bg-inherit"
                  >
                    {col.label}
                  </th>
                ))}
                <th className="px-2 py-2 border-b border-gray-200 dark:border-gray-700"></th>
              </tr>
            </thead>
            <tbody>
              {modalLoading ? (
                <tr>
                  <td
                    colSpan={modalColumns.length + 1}
                    className="text-center text-gray-400 dark:text-gray-500 py-6"
                  >
                    Loading...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td
                    colSpan={modalColumns.length + 1}
                    className="text-center text-gray-400 dark:text-gray-500 py-6"
                  >
                    Tidak ada data.
                  </td>
                </tr>
              ) : (
                data.map((row, idx) => (
                  <tr
                    key={row.workcode || idx}
                    className="hover:bg-primary-50 dark:hover:bg-gray-800 transition"
                  >
                    {modalColumns.map((col) => (
                      <td
                        key={col.key}
                        className="px-2 py-2 border-b border-gray-100 dark:border-gray-800 text-gray-900 dark:text-gray-100"
                      >
                        {getCellValue(row, col.key)}
                      </td>
                    ))}
                    <td className="px-2 py-2 border-b border-gray-100 dark:border-gray-800 flex gap-2">
                      <button
                        type="button"
                        className="bg-primary-700 hover:bg-primary-800 text-white px-3 py-1 rounded text-xs font-semibold shadow-sm transition"
                        onClick={() => handleSelectFromModal(row)}
                      >
                        Pilih
                      </button>
                      {Array.isArray(row.composingPrices) && row.composingPrices.length > 0 && (
                        <button
                          type="button"
                          className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-100 px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 transition"
                          title="Lihat Komposisi Harga Satuan"
                          onClick={() => setSelectedRow(row)}
                        >
                          <CompositionIcon className="w-4 h-4" />
                          Komposisi
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Composing Prices Drawer (responsive) */}
      {selectedRow && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* backdrop click closes drawer */}
          <div className="absolute inset-0 bg-black/40" onClick={() => setSelectedRow(null)} />
          <div className="relative h-full w-full sm:w-[24rem] md:w-[32rem] lg:w-[48rem] bg-white dark:bg-gray-900 shadow-2xl border-l border-gray-200 dark:border-gray-700 p-4 sm:rounded-none">
            <div className="sticky top-0 bg-white dark:bg-gray-900 pb-2 mb-2 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div className="font-bold text-lg text-gray-900 dark:text-white">Komposisi Harga Satuan</div>
              <button
                className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white text-2xl px-2 transition"
                onClick={() => setSelectedRow(null)}
                aria-label="Tutup"
              >
                &times;
              </button>
            </div>

            <div className="overflow-auto max-h-[calc(100vh-6rem)] rounded">
              <table className="w-full text-sm border-separate border-spacing-0">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-800">
                    <th className="px-2 py-2 border-b border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-semibold">Workcode</th>
                    <th className="px-2 py-2 border-b border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-semibold">Uraian</th>
                    <th className="px-2 py-2 border-b border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-semibold">Spesifikasi</th>
                    <th className="px-2 py-2 border-b border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-semibold">Satuan</th>
                    <th className="px-2 py-2 border-b border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-semibold">Harga Satuan</th>
                    <th className="px-2 py-2 border-b border-gray-200 dark:border-gray-700" />
                  </tr>
                </thead>
                <tbody>
                  {(selectedRow.composingPrices && selectedRow.composingPrices.length > 0) ? (
                    selectedRow.composingPrices.map((price, idx) => (
                      <tr key={idx} className="hover:bg-primary-50 dark:hover:bg-gray-800 transition">
                        <td className="px-2 py-2 border-b border-gray-100 dark:border-gray-800 text-gray-900 dark:text-gray-100">
                          {price.workcode ?? '-'}
                        </td>
                        <td className="px-2 py-2 border-b border-gray-100 dark:border-gray-800 text-gray-900 dark:text-gray-100">
                          {price.uraian ?? '-'}
                        </td>
                        <td className="px-2 py-2 border-b border-gray-100 dark:border-gray-800 text-gray-900 dark:text-gray-100">
                          {price.spesifikasi || price.specification || '-'}
                        </td>
                        <td className="px-2 py-2 border-b border-gray-100 dark:border-gray-800 text-gray-900 dark:text-gray-100">
                          {price.satuan ?? '-'}
                        </td>
                        <td className="px-2 py-2 border-b border-gray-100 dark:border-gray-800 text-right text-gray-900 dark:text-gray-100">
                          {Number(price.hargaSatuan || 0).toLocaleString()}
                        </td>
                        <td className="px-2 py-2 border-b border-gray-100 dark:border-gray-800 text-right">
                          <button
                            type="button"
                            className="bg-primary-600 hover:bg-primary-700 text-white px-3 py-1 rounded text-xs font-semibold shadow-sm transition"
                            onClick={() => handleSelectFromComposition(selectedRow, price)}
                          >
                            Pilih
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center text-gray-400 dark:text-gray-500 py-6">
                        Tidak ada komposisi.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailCreateProjectConstructionModal;