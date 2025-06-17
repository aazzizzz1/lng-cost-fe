import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setFilterJenis } from '../../Provider/ConstractionCostSlice'

const kelompokList = [
  "PROJECT MANAGEMENT DAN PEKERJAAN PERSIAPAN",
  "SUPPORTING WORK",
  "PENYEDIAAN MATERIAL",
  "PEKERJAAN PEMASANGAN DAN PENGUJIAN",
  "PEKERJAAN KHUSUS/FINISHING",
  "PEKERJAAN DOKUMENTASI",
  "PEKERJAAN COMMISSIONING & TRIAL OPERATION"
];

// Template kode dan uraian per kelompok
const kelompokTemplates = {
  "PROJECT MANAGEMENT DAN PEKERJAAN PERSIAPAN": [
    { kode: "A", uraian: "PREPARATION", isCategory: true },
    { kode: "A.1", uraian: "PROJECT MANAGEMENT EPCC" },
    { kode: "A.2", uraian: "PROJECT FACILITY" },
    { kode: "A.3", uraian: "WORK PERMIT" }
  ],
  "SUPPORTING WORK": [
    { kode: "B", uraian: "SUPPORTING WORK", isCategory: true },
    { kode: "B.1", uraian: "ENGINEERING WORK" },
    { kode: "B.2", uraian: "PROCUREMENT & CONSTRUCTION" }
  ],
  "PENYEDIAAN MATERIAL": [
    { kode: "C", uraian: "PENYEDIAAN MATERIAL", isCategory: true },
    { kode: "C.1", uraian: "MATERIAL UTAMA" },
    { kode: "C.2", uraian: "MATERIAL PENDUKUNG" }
  ],
  "PEKERJAAN PEMASANGAN DAN PENGUJIAN": [
    { kode: "D", uraian: "PEMASANGAN DAN PENGUJIAN", isCategory: true },
    { kode: "D.1", uraian: "INSTALASI" },
    { kode: "D.2", uraian: "PENGUJIAN" }
  ],
  "PEKERJAAN KHUSUS/FINISHING": [
    { kode: "E", uraian: "KHUSUS/FINISHING", isCategory: true },
    { kode: "E.1", uraian: "FINISHING" }
  ],
  "PEKERJAAN DOKUMENTASI": [
    { kode: "F", uraian: "DOKUMENTASI", isCategory: true },
    { kode: "F.1", uraian: "LAPORAN" }
  ],
  "PEKERJAAN COMMISSIONING & TRIAL OPERATION": [
    { kode: "G", uraian: "COMMISSIONING & TRIAL OPERATION", isCategory: true },
    { kode: "G.1", uraian: "COMMISSIONING" }
  ]
};

const defaultItem = (kode, uraian, kelompok, tahun, proyek, lokasi, tipe, isCategory = false) => ({
  kode,
  uraian,
  satuan: "",
  qty: 1,
  hargaSatuan: 0,
  totalHarga: 0,
  kelompok,
  tahun,
  proyek,
  lokasi,
  tipe,
  isCategory
});

const DetailCreateProjectConstruction = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const projects = useSelector(state => state.projects.projects);
  const project = projects.find(p => String(p.id) === String(id));

  // Generate initial items per kelompok
  const initialItems = kelompokList.flatMap(kelompok =>
    (kelompokTemplates[kelompok] || []).map(t =>
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

  const [items, setItems] = useState(initialItems);

  // Handler untuk field
  const handleItemChange = (idx, field, value) => {
    setItems(items.map((item, i) =>
      i === idx
        ? {
            ...item,
            [field]: field === "qty" || field === "hargaSatuan" ? Number(value) : value,
            totalHarga:
              field === "qty"
                ? Number(value) * item.hargaSatuan
                : field === "hargaSatuan"
                ? item.qty * Number(value)
                : item.qty * item.hargaSatuan,
          }
        : item
    ));
  };

  // Tambah item pada kelompok tertentu
  const handleAddItem = (kelompok) => {
    // Cari kode terakhir pada kelompok, buat kode baru
    const kelompokItems = items.filter(item => item.kelompok === kelompok && !item.isCategory);
    let lastKode = kelompokItems.length > 0
      ? kelompokItems[kelompokItems.length - 1].kode
      : kelompokTemplates[kelompok].find(t => t.isCategory)?.kode || "";
    let base = lastKode.split('.')[0];
    let nextNum = kelompokItems.length + 1;
    let newKode = `${base}.${nextNum}`;
    setItems([
      ...items,
      defaultItem(
        newKode,
        "",
        kelompok,
        project?.tahun,
        project?.name,
        project?.lokasi,
        project?.jenis
      )
    ]);
  };

  // Hapus item (tidak boleh hapus kategori utama)
  const handleDeleteItem = (idx) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  // Simpan ke dummy construction cost slice
  const handleSave = () => {
    const itemsWithId = items
      .filter(item => !item.isCategory || item.hargaSatuan > 0 || item.uraian)
      .map((item, idx) => ({
        ...item,
        id: Date.now() + idx,
        aaceClass: project?.levelAACE || 4,
        accuracyLow: -15,
        accuracyHigh: 20,
        infrastruktur: project?.kategori || "",
        volume: "",
        satuanVolume: "",
        kapasitasRegasifikasi: "",
        satuanKapasitas: "",
        tipe: project?.jenis || "",
      }));
    dispatch({
      type: 'constractionCost/addProjectCosts',
      payload: itemsWithId,
    });
    dispatch(setFilterJenis(project?.jenis));
    navigate('/construction-cost');
  };

  // Group items by kelompok
  const grouped = kelompokList.reduce((acc, kelompok) => {
    acc[kelompok] = items.filter(item => item.kelompok === kelompok);
    return acc;
  }, {});

  // Ambil data material, jasa, dan package dari redux
  const materialList = useSelector(state => state.material.dataMaterial || []);
  const jasaList = useSelector(state => state.jasa.jasa || []);
  const packageList = useSelector(state => state.materialAndPackage.packages || []);

  // State untuk modal ambil harga satuan
  const [modal, setModal] = useState({
    open: false,
    type: null, // 'material' | 'jasa' | 'package'
    itemIdx: null,
    search: "",
  });

  // Handler buka modal
  const handleOpenModal = (type, idx) => {
    setModal({ open: true, type, itemIdx: idx, search: "" });
  };
  // Handler tutup modal
  const handleCloseModal = () => {
    setModal({ open: false, type: null, itemIdx: null, search: "" });
  };

  // Handler pilih data dari modal
  const handleSelectFromModal = (row) => {
    setItems(items.map((item, i) =>
      i === modal.itemIdx
        ? {
            ...item,
            uraian: row.uraian || row.nama || "",
            satuan: row.satuan || row.satuan || "",
            hargaSatuan: row.hargaSatuan || row.harga || 0,
            // qty tetap, totalHarga update
            totalHarga: item.qty * (row.hargaSatuan || row.harga || 0),
          }
        : item
    ));
    handleCloseModal();
  };

  // Data dan kolom untuk modal
  let modalData = [];
  let modalColumns = [];
  if (modal.type === "material") {
    modalData = materialList.filter(m =>
      m.uraian.toLowerCase().includes(modal.search.toLowerCase())
    );
    modalColumns = [
      { key: "uraian", label: "Uraian" },
      { key: "satuan", label: "Satuan" },
      { key: "hargaSatuan", label: "Harga Satuan" },
      { key: "tahun", label: "Tahun" },
      { key: "proyek", label: "Proyek" },
    ];
  } else if (modal.type === "jasa") {
    modalData = jasaList.filter(j =>
      j.nama.toLowerCase().includes(modal.search.toLowerCase())
    );
    modalColumns = [
      { key: "nama", label: "Nama Jasa" },
      { key: "satuan", label: "Satuan" },
      { key: "harga", label: "Harga Satuan" },
      { key: "kategori", label: "Kategori" },
    ];
  } else if (modal.type === "package") {
    modalData = packageList.filter(p =>
      p.uraian.toLowerCase().includes(modal.search.toLowerCase())
    );
    modalColumns = [
      { key: "uraian", label: "Uraian" },
      { key: "spesifikasi", label: "Spesifikasi" },
      { key: "satuan", label: "Satuan" },
      { key: "hargaSatuan", label: "Harga Satuan" },
      { key: "tahun", label: "Tahun" },
    ];
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
        Input Detail Construction Cost untuk Project: {project?.name}
      </h2>
      <form
        onSubmit={e => {
          e.preventDefault();
          handleSave();
        }}
      >
        {kelompokList.map((kelompok, kidx) => (
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
                    <th className="px-2 py-2 border dark:border-gray-700 w-16"></th>
                    <th className="px-2 py-2 border dark:border-gray-700 w-32 text-gray-900 dark:text-white">Ambil Harga</th>
                  </tr>
                </thead>
                <tbody>
                  {grouped[kelompok].map((item, idx) => {
                    const absIdx = items.findIndex(
                      (it) => it === item
                    );
                    return (
                      <tr
                        key={absIdx}
                        className={item.isCategory
                          ? "bg-gray-50 dark:bg-gray-800 font-semibold"
                          : "bg-white dark:bg-gray-900"}
                      >
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
                        <td className="border dark:border-gray-700 px-2 py-1 align-top">
                          {!item.isCategory && (
                            <div className="flex flex-col gap-1">
                              <button
                                type="button"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs mb-1"
                                onClick={() => handleOpenModal("material", absIdx)}
                              >
                                Ambil dari Material
                              </button>
                              <button
                                type="button"
                                className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs mb-1"
                                onClick={() => handleOpenModal("jasa", absIdx)}
                              >
                                Ambil dari Jasa
                              </button>
                              <button
                                type="button"
                                className="bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 rounded text-xs"
                                onClick={() => handleOpenModal("package", absIdx)}
                              >
                                Ambil dari Package
                              </button>
                            </div>
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
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 transition-colors">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 max-w-2xl w-full p-4 transition-all duration-200">
            <div className="flex justify-between items-center mb-2 border-b border-gray-200 dark:border-gray-700 pb-2">
              <div className="font-bold text-lg text-gray-900 dark:text-white">
                Pilih {modal.type === "material" ? "Material" : modal.type === "jasa" ? "Jasa" : "Package"}
              </div>
              <button
                className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white text-2xl px-2 transition"
                onClick={handleCloseModal}
                aria-label="Tutup"
              >
                &times;
              </button>
            </div>
            <input
              type="text"
              className="w-full mb-3 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500 transition"
              placeholder="Cari..."
              value={modal.search}
              onChange={e => setModal({ ...modal, search: e.target.value })}
              autoFocus
            />
            <div className="overflow-x-auto max-h-80 rounded">
              <table className="w-full text-sm border-separate border-spacing-0">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-800">
                    {modalColumns.map(col => (
                      <th key={col.key} className="px-2 py-2 border-b border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-semibold sticky top-0 z-10 bg-inherit">
                        {col.label}
                      </th>
                    ))}
                    <th className="px-2 py-2 border-b border-gray-200 dark:border-gray-700"></th>
                  </tr>
                </thead>
                <tbody>
                  {modalData.length === 0 && (
                    <tr>
                      <td colSpan={modalColumns.length + 1} className="text-center text-gray-400 dark:text-gray-500 py-6">
                        Tidak ada data.
                      </td>
                    </tr>
                  )}
                  {modalData.map((row, idx) => (
                    <tr
                      key={row.id || idx}
                      className="hover:bg-primary-50 dark:hover:bg-gray-800 transition"
                    >
                      {modalColumns.map(col => (
                        <td key={col.key} className="px-2 py-2 border-b border-gray-100 dark:border-gray-800 text-gray-900 dark:text-gray-100">
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
      )}
    </div>
  );
};

export default DetailCreateProjectConstruction