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

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white">Budget (RAB)</h2>
        <div className="flex gap-2">
          <button
            className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 disabled:opacity-50"
            onClick={handleOpenUnitPriceModal}
            disabled={!rabData}
          >
            Add from Unit Price
          </button>
          <button
            className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
            disabled={!rabData || items.length === 0 || saving}
            onClick={() => dispatch(saveRabAsProject())}
          >
            {saving ? 'Saving...' : 'Save to Projects'}
          </button>
          <button
            className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white rounded-lg bg-gray-500 hover:bg-gray-600"
            onClick={() => setRabModalOpen(true)}
          >
            Edit RAB
          </button>
          <button
            className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white rounded-lg bg-rose-600 hover:bg-rose-700"
            onClick={handleClearRab}
          >
            Clear
          </button>
        </div>
      </div>

      {/* NEW: success banner shown above the table when saved */}
      {saveResult?.type === 'success' && (
        <div className="mb-3 p-3 rounded border border-emerald-300 bg-emerald-50 text-emerald-800">
          {saveResult?.message || 'Saved successfully.'}
        </div>
      )}

      {/* Tampilkan data RAB jika sudah diisi */}
      {rabData && (
        <div className="mb-4 bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
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
      {/* CHANGED: Flowbite-like table wrapper consistent with ProjectTable */}
      <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-100 dark:border-gray-800 mb-4">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
            <tr>
              <th className="px-4 py-3">No</th>
              <th className="px-4 py-3">Workcode</th>
              <th className="px-4 py-3">Uraian</th>
              <th className="px-4 py-3">Specification</th>
              <th className="px-4 py-3">Satuan</th>
              <th className="px-4 py-3">Qty</th>
              <th className="px-4 py-3">Harga Satuan</th>
              <th className="px-4 py-3">Total Harga</th>
              <th className="px-4 py-3">AACE Class</th>
              <th className="px-4 py-3">Accuracy Low</th>
              <th className="px-4 py-3">Accuracy High</th>
              <th className="px-4 py-3">Tahun</th>
              <th className="px-4 py-3">Lokasi</th>
              <th className="px-4 py-3">Tipe</th>
              <th className="px-4 py-3">Kelompok Detail</th>
              <th className="px-4 py-3">Satuan Volume</th>
              <th className="px-4 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={17} className="px-4 py-8 text-center text-gray-500">No items.</td>
              </tr>
            ) : (
              items.map((item, idx) => (
                <tr key={idx} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-4 py-3 text-gray-900 dark:text-gray-100">{idx + 1}</td>
                  <td className="px-4 py-3 text-gray-900 dark:text-gray-100">{item.workcode || '-'}</td>
                  <td className="px-4 py-3 text-gray-900 dark:text-gray-100">{item.uraian}</td>
                  <td className="px-4 py-3 text-gray-900 dark:text-gray-100">{item.specification || '-'}</td>
                  <td className="px-4 py-3 text-gray-900 dark:text-gray-100">{item.satuan}</td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min={1}
                      value={item.qty}
                      onChange={e => handleEditItem(idx, "qty", e.target.value)}
                      className="w-20 px-2 py-1 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min={0}
                      value={item.hargaSatuan}
                      onChange={e => handleEditItem(idx, "hargaSatuan", e.target.value)}
                      className="w-28 px-2 py-1 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                    />
                  </td>
                  <td className="px-4 py-3 text-right text-gray-900 dark:text-gray-100">{(item.qty * item.hargaSatuan).toLocaleString?.() || item.qty * item.hargaSatuan}</td>
                  <td className="px-4 py-3 text-gray-900 dark:text-gray-100">{item.aaceClass ?? 5}</td>
                  <td className="px-4 py-3 text-gray-900 dark:text-gray-100">{item.accuracyLow ?? 0}</td>
                  <td className="px-4 py-3 text-gray-900 dark:text-gray-100">{item.accuracyHigh ?? 0}</td>
                  <td className="px-4 py-3 text-gray-900 dark:text-gray-100">{item.tahun ?? rabData?.tahun ?? '-'}</td>
                  <td className="px-4 py-3 text-gray-900 dark:text-gray-100">{item.lokasi ?? rabData?.lokasi ?? '-'}</td>
                  <td className="px-4 py-3 text-gray-900 dark:text-gray-100">{item.tipe || '-'}</td>
                  <td className="px-4 py-3 text-gray-900 dark:text-gray-100">{item.kelompokDetail || '-'}</td>
                  <td className="px-4 py-3 text-gray-900 dark:text-gray-100">{item.satuanVolume || '-'}</td>
                  <td className="px-4 py-3">
                    <button
                      className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-rose-600 text-white hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-300 dark:focus:ring-rose-600 shadow-sm text-xs"
                      onClick={() => handleDeleteItem(idx)}
                    >
                      Del
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default RabForm