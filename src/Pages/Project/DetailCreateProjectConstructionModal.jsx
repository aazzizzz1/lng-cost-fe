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
  const { types = [], transport: { data = [], modalLoading } } = useSelector((state) => state.unitPrice);
  const search = modal.search || "";

  const [selectedType, setSelectedType] = useState("");

  useEffect(() => {
    dispatch(fetchTypes());
  }, [dispatch]);

  useEffect(() => {
    if (selectedType) {
      dispatch(fetchUnitPriceDataForModal({ tipe: selectedType, search }));
    }
  }, [dispatch, selectedType, search]);

  const modalColumns = [
    { key: "uraian", label: "Uraian" },
    { key: "spesifikasi", label: "Spesifikasi" },
    { key: "satuan", label: "Satuan" },
    { key: "hargaSatuan", label: "Harga Satuan" },
    { key: "lokasi", label: "Lokasi" },
    { key: "proyek", label: "Proyek" },
    { key: "tahun", label: "Tahun" },
  ];

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
    const hargaSatuanItem = row.hargaSatuan || 0;

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
        field: "uraian",
        value: row.uraian || "",
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
    dispatch(closeModal());
  };

  if (!modal.open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 transition-colors">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 max-w-2xl w-full p-4 transition-all duration-200">
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
        <div className="overflow-x-auto max-h-80 rounded">
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
                    key={row.id || idx}
                    className="hover:bg-primary-50 dark:hover:bg-gray-800 transition"
                  >
                    {modalColumns.map((col) => (
                      <td
                        key={col.key}
                        className="px-2 py-2 border-b border-gray-100 dark:border-gray-800 text-gray-900 dark:text-gray-100"
                      >
                        {row[col.key]}
                      </td>
                    ))}
                    <td className="px-2 py-2 border-b border-gray-100 dark:border-gray-800">
                      <button
                        type="button"
                        className="bg-primary-700 hover:bg-primary-800 text-white px-3 py-1 rounded text-xs font-semibold shadow-sm transition"
                        onClick={() => handleSelectFromModal(row)}
                      >
                        Pilih
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

export default DetailCreateProjectConstructionModal;