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

const DetailCreateProjectConstruction = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const projects = useSelector(state => state.projects.projects);
  const project = projects.find(p => String(p.id) === String(id));
  const items = useSelector(selectItems);
  const modal = useSelector(selectModal);

  // Generate initial items per kelompok (hanya saat mount)
  useEffect(() => {
    if ((!items || items.length === 0) && project) {
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
      dispatch(setItems(initialItems));
    }
  }, [dispatch, items, project]);

  // Handler untuk field
  const handleItemChange = (idx, field, value) => {
    dispatch(updateItem({ idx, field, value }));
  };

  // Tambah item pada kelompok tertentu
  const handleAddItem = (kelompok) => {
    const kelompokItems = items.filter(item => item.kelompok === kelompok && !item.isCategory);
    let lastKode = kelompokItems.length > 0
      ? kelompokItems[kelompokItems.length - 1].kode
      : kelompokTemplates[kelompok].find(t => t.isCategory)?.kode || "";
    let base = lastKode.split('.')[0];
    let nextNum = kelompokItems.length + 1;
    let newKode = `${base}.${nextNum}`;
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
      }));
    dispatch({
      type: 'constractionCost/addProjectCosts',
      payload: itemsWithId,
    });
    dispatch(setFilterJenis({ tipe: project?.jenis, proyek: project?.name }));
    navigate('/construction-cost');
  };

  // Group items by kelompok
  const grouped = kelompokList.reduce((acc, kelompok) => {
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