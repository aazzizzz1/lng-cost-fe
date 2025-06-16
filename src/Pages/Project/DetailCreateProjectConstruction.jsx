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
    </div>
  );
};

export default DetailCreateProjectConstruction