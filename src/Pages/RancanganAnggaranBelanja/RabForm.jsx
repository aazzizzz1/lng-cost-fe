import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import CreateRabModal from './CreateRabModal'
import { setRabData, addRabItem, setRabItems, clearRab, saveRabAsProject } from '../../Provider/RabSlice'
import { fetchProvinces } from '../../Provider/administratorSlice';
import { fetchTypes } from '../../Provider/HargaSatuan/unitPriceSlice';
import DetailCreateProjectConstructionModal from '../Project/DetailCreateProjectConstructionModal'; // NEW
import { openModal, closeModal } from '../../Provider/Project/detailCreateProjectConstructionSlice'; // NEW
// import { useNavigate } from 'react-router-dom'; // REMOVED

const RabForm = () => {
  const dispatch = useDispatch();
  // const navigate = useNavigate(); // REMOVED
  const items = useSelector(state => state.rab.items);
  const rabData = useSelector(state => state.rab.rabData);
  const infrastructureTypes = useSelector(state => state.unitPrice.types || []);
  const provinces = useSelector(state => state.administrator.provinces || []);     // NEW
  const inflasiList = useSelector(state => state.administrator.inflasi || []);     // NEW
  const saving = useSelector(state => state.rab.saving);                           // NEW
  const saveResult = useSelector(state => state.rab.saveResult);                   // NEW

  const [rabModalOpen, setRabModalOpen] = React.useState(!rabData);

  useEffect(() => {
    dispatch(fetchProvinces());
    dispatch(fetchTypes());
  }, [dispatch]);

  // REMOVED: redirect on success
  // useEffect(() => {
  //   if (saveResult?.type === 'success') {
  //     navigate('/project');
  //   }
  // }, [saveResult, navigate]);

  // Handler tambah item dari modal unit price (existing modal)
  const handleOpenUnitPriceModal = () => {               // NEW
    if (!rabData) return;
    dispatch(openModal({ type: 'rab', itemIdx: 0, search: '' }));
  };

  const handleAddFromUnitPrice = (selectedItem) => {     // NEW: onPick from modal
    // minimal normalization for RAB item
    dispatch(addRabItem({
      uraian: selectedItem.uraian,
      satuan: selectedItem.satuan,
      qty: selectedItem.qty,
      hargaSatuan: selectedItem.hargaSatuan,
      totalHarga: selectedItem.totalHarga,
      // keep extra fields so save-to-project is complete
      workcode: selectedItem.workcode,
      specification: selectedItem.specification || '',
      tahun: selectedItem.tahun,
      lokasi: selectedItem.lokasi,
      infrastruktur: selectedItem.infrastruktur,
      volume: selectedItem.volume,
      satuanVolume: selectedItem.satuanVolume || '',
      kelompok: selectedItem.kelompok || '',
      kelompokDetail: selectedItem.kelompokDetail || '',
      tipe: selectedItem.tipe || '',
      aaceClass: selectedItem.aaceClass ?? 5, // default if not provided
      accuracyLow: selectedItem.accuracyLow ?? 0,
      accuracyHigh: selectedItem.accuracyHigh ?? 0,
    }));
    dispatch(closeModal());
  };

  // Handler simpan data RAB
  const handleSaveRabData = (data) => {
    dispatch(setRabData(data));
    setRabModalOpen(false);
  };

  // Handler hapus item
  const handleDeleteItem = (idx) => {
    const newItems = items.filter((_, i) => i !== idx);
    dispatch(setRabItems(newItems));
  };

  // Handler edit item (misal: qty/harga satuan)
  const handleEditItem = (idx, field, value) => {
    const newItems = items.map((item, i) =>
      i === idx
        ? {
            ...item,
            [field]: field === "qty" || field === "hargaSatuan" ? Number(value) : value,
          }
        : item
    );
    dispatch(setRabItems(newItems));
  };

  // Handler clear RAB
  const handleClearRab = () => {
    dispatch(clearRab());
    setRabModalOpen(true);
  };

  return (
    <div>
      {/* Modal input data RAB */}
      <CreateRabModal
        isOpen={rabModalOpen}
        onClose={() => setRabModalOpen(false)}
        onSubmit={handleSaveRabData}
        initialData={rabData}
      />
      {/* NEW: Unit Price modal reused with onPick to add into RAB */}
      <DetailCreateProjectConstructionModal
        project={rabData ? {
          id: undefined,
          name: rabData.namaRab,
          infrastruktur: rabData.jenis,
          lokasi: rabData.lokasi,
          tahun: Number(rabData.tahun),
          volume: Number(rabData.volume),
        } : null}
        provinces={provinces}
        inflasiList={inflasiList}
        onPick={handleAddFromUnitPrice}
      />

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Daftar RAB</h2>
        <div className="flex gap-2">
          <button
            className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded disabled:opacity-50"
            onClick={handleOpenUnitPriceModal}                  // CHANGED
            disabled={!rabData}
          >
            Tambah Item dari Harga Satuan
          </button>
          <button
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded disabled:opacity-50"
            disabled={!rabData || items.length === 0 || saving} // NEW
            onClick={() => dispatch(saveRabAsProject())}        // NEW
          >
            {saving ? 'Menyimpan...' : 'Simpan ke Project'}
          </button>
          <button
            className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
            onClick={() => setRabModalOpen(true)}
          >
            Edit Data RAB
          </button>
          <button
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
            onClick={handleClearRab}
          >
            Clear RAB
          </button>
        </div>
      </div>

      {/* NEW: success banner shown above the table when saved */}
      {saveResult?.type === 'success' && (
        <div className="mb-3 p-3 rounded border border-emerald-300 bg-emerald-50 text-emerald-800">
          {saveResult?.message || 'Berhasil menyimpan RAB ke Project.'}
        </div>
      )}

      {/* Tampilkan data RAB jika sudah diisi */}
      {rabData && (
        <div className="mb-4 bg-gray-50 dark:bg-gray-800 rounded p-3 border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Nama RAB</div>
              <div className="font-semibold text-gray-900 dark:text-white">{rabData.namaRab}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Tahun</div>
              <div className="font-semibold text-gray-900 dark:text-white">{rabData.tahun}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Asumsi Inflasi (%)</div>
              <div className="font-semibold text-gray-900 dark:text-white">{rabData.inflasi}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Lokasi</div>
              <div className="font-semibold text-gray-900 dark:text-white">{rabData.lokasi}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Infrastruktur</div>
              <div className="font-semibold text-gray-900 dark:text-white">
                {rabData.jenis || infrastructureTypes.join(', ')}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Volume</div>
              <div className="font-semibold text-gray-900 dark:text-white">{rabData.volume}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Total Harga</div>
              <div className="font-semibold text-gray-900 dark:text-white">
                Rp{items.reduce((total, item) => total + (item.qty * item.hargaSatuan || 0), 0).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}
      <table className="w-full border dark:border-gray-700 mb-4">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-800">
            <th className="px-2 py-2 border dark:border-gray-700">No</th>
            <th className="px-2 py-2 border dark:border-gray-700">Workcode</th>
            <th className="px-2 py-2 border dark:border-gray-700">Uraian</th>
            <th className="px-2 py-2 border dark:border-gray-700">Specification</th>
            <th className="px-2 py-2 border dark:border-gray-700">Satuan</th>
            <th className="px-2 py-2 border dark:border-gray-700">Qty</th>
            <th className="px-2 py-2 border dark:border-gray-700">Harga Satuan</th>
            <th className="px-2 py-2 border dark:border-gray-700">Total Harga</th>
            <th className="px-2 py-2 border dark:border-gray-700">AACE Class</th>
            <th className="px-2 py-2 border dark:border-gray-700">Accuracy Low</th>
            <th className="px-2 py-2 border dark:border-gray-700">Accuracy High</th>
            <th className="px-2 py-2 border dark:border-gray-700">Tahun</th>
            <th className="px-2 py-2 border dark:border-gray-700">Lokasi</th>
            <th className="px-2 py-2 border dark:border-gray-700">Tipe</th>
            <th className="px-2 py-2 border dark:border-gray-700">Kelompok Detail</th>
            <th className="px-2 py-2 border dark:border-gray-700">Satuan Volume</th>
            <th className="px-2 py-2 border dark:border-gray-700">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 && (
            <tr>
              <td colSpan={17} className="text-center text-gray-400 py-4">Belum ada item.</td>
            </tr>
          )}
          {items.map((item, idx) => (
            <tr key={idx}>
              <td className="border px-2 py-1">{idx + 1}</td>
              <td className="border px-2 py-1">{item.workcode || '-'}</td>
              <td className="border px-2 py-1">{item.uraian}</td>
              <td className="border px-2 py-1">{item.specification || '-'}</td>
              <td className="border px-2 py-1">{item.satuan}</td>
              <td className="border px-2 py-1">
                <input
                  type="number"
                  min={1}
                  value={item.qty}
                  onChange={e => handleEditItem(idx, "qty", e.target.value)}
                  className="w-16 border rounded px-1 py-0.5"
                />
              </td>
              <td className="border px-2 py-1">
                <input
                  type="number"
                  min={0}
                  value={item.hargaSatuan}
                  onChange={e => handleEditItem(idx, "hargaSatuan", e.target.value)}
                  className="w-24 border rounded px-1 py-0.5"
                />
              </td>
              <td className="border px-2 py-1">{(item.qty * item.hargaSatuan).toLocaleString?.() || item.qty * item.hargaSatuan}</td>
              <td className="border px-2 py-1">{item.aaceClass ?? 5}</td>
              <td className="border px-2 py-1">{item.accuracyLow ?? 0}</td>
              <td className="border px-2 py-1">{item.accuracyHigh ?? 0}</td>
              <td className="border px-2 py-1">{item.tahun ?? rabData?.tahun ?? '-'}</td>
              <td className="border px-2 py-1">{item.lokasi ?? rabData?.lokasi ?? '-'}</td>
              <td className="border px-2 py-1">{item.tipe || '-'}</td>
              <td className="border px-2 py-1">{item.kelompokDetail || '-'}</td>
              <td className="border px-2 py-1">{item.satuanVolume || '-'}</td>
              <td className="border px-2 py-1">
                <button
                  className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs"
                  onClick={() => handleDeleteItem(idx)}
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default RabForm