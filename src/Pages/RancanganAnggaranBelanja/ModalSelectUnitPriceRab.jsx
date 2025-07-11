import React, { useState } from "react";
import { useSelector } from "react-redux";

// Sumber data harga satuan
const dataSources = [
  { key: "liquifectionPlant", label: "Liquifection Plant" },
  { key: "transportasi", label: "Transportasi" },
  { key: "receivingTerminal", label: "Receiving Terminal" },
  { key: "materialAndPackage", label: "Material & Package" },
];

const jenisOptions = [
  "Onshore LNG Plant",
  "Offshore LNG Plant",
  "LNG Carrier",
  "LNG Trucking",
  "FSRU",
  "ORF",
  "OTS",
  "ORU",
];

const satuanByJenis = {
  "Onshore LNG Plant": "MTPA",
  "Offshore LNG Plant": "MTPA",
  "LNG Carrier": "m³",
  "LNGC": "m³",
  "LNG Trucking": "CBM",
  FSRU: "m³ / MMSCFD",
  ORF: "MMSCFD",
  OTS: "MMSCFD",
  ORU: "m³ / MMSCFD",
};

const ModalSelectUnitPriceRab = ({ onClose, onSubmit, rabData }) => {
  // Gunakan rabData jika ada
  const [step, setStep] = useState(rabData ? 2 : 1);

  // Form input RAB
  const [namaRab, setNamaRab] = useState(rabData?.namaRab || "");
  const [tahun, setTahun] = useState(rabData?.tahun || new Date().getFullYear());
  const [inflasi, setInflasi] = useState(rabData?.inflasi || "");
  const [lokasi, setLokasi] = useState(rabData?.lokasi || "");
  const [jenis, setJenis] = useState(rabData?.jenis || jenisOptions[0]);
  const [volume, setVolume] = useState(rabData?.volume || "");
  const [activeSource, setActiveSource] = useState(dataSources[0].key);
  const [search, setSearch] = useState("");

  // Data harga satuan dari redux
  const liquifectionPlantList = useSelector(state => state.liquifectionPlant.data || []);
  const transportasiList = useSelector(state => state.transport.data || []);
  const receivingTerminalList = useSelector(state => state.receivingTerminal.data || []);
  const materialAndPackageList = useSelector(state => state.materialAndPackage.packages || []);
  const provinces = useSelector(state => state.administrator.provinces || []);
  const inflasiList = useSelector(state => state.administrator.inflasi || []);

  // Ambil inflasi default dari redux
  React.useEffect(() => {
    if (tahun && inflasiList.length > 0) {
      const inf = inflasiList.find(i => Number(i.year) === Number(tahun));
      setInflasi(inf ? inf.value : "");
    }
  }, [tahun, inflasiList]);

  // Data dan kolom tabel
  let modalData = [];
  let modalColumns = [];
  if (activeSource === "liquifectionPlant") {
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

  // Handler pilih item
  const handleSelect = (row) => {
    // Penyesuaian harga satuan (tahun, lokasi, inflasi)
    const tahunProject = tahun;
    const lokasiProject = lokasi;
    const inflasiProject = Number(inflasi) || 5.0;
    const tahunItem = row.tahun || tahunProject;
    const lokasiItem = row.lokasi || lokasiProject;
    const hargaSatuanItem = row.hargaSatuan || row.harga || 0;
    // Rumus CCI
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
    const n = Number(tahunProject) - Number(tahunItem);
    const r = Number(inflasiProject) / 100;
    let hargaTahunProject = hargaSatuanItem;
    if (n > 0) {
      hargaTahunProject = hargaSatuanItem * Math.pow(1 + r, n);
    }
    // Step 2: Konversi ke harga benchmark (Banjarmasin)
    const cciItem = getCCI(lokasiItem);
    let hargaBanjarmasin = hargaTahunProject * (cciBanjarmasin / cciItem);
    // Step 3: Konversi ke lokasi project
    const cciProject = getCCI(lokasiProject);
    let hargaLokasiProject = hargaBanjarmasin * (cciProject / 100);

    onSubmit({
      uraian: row.uraian || row.nama || "",
      satuan: row.satuan || "",
      qty: row.qty || 1,
      hargaSatuan: Math.round(hargaLokasiProject),
      tahun: Number(tahunProject),
      lokasi: lokasiProject,
      jenis,
      volume,
      namaRab,
    });
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
                value={jenis}
                onChange={e => setJenis(e.target.value)}
                className="w-full border rounded px-2 py-1"
                required
              >
                {jenisOptions.map(j => (
                  <option key={j} value={j}>{j}</option>
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
                <span className="text-sm flex items-center">{satuanByJenis[jenis] || "-"}</span>
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
          <div className="font-bold text-lg text-gray-900 dark:text-white">
            Pilih Harga Satuan
          </div>
          <button
            className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white text-2xl px-2 transition"
            onClick={onClose}
            aria-label="Tutup"
          >
            &times;
          </button>
        </div>
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
          onChange={e => setSearch(e.target.value)}
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
                      onClick={() => handleSelect(row)}
                    >
                      Pilih
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-end mt-4">
          <button
            type="button"
            className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-1 rounded"
            onClick={() => setStep(1)}
          >
            Kembali
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalSelectUnitPriceRab
