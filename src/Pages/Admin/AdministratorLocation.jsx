import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchProvinces,
  createCCI,
  updateCCIById,
  deleteCCIById,
} from '../../Provider/administratorSlice';

// Icons copied to match ProjectTable
const EditIcon = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className} aria-hidden="true">
    <path strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" d="M16.862 3.487a2.25 2.25 0 0 1 3.182 3.182L9.06 17.653a2 2 0 0 1-.9.53L5 19l.817-3.16a2 2 0 0 1 .53-.9L16.862 3.487z" />
    <path strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" d="M19 13v5a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h5" />
  </svg>
);
const TrashIcon = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className} aria-hidden="true">
    <path strokeWidth="1.6" strokeLinecap="round" d="M4 7h16" />
    <path strokeWidth="1.6" strokeLinecap="round" d="M10 11v6M14 11v6" />
    <path strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" d="M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12" />
    <path strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
  </svg>
);
// Compact icons for Save/Cancel
const CheckIcon = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className} aria-hidden="true">
    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);
const XIcon = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className} aria-hidden="true">
    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

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
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
      {/* Action toolbar */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">List of Provincial CCI</h3>
        <button
          type="button"
          onClick={openAdd}
          className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700"
        >
          {/* Same plus icon as ProjectTable */}
          <svg className="h-3.5 w-3.5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path clipRule="evenodd" fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
          </svg>
          Add CCI
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-100 dark:border-gray-800">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
            <tr>
              <th className="px-4 py-3">Code Province</th>
              <th className="px-4 py-3">Province</th>
              <th className="px-4 py-3">IKK/CCI</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {provinces.map((prov) => {
              const isEditing = editingId === prov.id;
              return (
                <tr key={prov.id || prov.code} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-4 py-3 text-gray-900 dark:text-gray-100">{prov.code}</td>
                  <td className="px-4 py-3 text-gray-900 dark:text-gray-100">{prov.name}</td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      step="0.01"
                      className={`w-28 px-2 py-1 rounded-md border ${!isEditing ? 'bg-gray-50 dark:bg-gray-800 cursor-not-allowed' : 'bg-white dark:bg-gray-900'} border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100`}
                      value={isEditing ? edits.cci : prov.cci ?? ''}
                      onChange={(e) => isEditing && setEdits((s) => ({ ...s, cci: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {!isEditing ? (
                        <button
                          aria-label="Edit"
                          title="Edit"
                          className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-primary-700 text-white hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-300 dark:focus:ring-primary-600 shadow-sm"
                          onClick={() => startEdit(prov)}
                        >
                          <EditIcon />
                        </button>
                      ) : (
                        <>
                          <button
                            aria-label="Save"
                            title="Save"
                            className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-300 dark:focus:ring-emerald-600 shadow-sm"
                            onClick={() => saveEdit(prov.id)}
                          >
                            <CheckIcon />
                          </button>
                          <button
                            aria-label="Cancel"
                            title="Cancel"
                            className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-gray-300 text-gray-800 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 shadow-sm"
                            onClick={cancelEdit}
                          >
                            <XIcon />
                          </button>
                        </>
                      )}
                      <button
                        aria-label="Delete"
                        title="Delete"
                        className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-rose-600 text-white hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-300 dark:focus:ring-rose-600 shadow-sm"
                        onClick={() => handleDelete(prov.id)}
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

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
                <XIcon className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Code Province
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
                  Province
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
                {/* <div>
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
                </div> */}
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