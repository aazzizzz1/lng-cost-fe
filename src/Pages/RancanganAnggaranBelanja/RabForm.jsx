import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import CreateRabModal from './CreateRabModal'
import { setRabData, addRabItem, setRabItems, clearRab, saveRabAsProject } from '../../Provider/RabSlice'
import { fetchProvinces } from '../../Provider/administratorSlice';
import { fetchTypes } from '../../Provider/HargaSatuan/unitPriceSlice';
import DetailCreateProjectConstructionModal from '../Project/DetailCreateProjectConstructionModal'; // NEW
import { openModal, closeModal } from '../../Provider/Project/detailCreateProjectConstructionSlice'; // NEW
// import { useNavigate } from 'react-router-dom'; // REMOVED

// NEW: unit map to render unit beside volume
const satuanByJenis = {
  "LNGBV": "m³/CBM",
  "Onshore LNG Plant": "MMSCFD",
  "Offshore LNG Plant": "MMSCFD",
  "LNGC": "m³/CBM",
  "LNG Carrier": "m³/CBM", // alias
  "LNG Trucking": "m³/CBM",
  "FSRU": "m³/CBM",
  "Onshore Receiving Facility (ORF)": "MMSCFD",
  "OTS": "m³/CBM",
  "Onshore Regasification Unit (ORU)": "MMSCFD",
  "Self-Propelled Barge (SPB)": "m³/CBM",
  "Self-Propelled Barge": "m³/CBM",
  "Dolphin SPB Infrastructure": "m³/CBM",
  "Dolphin LNGBV Infrastructure": "m³/CBM",
  "Jetty SPB Infrastructure": "m³/CBM",
  "Jetty LNGBV Infrastructure": "m³/CBM",
};

// NEW: Static kelompok list to support add-by-dropdown
const DEFAULT_KELOMPOK = [
  'General & Finalization',
  'Construction and Installation',
  'Material & Equipment',
  'Engineering & Management',
  'Testing & Commissioning',
];

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

  // NEW: manual add to group states (dropdown + optional custom)
  const [newGroup, setNewGroup] = React.useState(DEFAULT_KELOMPOK[0]);
  const [customGroup, setCustomGroup] = React.useState('');
  const unitLabel = rabData ? (satuanByJenis[rabData.jenis] || '-') : '-';

  // NEW: add one empty item under a group (manual input)
  const handleAddManualItemToGroup = () => {
    const kelompokVal = newGroup === '__custom__' ? (customGroup || '').trim() : newGroup;
    if (!kelompokVal) return;
    dispatch(addRabItem({
      workcode: '',
      uraian: '',
      specification: '',
      satuan: '',
      qty: 1,
      hargaSatuan: 0,
      totalHarga: 0,
      aaceClass: 5,
      accuracyLow: 0,
      accuracyHigh: 0,
      tahun: Number(rabData?.tahun) || new Date().getFullYear(),
      lokasi: rabData?.lokasi || '',
      infrastruktur: rabData?.jenis || '',
      volume: Number(rabData?.volume) || 0,
      satuanVolume: '',
      kelompok: kelompokVal,
      kelompokDetail: '',
      tipe: '',
    }));
    // reset custom only
    setCustomGroup('');
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
        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white">CAPEX Cost Plan (RAB)</h2>
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

      {/* NEW: quick manual input like Edit Project (add group + one empty row) */}
      {rabData && (
        <div className="mb-3 rounded-lg border border-gray-200 dark:border-gray-800 p-3 bg-white dark:bg-gray-900">
          <div className="text-sm font-semibold mb-2 text-gray-900 dark:text-white">Manual Construction Items</div>
          <div className="flex flex-row flex-wrap items-center gap-2">
            <select
              value={newGroup}
              onChange={e => setNewGroup(e.target.value)}
              className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-gray-100 w-64 shrink-0"
            >
              {DEFAULT_KELOMPOK.map(k => (
                <option key={k} value={k}>{k}</option>
              ))}
              <option value="__custom__">Custom…</option>
            </select>

            <button
              className="px-3 py-2 rounded-md bg-primary-600 text-white text-sm font-semibold disabled:opacity-60 shrink-0 z-10"
              disabled={newGroup === '__custom__' && !customGroup.trim()}
              onClick={handleAddManualItemToGroup}
              title="Add item to selected Kelompok"
            >
              Add
            </button>

            {newGroup === '__custom__' && (
              <input
                type="text"
                value={customGroup}
                onChange={e => setCustomGroup(e.target.value)}
                placeholder="Custom Kelompok…"
                className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-gray-100 w-64"
              />
            )}
          </div>
        </div>
      )}

      {/* NEW: success banner shown above the table when saved */}
      {saveResult?.type === 'success' && (
        <div className="mb-3 p-3 rounded border border-emerald-300 bg-emerald-50 text-emerald-800">
          {saveResult?.message || 'Saved successfully.'}
        </div>
      )}

      {/* RAB summary with unit beside volume */}
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
              <div className="font-semibold text-gray-900 dark:text-white">
                {rabData.volume} {unitLabel}
              </div>
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
              <th className="px-4 py-3">Project</th>
              <th className="px-4 py-3">AACE Class</th>
              <th className="px-4 py-3">Accuracy Low</th>
              <th className="px-4 py-3">Accuracy High</th>
              <th className="px-4 py-3">Tahun</th>
              <th className="px-4 py-3">Lokasi</th>
              <th className="px-4 py-3">Tipe</th>
              <th className="px-4 py-3">Kelompok</th> {/* NEW: ensure column visible */}
              <th className="px-4 py-3">Kelompok Detail</th>
              <th className="px-4 py-3">Satuan Volume</th>
              <th className="px-4 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={18} className="px-4 py-8 text-center text-gray-500">No items.</td>
              </tr>
            ) : (
              items.map((item, idx) => {
                const isCustomKelompok = item.kelompok && !DEFAULT_KELOMPOK.includes(item.kelompok);
                const selectValue = isCustomKelompok ? '__custom__' : (item.kelompok || '');
                return (
                  <tr key={idx} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-4 py-3 text-gray-900 dark:text-gray-100">{idx + 1}</td>
                    <td className="px-4 py-3">
                      <input
                        value={item.workcode || ''}
                        onChange={e => handleEditItem(idx, "workcode", e.target.value)}
                        className="w-28 px-2 py-1 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        value={item.uraian || ''}
                        onChange={e => handleEditItem(idx, "uraian", e.target.value)}
                        className="w-full px-2 py-1 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        value={item.specification || ''}
                        onChange={e => handleEditItem(idx, "specification", e.target.value)}
                        className="w-full px-2 py-1 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        value={item.satuan || ''}
                        onChange={e => handleEditItem(idx, "satuan", e.target.value)}
                        className="w-24 px-2 py-1 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number" min={1}
                        value={item.qty}
                        onChange={e => handleEditItem(idx, "qty", e.target.value)}
                        className="w-20 px-2 py-1 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number" min={0}
                        value={item.hargaSatuan}
                        onChange={e => handleEditItem(idx, "hargaSatuan", e.target.value)}
                        className="w-28 px-2 py-1 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                      />
                    </td>
                    <td className="px-4 py-3 text-right text-gray-900 dark:text-gray-100">{(item.qty * item.hargaSatuan).toLocaleString?.() || item.qty * item.hargaSatuan}</td>
                    <td className="px-4 py-3 text-gray-900 dark:text-gray-100">{item.proyek || '-'}</td>
                    <td className="px-4 py-3">
                      <input
                        type="number" min={1} max={5}
                        value={item.aaceClass ?? 5}
                        onChange={e => handleEditItem(idx, "aaceClass", e.target.value)}
                        className="w-16 px-2 py-1 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number" step="any"
                        value={item.accuracyLow ?? 0}
                        onChange={e => handleEditItem(idx, "accuracyLow", e.target.value)}
                        className="w-20 px-2 py-1 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number" step="any"
                        value={item.accuracyHigh ?? 0}
                        onChange={e => handleEditItem(idx, "accuracyHigh", e.target.value)}
                        className="w-20 px-2 py-1 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                      />
                    </td>
                    <td className="px-4 py-3 text-gray-900 dark:text-gray-100">{item.tahun ?? rabData?.tahun ?? '-'}</td>
                    <td className="px-4 py-3 text-gray-900 dark:text-gray-100">{item.lokasi ?? rabData?.lokasi ?? '-'}</td>
                    <td className="px-4 py-3">
                      <input
                        value={item.tipe || ''}
                        onChange={e => handleEditItem(idx, "tipe", e.target.value)}
                        className="w-28 px-2 py-1 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-2">
                        <select
                          value={selectValue}
                          onChange={e => {
                            const v = e.target.value;
                            if (v === '__custom__') {
                              // temporarily clear kelompok, show input
                              dispatch(setRabItems(items.map((it, i) => i === idx ? { ...it, kelompok: '' } : it)));
                            } else {
                              handleEditItem(idx, "kelompok", v);
                            }
                          }}
                          className="w-48 px-2 py-1 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                        >
                          <option value="">Select Kelompok</option>
                          {DEFAULT_KELOMPOK.map(k => (
                            <option key={k} value={k}>{k}</option>
                          ))}
                          <option value="__custom__">Custom…</option>
                        </select>
                        {selectValue === '__custom__' && (
                          <input
                            value={item.kelompok || ''}
                            onChange={e => handleEditItem(idx, "kelompok", e.target.value)}
                            placeholder="Custom Kelompok…"
                            className="w-48 px-2 py-1 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                          />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <input
                        value={item.kelompokDetail || ''}
                        onChange={e => handleEditItem(idx, "kelompokDetail", e.target.value)}
                        className="w-40 px-2 py-1 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        value={item.satuanVolume || ''}
                        onChange={e => handleEditItem(idx, "satuanVolume", e.target.value)}
                        className="w-32 px-2 py-1 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <button
                        className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-rose-600 text-white hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-300 dark:focus:ring-rose-600 shadow-sm text-xs"
                        onClick={() => handleDeleteItem(idx)}
                      >
                        Del
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
export default RabForm