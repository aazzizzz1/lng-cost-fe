import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setFilterJenis } from '../../Provider/Project/ConstractionCostSlice';
import {
  kelompokList,
  kelompokTemplates,
  defaultItem,
  setItems,
  updateItem,
  addItem,
  deleteItem,
  selectItems,
  openModal,
  closeModal,
  selectModal
} from '../../Provider/Project/detailCreateProjectConstructionSlice'
import DetailCreateProjectConstructionModal from './DetailCreateProjectConstructionModal'

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

// Tambahkan mapping khusus untuk LNGC
const kelompokListLNGC = [
  "Material & Equipment",
  "Construction and Installation",
  "Engineering & Management",
  "Testing & Commissioning",
  "General & Finalization"
];

const kelompokTemplatesLNGC = {
  "Material & Equipment": [
    { kode: "A", uraian: "HULL CONSTRUCTION & CONSUMABLE", isCategory: true },
    { kode: "A.1", uraian: "Plate & Profile" },
    { kode: "A.2", uraian: "Allowance plate & profile" },
    { kode: "A.3", uraian: "Electrode" },
    // ...tambahkan sub-item lain sesuai kebutuhan...
    { kode: "B", uraian: "SURFACE PROTECTION & PAINTING", isCategory: true },
    { kode: "B.1", uraian: "Sandblasting" },
    // ...dst...
  ],
  "Construction and Installation": [
    { kode: "C", uraian: "ROOM ACCOMODATION EQUIPMENT", isCategory: true },
    // ...tambahkan sub-item lain sesuai kebutuhan...
  ],
  "Engineering & Management": [
    { kode: "D", uraian: "SHIPYARD SERVICES", isCategory: true },
    // ...tambahkan sub-item lain sesuai kebutuhan...
  ],
  "Testing & Commissioning": [
    { kode: "E", uraian: "TESTING & COMMISSIONING", isCategory: true },
    // ...tambahkan sub-item lain sesuai kebutuhan...
  ],
  "General & Finalization": [
    { kode: "F", uraian: "THIRD PARTY SERVICES", isCategory: true },
    // ...tambahkan sub-item lain sesuai kebutuhan...
  ]
};

const DetailCreateProjectConstruction = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const projects = useSelector(state => state.projects.projects);
  const project = projects.find(p => String(p.id) === String(id));
  const items = useSelector(selectItems);
  const modal = useSelector(selectModal);
  const costs = useSelector(state => state.constractionCost.costs);

  // Gunakan kelompokList dan kelompokTemplates sesuai jenis project
  const isLNGC = project?.jenis === "LNGC" || project?.jenis === "LNG Carrier";
  const kelompokListUsed = isLNGC ? kelompokListLNGC : kelompokList;
  const kelompokTemplatesUsed = isLNGC ? kelompokTemplatesLNGC : kelompokTemplates;

  // Generate initial items per kelompok (hanya saat mount)
  useEffect(() => {
    if ((!items || items.length === 0) && project) {
      const initialItems = kelompokListUsed.flatMap(kelompok =>
        (kelompokTemplatesUsed[kelompok] || []).map(t =>
          defaultItem(
            t.kode,
            t.uraian,
            kelompok,
            project?.tahun,
            project?.name,
            project?.lokasi,
            project?.jenis,
            t.isCategory || false
          )
        )
      );
      dispatch(setItems(initialItems));
    }
  }, [dispatch, items, project, kelompokListUsed, kelompokTemplatesUsed]);

  // Handler untuk field
  const handleItemChange = (idx, field, value) => {
    // If qty or hargaSatuan, update totalHarga as well
    if (field === "qty" || field === "hargaSatuan") {
      const item = items[idx];
      const qty = field === "qty" ? parseFloat(value) : parseFloat(item.qty || 1);
      const hargaSatuan = field === "hargaSatuan" ? parseFloat(value) : parseFloat(item.hargaSatuan || 0);
      dispatch(updateItem({ idx, field, value }));
      dispatch(updateItem({ idx, field: "totalHarga", value: qty * hargaSatuan }));
    } else {
      dispatch(updateItem({ idx, field, value }));
    }
  };

  // Tambah item pada kelompok tertentu
  const handleAddItem = (kelompok) => {
    const kelompokItems = items.filter(item => item.kelompok === kelompok && !item.isCategory);
    // Gunakan kelompokTemplatesUsed, bukan kelompokTemplates
    const templates = kelompokTemplatesUsed[kelompok] || [];
    let lastKode = kelompokItems.length > 0
      ? kelompokItems[kelompokItems.length - 1].kode
      : (templates.find(t => t.isCategory)?.kode || "");
    let base = typeof lastKode === "string" && lastKode.includes('.') ? lastKode.split('.')[0] : lastKode;
    let nextNum = kelompokItems.length + 1;
    let newKode = base ? `${base}.${nextNum}` : `${kelompok}.${nextNum}`;
    dispatch(addItem(
      defaultItem(
        newKode,
        "",
        kelompok,
        project?.tahun,
        project?.name,
        project?.lokasi,
        project?.jenis
      )
    ));
  };

  // Hapus item (tidak boleh hapus kategori utama)
  const handleDeleteItem = (idx) => {
    dispatch(deleteItem(idx));
  };

  // Simpan ke dummy construction cost slice
  const handleSave = () => {
    const itemsWithId = items
      .filter(item => !item.isCategory || item.hargaSatuan > 0 || item.uraian)
      .map((item) => ({
        ...item,
        // id akan diisi oleh reducer agar unik
        accuracyLow: -15,
        accuracyHigh: 20,
        infrastruktur: project?.kategori || "",
        volume: "",
        satuanVolume: "",
        kapasitasRegasifikasi: "",
        satuanKapasitas: "",
        tipe: project?.jenis || "",
        proyek: project?.name || "",
        tahun: project?.tahun,
        lokasi: project?.lokasi,
        projectId: project?.id, // Pastikan projectId ikut
      }));
    dispatch({
      type: 'constractionCost/addProjectCosts',
      payload: itemsWithId,
    });
    dispatch(setFilterJenis({ tipe: project?.jenis, proyek: project?.name }));
    navigate('/construction-cost');
  };

  // Group items by kelompok
  const grouped = kelompokListUsed.reduce((acc, kelompok) => {
    acc[kelompok] = items.filter(item => item.kelompok === kelompok);
    return acc;
  }, {});

  // Ambil data material, jasa, package, dan transport dari redux
  const materialList = useSelector(state => state.material.dataMaterial || []);
  const jasaList = useSelector(state => state.jasa.jasa || []);
  const packageList = useSelector(state => state.materialAndPackage.packages || []);
  const transportList = useSelector(state => state.transport.data || []);
  const provinces = useSelector(state => state.administrator.provinces || []);
  const inflasiList = useSelector(state => state.administrator.inflasi || []);

  // Tambahan: data sumber lain
  const liquifectionPlantList = useSelector(state => state.liquifectionPlant.data || []);
  const transportasiList = useSelector(state => state.transport.data || []);
  const receivingTerminalList = useSelector(state => state.receivingTerminal.data || []);
  const materialAndPackageList = useSelector(state => state.materialAndPackage.packages || []);

  // Handler untuk buka modal, dipanggil dari tombol di tabel
  const handleOpenModal = (type, idx) => {
    dispatch(openModal({ type, itemIdx: idx, search: "" }));
  };
  const handleCloseModal = () => {
    dispatch(closeModal());
  };

  // Ambil inflasi dari inflasiList
  const inflasi = (() => {
    if (!project?.tahun) return "";
    const inf = inflasiList.find(i => Number(i.year) === Number(project.tahun));
    return inf ? inf.value : "";
  })();

  // --- REKOMENDASI VOLUME TERDEKAT (lebih kecil) ---
  // Cek jika items kosong dan project ada volume
  let rekomendasiVolume = null;
  if (items.length === 0 && project?.volume) {
    const summaryJenis = (() => {
      if (project.jenis.toLowerCase().includes("fsru")) return "FSRU";
      if (project.jenis.toLowerCase().includes("plant")) return "LNG Plant";
      if (project.jenis.toLowerCase().includes("carrier")) return "LNGC";
      return project.jenis;
    })();
    // Cari cost dengan volume persis
    let matchedCosts = costs.filter(
      (item) =>
        String(item.tipe).toLowerCase() === String(summaryJenis).toLowerCase() &&
        Number(item.volume) === Number(project.volume)
    );
    // Jika tidak ada, cari volume terbesar yang lebih kecil
    if (matchedCosts.length === 0) {
      const candidates = costs.filter(
        (item) =>
          String(item.tipe).toLowerCase() === String(summaryJenis).toLowerCase() &&
          Number(item.volume) < Number(project.volume)
      );
      if (candidates.length > 0) {
        const maxVolume = Math.max(...candidates.map((item) => Number(item.volume)));
        matchedCosts = candidates.filter((item) => Number(item.volume) === maxVolume);
        if (matchedCosts.length > 0) {
          rekomendasiVolume = maxVolume;
        }
      }
    }
  }

  return (
    <div className="p-4">
      {/* text gambaran umum judul */}
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        Gambaran Umum Project
      </h1>
      {/* Gambaran Umum Project */}
      <div className="mb-6 bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Nama Project</div>
            <div className="font-semibold text-gray-900 dark:text-white">{project?.name || "-"}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Jenis</div>
            <div className="font-semibold text-gray-900 dark:text-white">{project?.jenis || "-"}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Volume</div>
            <div className="font-semibold text-gray-900 dark:text-white">
              {project?.volume ? project.volume : "-"} <span className="text-xs">{satuanByJenis[project?.jenis] || "-"}</span>
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Kategori</div>
            <div className="font-semibold text-gray-900 dark:text-white">{project?.kategori || "-"}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Lokasi</div>
            <div className="font-semibold text-gray-900 dark:text-white">{project?.lokasi || "-"}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Tahun</div>
            <div className="font-semibold text-gray-900 dark:text-white">{project?.tahun || "-"}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Asumsi Inflasi (%)</div>
            <div className="font-semibold text-gray-900 dark:text-white">{inflasi !== "" ? inflasi : "-"}</div>
          </div>
        </div>
      </div>
      {/* END Gambaran Umum Project */}
      <form
        onSubmit={e => {
          e.preventDefault();
          handleSave();
        }}
      >
        {/* Rekomendasi volume terdekat */}
        {rekomendasiVolume && (
          <div className="mb-4 p-3 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 rounded">
            <div>
              <b>Rekomendasi:</b> Tidak ditemukan data volume {project.volume} di database. 
              Menampilkan rekomendasi berdasarkan volume terbesar yang lebih kecil: <b>{rekomendasiVolume}</b>.
            </div>
          </div>
        )}
        {kelompokListUsed.map((kelompok, kidx) => (
          <div key={kelompok} className="mb-8">
            <div className="text-lg font-bold mb-2 text-primary-700 dark:text-primary-300 uppercase tracking-wide">{kelompok}</div>
            <div className="overflow-x-auto">
              <table className="w-full mb-2 border dark:border-gray-700 bg-white dark:bg-gray-900 rounded">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-800">
                    <th className="px-2 py-2 border dark:border-gray-700 w-20 text-gray-900 dark:text-white">Kode</th>
                    <th className="px-2 py-2 border dark:border-gray-700 text-gray-900 dark:text-white">Uraian</th>
                    <th className="px-2 py-2 border dark:border-gray-700 w-20 text-gray-900 dark:text-white">Satuan</th>
                    <th className="px-2 py-2 border dark:border-gray-700 w-16 text-gray-900 dark:text-white">Qty</th>
                    <th className="px-2 py-2 border dark:border-gray-700 w-32 text-gray-900 dark:text-white">Harga Satuan</th>
                    <th className="px-2 py-2 border dark:border-gray-700 w-32 text-gray-900 dark:text-white">Total Harga</th>
                    <th className="px-2 py-2 border dark:border-gray-700 w-20 text-gray-900 dark:text-white">AACE Class</th>
                    <th className="px-2 py-2 border dark:border-gray-700 w-32 text-gray-900 dark:text-white">Ambil Harga</th>
                    <th className="px-2 py-2 border dark:border-gray-700 w-16">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {grouped[kelompok].map((item, idx) => {
                    const absIdx = items.findIndex(
                      (it) => it === item
                    );
                    return (
                      <tr key={absIdx} className={item.isCategory ? "bg-gray-50 dark:bg-gray-800 font-semibold" : "bg-white dark:bg-gray-900"}>
                        <td className="border dark:border-gray-700 px-2 py-1 align-top text-gray-900 dark:text-white">{item.kode}</td>
                        <td className="border dark:border-gray-700 px-2 py-1 align-top text-gray-900 dark:text-white">
                          {item.isCategory ? (
                            item.uraian
                          ) : (
                            <input
                              type="text"
                              value={item.uraian}
                              onChange={e => handleItemChange(absIdx, "uraian", e.target.value)}
                              className="w-full bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none text-gray-900 dark:text-white"
                              placeholder="Sub Uraian"
                              required
                            />
                          )}
                        </td>
                        <td className="border dark:border-gray-700 px-2 py-1 align-top">
                          {item.isCategory ? (
                            ""
                          ) : (
                            <input
                              type="text"
                              value={item.satuan}
                              onChange={e => handleItemChange(absIdx, "satuan", e.target.value)}
                              className="w-full bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none text-gray-900 dark:text-white"
                            />
                          )}
                        </td>
                        <td className="border dark:border-gray-700 px-2 py-1 align-top">
                          {item.isCategory ? (
                            ""
                          ) : (
                            <input
                              type="number"
                              min={1}
                              step="any"
                              value={item.qty}
                              onChange={e => handleItemChange(absIdx, "qty", e.target.value)}
                              className="w-full bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none text-gray-900 dark:text-white"
                            />
                          )}
                        </td>
                        <td className="border dark:border-gray-700 px-2 py-1 align-top">
                          {item.isCategory ? (
                            ""
                          ) : (
                            <input
                              type="number"
                              min={0}
                              step="any"
                              value={item.hargaSatuan}
                              onChange={e => handleItemChange(absIdx, "hargaSatuan", e.target.value)}
                              className="w-full bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none text-gray-900 dark:text-white"
                            />
                          )}
                        </td>
                        <td className="border dark:border-gray-700 px-2 py-1 align-top text-right text-gray-900 dark:text-white">
                          {item.isCategory
                            ? ""
                            : `Rp${Number(item.totalHarga || 0).toLocaleString()}`}
                        </td>
                        <td className="border dark:border-gray-700 px-2 py-1 align-top">
                          {item.isCategory ? (
                            ""
                          ) : (
                            <input
                              type="number"
                              min={1}
                              max={5}
                              value={item.aaceClass}
                              onChange={e => handleItemChange(absIdx, "aaceClass", e.target.value)}
                              className="w-full bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none text-gray-900 dark:text-white"
                            />
                          )}
                        </td>
                        <td className="border dark:border-gray-700 px-2 py-1 align-top">
                          {!item.isCategory && (
                            <button
                              type="button"
                              className="flex items-center gap-1 bg-primary-700 hover:bg-primary-800 text-white px-2 py-1 rounded text-xs"
                              onClick={() => handleOpenModal("material", absIdx)}
                              title="Ambil dari Harga Satuan"
                            >
                              {/* Icon database */}
                              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <ellipse cx="12" cy="6" rx="8" ry="3" stroke="currentColor" strokeWidth="2" fill="none"/>
                                <path d="M4 6v6c0 1.657 3.582 3 8 3s8-1.343 8-3V6" stroke="currentColor" strokeWidth="2" fill="none"/>
                                <path d="M4 12v6c0 1.657 3.582 3 8 3s8-1.343 8-3v-6" stroke="currentColor" strokeWidth="2" fill="none"/>
                              </svg>
                              Ambil dari Harga Satuan
                            </button>
                          )}
                        </td>
                        <td className="border dark:border-gray-700 px-2 py-1 align-top">
                          {!item.isCategory && (
                            <button
                              type="button"
                              className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs ml-1"
                              onClick={() => handleDeleteItem(absIdx)}
                              title="Hapus Item"
                            >
                              Hapus
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <button
              type="button"
              className="bg-primary-700 hover:bg-primary-800 text-white px-3 py-1 rounded mb-2"
              onClick={() => handleAddItem(kelompok)}
            >
              Tambah Item {kelompok}
            </button>
          </div>
        ))}
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            className="bg-primary-700 hover:bg-primary-800 text-white px-6 py-2 rounded font-semibold"
          >
            Simpan & Lihat Detail Construction Cost
          </button>
        </div>
      </form>
      {/* Modal Pilih Harga Satuan */}
      <DetailCreateProjectConstructionModal
        modal={modal}
        items={items}
        project={project}
        materialList={materialList}
        jasaList={jasaList}
        packageList={packageList}
        transportList={transportList}
        provinces={provinces}
        inflasiList={inflasiList}
        liquifectionPlantList={liquifectionPlantList}
        transportasiList={transportasiList}
        receivingTerminalList={receivingTerminalList}
        materialAndPackageList={materialAndPackageList}
        onClose={handleCloseModal}
        dispatch={dispatch}
      />
    </div>
  );
};

export default DetailCreateProjectConstruction