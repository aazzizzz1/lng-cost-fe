import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateItem,
  closeModal,
  selectModal,
  selectItems,
  setModalSearch,
} from "../../Provider/Project/detailCreateProjectConstructionSlice";

const DetailCreateProjectConstructionModal = ({
  project,
  materialList,
  jasaList,
  packageList,
  transportList,
  provinces,
  inflasiList,
  liquifectionPlantList = [],
  transportasiList = [],
  receivingTerminalList = [],
  materialAndPackageList = [],
}) => {
  const dispatch = useDispatch();
  const modal = useSelector(selectModal);
  const items = useSelector(selectItems);
  const search = modal.search || "";

  // Sumber data yang bisa dipilih
  const dataSources = [
    { key: "liquifectionPlant", label: "Liquifection Plant" },
    { key: "transportasi", label: "Transportasi" },
    { key: "receivingTerminal", label: "Receiving Terminal" },
    { key: "materialAndPackage", label: "Material & Package" },
  ];

  // State untuk sumber data aktif
  const [activeSource, setActiveSource] = useState(modal.type || "material");

  // Logic untuk filter data dan columns
  let modalData = [];
  let modalColumns = [];
  if (activeSource === "material") {
    modalData = materialList.filter((m) =>
      (m.uraian || "").toLowerCase().includes(search.toLowerCase())
    );
    modalColumns = [
      { key: "uraian", label: "Uraian" },
      { key: "satuan", label: "Satuan" },
      { key: "hargaSatuan", label: "Harga Satuan" },
      { key: "tahun", label: "Tahun" },
      { key: "proyek", label: "Proyek" },
    ];
  } else if (activeSource === "jasa") {
    modalData = jasaList.filter((j) =>
      (j.nama || "").toLowerCase().includes(search.toLowerCase())
    );
    modalColumns = [
      { key: "nama", label: "Nama Jasa" },
      { key: "satuan", label: "Satuan" },
      { key: "harga", label: "Harga Satuan" },
      { key: "kategori", label: "Kategori" },
    ];
  } else if (activeSource === "package") {
    modalData = packageList.filter((p) =>
      (p.uraian || "").toLowerCase().includes(search.toLowerCase())
    );
    modalColumns = [
      { key: "uraian", label: "Uraian" },
      { key: "spesifikasi", label: "Spesifikasi" },
      { key: "satuan", label: "Satuan" },
      { key: "hargaSatuan", label: "Harga Satuan" },
      { key: "tahun", label: "Tahun" },
    ];
  } else if (activeSource === "transport") {
    modalData = transportList.filter((t) =>
      (t.uraian || "").toLowerCase().includes(search.toLowerCase())
    );
    modalColumns = [
      { key: "uraian", label: "Uraian" },
      { key: "kategori", label: "Kategori" },
      { key: "satuan", label: "Satuan" },
      { key: "hargaSatuan", label: "Harga Satuan" },
      { key: "tipe", label: "Tipe" },
      { key: "tahun", label: "Tahun" },
      { key: "proyek", label: "Proyek" },
    ];
  } else if (activeSource === "liquifectionPlant") {
    modalData = liquifectionPlantList.filter((m) =>
      (m.uraian || "").toLowerCase().includes(search.toLowerCase())
    );
    modalColumns = [
      { key: "uraian", label: "Uraian" },
      { key: "satuan", label: "Satuan" },
      { key: "hargaSatuan", label: "Harga Satuan" },
      { key: "tahun", label: "Tahun" },
      { key: "proyek", label: "Proyek" },
      { key: "tipe", label: "Tipe" },
      { key: "kategori", label: "Kategori" },
    ];
  } else if (activeSource === "transportasi") {
    modalData = transportasiList.filter((m) =>
      (m.uraian || "").toLowerCase().includes(search.toLowerCase())
    );
    modalColumns = [
      { key: "uraian", label: "Uraian" },
      { key: "satuan", label: "Satuan" },
      { key: "hargaSatuan", label: "Harga Satuan" },
      { key: "tahun", label: "Tahun" },
      { key: "proyek", label: "Proyek" },
      { key: "tipe", label: "Tipe" },
      { key: "kategori", label: "Kategori" },
    ];
  } else if (activeSource === "receivingTerminal") {
    modalData = receivingTerminalList.filter((m) =>
      (m.uraian || "").toLowerCase().includes(search.toLowerCase())
    );
    modalColumns = [
      { key: "uraian", label: "Uraian" },
      { key: "satuan", label: "Satuan" },
      { key: "hargaSatuan", label: "Harga Satuan" },
      { key: "tahun", label: "Tahun" },
      { key: "proyek", label: "Proyek" },
      { key: "tipe", label: "Tipe" },
      { key: "kategori", label: "Kategori" },
    ];
  } else if (activeSource === "materialAndPackage") {
    modalData = materialAndPackageList.filter((m) =>
      (m.uraian || "").toLowerCase().includes(search.toLowerCase())
    );
    modalColumns = [
      { key: "uraian", label: "Uraian" },
      { key: "spesifikasi", label: "Spesifikasi" },
      { key: "satuan", label: "Satuan" },
      { key: "hargaSatuan", label: "Harga Satuan" },
      { key: "tahun", label: "Tahun" },
      { key: "proyek", label: "Proyek" },
      { key: "jenis", label: "Jenis" },
    ];
  }

  // Logic untuk select dari modal
  const handleSelectFromModal = (row) => {
    const tahunProject = project?.tahun;
    const lokasiProject = project?.lokasi;
    const inflasiProject = (() => {
      const inf = inflasiList.find(
        (i) => Number(i.year) === Number(tahunProject)
      );
      return inf ? inf.value : 5.0;
    })();
    const tahunItem = row.tahun || tahunProject;
    const lokasiItem = row.lokasi || lokasiProject;
    const hargaSatuanItem = row.hargaSatuan || row.harga || 0;
    // Rumus harga satuan:
    const getCCI = (nama) => {
      const prov = provinces.find((p) => p.name === nama);
      return prov ? prov.cci : 100;
    };
    const cciBanjarmasin = (() => {
      const prov = provinces.find(
        (p) => p.name.toLowerCase().includes("banjar") && p.cci === 100.7
      );
      return prov ? prov.cci : 100;
    })();
    // Step 1: Update harga ke tahun project
    // 1. Update harga ke tahun project: hargaTahunProject = hargaSatuanItem * (1 + r)^n
    //    n = selisih tahun project dan tahun item, r = inflasi (%)
    const n = Number(tahunProject) - Number(tahunItem);
    const r = Number(inflasiProject) / 100;
    let hargaTahunProject = hargaSatuanItem;
    if (n > 0) {
      hargaTahunProject = hargaSatuanItem * Math.pow(1 + r, n);
    }
    // Step 2: Konversi ke harga benchmark (Banjarmasin)
    // 2. Konversi ke harga benchmark (Banjarmasin): hargaBanjarmasin = hargaTahunProject * (cciBanjarmasin / cciItem)
    const cciItem = getCCI(lokasiItem);
    let hargaBanjarmasin = hargaTahunProject * (cciBanjarmasin / cciItem);
    // Step 3: Konversi ke lokasi project
    // 3. Konversi ke lokasi project: hargaLokasiProject = hargaBanjarmasin * (cciProject / 100)
    const cciProject = getCCI(lokasiProject);
    let hargaLokasiProject = hargaBanjarmasin * (cciProject / 100);

    dispatch(
      updateItem({
        idx: modal.itemIdx,
        field: "uraian",
        value: row.uraian || row.nama || "",
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
    // PATCH: update totalHarga after hargaSatuan and qty
    const qty = items[modal.itemIdx]?.qty || 1;
    dispatch(
      updateItem({
        idx: modal.itemIdx,
        field: "totalHarga",
        value: qty * Math.round(hargaLokasiProject),
      })
    );
    dispatch(
      updateItem({
        idx: modal.itemIdx,
        field: "aaceClass",
        value: Math.max(1, Math.min(5, parseInt(row.aaceClass) || 5)),
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
        {/* Pilihan sumber data */}
        <div className="flex flex-wrap gap-2 mb-3">
          {dataSources.map((ds) => (
            <button
              key={ds.key}
              type="button"
              className={`px-3 py-1 rounded text-xs font-semibold border transition ${
                activeSource === ds.key
                  ? "bg-primary-700 text-white border-primary-700"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600"
              }`}
              onClick={() => setActiveSource(ds.key)}
            >
              {ds.label}
            </button>
          ))}
        </div>
        <input
          type="text"
          className="w-full mb-3 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500 transition"
          placeholder="Cari..."
          value={search}
          onChange={(e) => dispatch(setModalSearch(e.target.value))}
          autoFocus
        />
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
              {modalData.length === 0 && (
                <tr>
                  <td
                    colSpan={modalColumns.length + 1}
                    className="text-center text-gray-400 dark:text-gray-500 py-6"
                  >
                    Tidak ada data.
                  </td>
                </tr>
              )}
              {modalData.map((row, idx) => (
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DetailCreateProjectConstructionModal;
