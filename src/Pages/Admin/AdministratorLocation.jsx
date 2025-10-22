import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchProvinces,
  createCCI,
  updateCCIById,
  deleteCCIById,
} from '../../Provider/administratorSlice';

const AdministratorLocation = () => {
  const provinces = useSelector((state) => state.administrator.provinces);
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(fetchProvinces());
  }, [dispatch]);

  // Add modal state
  const [showAdd, setShowAdd] = React.useState(false);
  const [newRow, setNewRow] = React.useState({
    kodeProvinsi: '',
    provinsi: '',
    cci: '',
    delivery: '',
  });

  // Edit state per row
  const [editingId, setEditingId] = React.useState(null);
  const [edits, setEdits] = React.useState({ cci: '', delivery: '' });

  const openAdd = () => setShowAdd(true);
  const closeAdd = () => {
    setShowAdd(false);
    setNewRow({ kodeProvinsi: '', provinsi: '', cci: '', delivery: '' });
  };

  const handleCreate = () => {
    const kodeProvinsi = parseInt(newRow.kodeProvinsi, 10);
    const cci = parseFloat(newRow.cci);
    const delivery = parseFloat(newRow.delivery);
    const provinsi = (newRow.provinsi || '').trim();
    if (!isNaN(kodeProvinsi) && provinsi && !isNaN(cci) && !isNaN(delivery)) {
      dispatch(createCCI({ kodeProvinsi, provinsi, cci, delivery }));
      closeAdd();
    }
  };

  const startEdit = (prov) => {
    setEditingId(prov.id);
    setEdits({
      cci: prov.cci ?? '',
      delivery: prov.delivery ?? '',
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEdits({ cci: '', delivery: '' });
  };

  const saveEdit = (id) => {
    const payload = {};
    const cciNum = parseFloat(edits.cci);
    const delNum = parseFloat(edits.delivery);
    if (!isNaN(cciNum)) payload.cci = cciNum;
    if (!isNaN(delNum)) payload.delivery = delNum;
    if (Object.keys(payload).length > 0) {
      dispatch(updateCCIById({ id, payload }));
    }
    cancelEdit();
  };

  const handleDelete = (id) => {
    if (id) dispatch(deleteCCIById(id));
  };

  return (
    <div className="overflow-x-auto">
      {/* Action toolbar */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">Daftar CCI Provinsi</h3>
        <button
          type="button"
          onClick={openAdd}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-md shadow hover:from-blue-700 hover:to-blue-600"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Add CCI
        </button>
      </div>

      <table className="min-w-full border text-sm">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-700">
            <th className="border px-2 py-1">Kode Provinsi</th>
            <th className="border px-2 py-1">Provinsi</th>
            <th className="border px-2 py-1">IKK/CCI</th>
            <th className="border px-2 py-1">Delivery</th>
            <th className="border px-2 py-1">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {/* ...removed inline add row... */}
          {provinces.map((prov) => {
            const isEditing = editingId === prov.id;
            return (
              <tr key={prov.id || prov.code}>
                <td className="border px-2 py-1">{prov.code}</td>
                <td className="border px-2 py-1">{prov.name}</td>
                <td className="border px-2 py-1">
                  <input
                    type="number"
                    step="0.01"
                    className={`w-24 px-1 py-0.5 border rounded ${!isEditing ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed' : ''}`}
                    value={isEditing ? edits.cci : prov.cci ?? ''}
                    onChange={(e) => isEditing && setEdits((s) => ({ ...s, cci: e.target.value }))}
                    disabled={!isEditing}
                  />
                </td>
                <td className="border px-2 py-1">
                  <input
                    type="number"
                    step="0.01"
                    className={`w-24 px-1 py-0.5 border rounded ${!isEditing ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed' : ''}`}
                    value={isEditing ? edits.delivery : prov.delivery ?? ''}
                    onChange={(e) => isEditing && setEdits((s) => ({ ...s, delivery: e.target.value }))}
                    disabled={!isEditing}
                  />
                </td>
                <td className="border px-2 py-1">
                  <div className="flex items-center gap-2">
                    {!isEditing ? (
                      <button
                        type="button"
                        className="px-3 py-1.5 text-xs font-medium text-white bg-amber-500 rounded hover:bg-amber-600"
                        onClick={() => startEdit(prov)}
                      >
                        Update
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          className="px-3 py-1.5 text-xs font-semibold text-white bg-green-600 rounded hover:bg-green-700"
                          onClick={() => saveEdit(prov.id)}
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 dark:text-white dark:bg-gray-700 dark:hover:bg-gray-600"
                          onClick={cancelEdit}
                        >
                          Cancel
                        </button>
                      </>
                    )}
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 border border-red-300 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                      onClick={() => handleDelete(prov.id)}
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                        <path d="M3 6h18M8 6v12a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Add modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-xl shadow-2xl ring-1 ring-black/5">
            <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <h4 className="text-base font-semibold text-gray-900 dark:text-white">Tambah CCI Provinsi</h4>
              <button
                onClick={closeAdd}
                className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Close"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <path d="M6 6l12 12M18 6l-12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <div className="p-5 grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Kode Provinsi
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
                  value={newRow.kodeProvinsi}
                  onChange={(e) => setNewRow((s) => ({ ...s, kodeProvinsi: e.target.value }))}
                  placeholder="31"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Provinsi
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
                  value={newRow.provinsi}
                  onChange={(e) => setNewRow((s) => ({ ...s, provinsi: e.target.value }))}
                  placeholder="DKI Jakarta"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    IKK/CCI
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
                    value={newRow.cci}
                    onChange={(e) => setNewRow((s) => ({ ...s, cci: e.target.value }))}
                    placeholder="1.12"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Delivery
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
                    value={newRow.delivery}
                    onChange={(e) => setNewRow((s) => ({ ...s, delivery: e.target.value }))}
                    placeholder="0.05"
                  />
                </div>
              </div>
            </div>
            <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-2">
              <button
                onClick={closeAdd}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdministratorLocation;