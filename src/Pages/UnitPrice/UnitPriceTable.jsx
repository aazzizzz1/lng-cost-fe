import React, { useState } from 'react';
import Spinner from '../../Components/Spinner/Spinner';
import { useDispatch, useSelector } from 'react-redux';
import { updateUnitPrice, deleteUnitPrice } from '../../Provider/HargaSatuan/unitPriceSlice';

// Kolom yang ingin ditampilkan
const columns = [
  { key: "workcode", label: "Workcode" },
  { key: "uraian", label: "Uraian" },
  { key: "satuan", label: "Satuan" },
  { key: "qty", label: "Qty" },
  { key: "hargaSatuan", label: "Harga Satuan" },
  { key: "totalHarga", label: "Total Harga" },
  { key: "aaceClass", label: "AACE Class" },
  { key: "tahun", label: "Tahun" },
  { key: "proyek", label: "Proyek" },
  { key: "lokasi", label: "Lokasi" },
  { key: "kelompok", label: "Kelompok" },
  { key: "infrastruktur", label: "Infrastruktur" },
  { key: "volume", label: "Volume" },
  { key: "satuanVolume", label: "Satuan Volume" },
  { key: "tipe", label: "Tipe" },
];

const numericKeys = new Set(["qty", "hargaSatuan", "totalHarga", "tahun", "volume"]);

const UnitPriceTable = ({ data, loading, pagination, onPageChange, onLimitChange, onSortChange }) => {
  const { page, limit, total, totalPages } = pagination;
  const dispatch = useDispatch();
  const { updateLoading, updatingId, rowDeleteLoading, rowDeletingId } = useSelector((s) => s.unitPrice);

  const [editingId, setEditingId] = useState(null);
  const [edited, setEdited] = useState({});

  const handleSort = (key) => {
    if (onSortChange) onSortChange(key);
  };

  const startEdit = (row) => {
    setEditingId(row.id);
    setEdited(
      columns.reduce((acc, c) => {
        acc[c.key] = row[c.key] ?? '';
        return acc;
      }, {})
    );
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEdited({});
  };

  const onChangeField = (key, value) => {
    setEdited((prev) => ({
      ...prev,
      [key]: numericKeys.has(key) ? (value === '' ? '' : Number(value)) : value,
    }));
  };

  const saveEdit = async (row) => {
    // Build payload from current edited values
    const payload = columns.reduce((acc, c) => {
      const v = edited[c.key];
      acc[c.key] = v === '' ? null : v;
      return acc;
    }, {});
    // If totalHarga is null/undefined, let backend or reducer compute
    try {
      await dispatch(updateUnitPrice({ id: row.id, data: payload })).unwrap();
      setEditingId(null);
      setEdited({});
    } catch {
      // keep edit mode; optionally show toast
    }
  };

  // NEW: delete handler
  const handleDelete = async (row) => {
    if (!row?.id) return;
    if (!window.confirm('Hapus item ini? Tindakan tidak dapat dibatalkan.')) return;
    try {
      await dispatch(deleteUnitPrice(row.id)).unwrap();
      if (editingId === row.id) {
        setEditingId(null);
        setEdited({});
      }
    } catch {
      // optional: show toast
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900 py-6">
      <div className="bg-white dark:bg-gray-800 relative shadow-xl ring-1 ring-gray-200 dark:ring-gray-700 sm:rounded-xl overflow-hidden">
        <div className="flex-1 overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Spinner />
            </div>
          ) : (
            <table className="w-full text-sm text-left text-gray-600 dark:text-gray-300">
              <thead className="text-xs uppercase bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 text-gray-700 dark:text-gray-300">
                <tr className="border-b border-gray-200/70 dark:border-gray-700/60">
                  <th scope="col" className="px-6 py-4 sticky top-0 z-10 bg-inherit font-semibold">No</th>
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      scope="col"
                      title={`Sort by ${col.label}`}
                      className="px-6 py-4 sticky top-0 z-10 bg-inherit font-semibold cursor-pointer select-none hover:text-primary-600 transition-colors"
                      onClick={() => handleSort(col.key)}
                    >
                      <span className="inline-flex items-center gap-2">
                        {col.label}
                        <span className="text-gray-400 dark:text-gray-500 text-[10px] leading-none">⇅</span>
                      </span>
                    </th>
                  ))}
                  {/* Actions column on the far right */}
                  <th scope="col" className="px-6 py-4 sticky top-0 z-10 bg-inherit font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {!data || data.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length + 2} className="text-center py-10 text-gray-500 dark:text-gray-400">
                      Tidak ada data.
                    </td>
                  </tr>
                ) : (
                  data.map((row, index) => (
                    <tr
                      key={row.id}
                      className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-800 dark:even:bg-gray-900 hover:bg-primary-50/60 dark:hover:bg-gray-700 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-700 dark:text-gray-200">
                        {index + 1 + (page - 1) * limit}
                      </td>
                      {columns.map((col) => (
                        <td key={col.key} className="px-6 py-4 whitespace-nowrap">
                          {editingId === row.id ? (
                            <input
                              type={numericKeys.has(col.key) ? 'number' : 'text'}
                              step={numericKeys.has(col.key) ? 'any' : undefined}
                              value={edited[col.key] ?? ''}
                              onChange={(e) => onChangeField(col.key, e.target.value)}
                              className="w-40 px-2 py-1 border rounded-md bg-white dark:bg-gray-900 dark:border-gray-700"
                            />
                          ) : (
                            col.key === "hargaSatuan" || col.key === "totalHarga"
                              ? row[col.key]
                                ? `Rp${Number(row[col.key]).toLocaleString()}`
                                : ""
                              : row[col.key]
                          )}
                        </td>
                      ))}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingId === row.id ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => saveEdit(row)}
                              disabled={updateLoading && updatingId === row.id}
                              className="px-3 py-1 text-xs rounded bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50"
                            >
                              Save
                            </button>
                            <button
                              onClick={cancelEdit}
                              disabled={updateLoading && updatingId === row.id}
                              className="px-3 py-1 text-xs rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => startEdit(row)}
                              className="px-3 py-1 text-xs rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(row)}
                              disabled={rowDeleteLoading && rowDeletingId === row.id}
                              className="px-3 py-1 text-xs rounded bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-50"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
        <nav
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-5 bg-white/60 dark:bg-gray-800/60 backdrop-blur supports-[backdrop-filter]:bg-white/50 dark:supports-[backdrop-filter]:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700"
          aria-label="Table navigation"
        >
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Showing
            <span className="mx-1 font-semibold text-gray-900 dark:text-white">
              {Math.min((page - 1) * limit + 1, total)}-{Math.min(page * limit, total)}
            </span>
            of
            <span className="ml-1 font-semibold text-gray-900 dark:text-white">
              {total}
            </span>
          </span>
          <div className="flex items-center gap-4">
            <select
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              className="px-3 py-2 border rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
            >
              {[10, 30, 50].map((option) => (
                <option key={option} value={option}>
                  {option} per page
                </option>
              ))}
            </select>
            <ul className="inline-flex items-stretch">
              <li>
                <button
                  disabled={page === 1}
                  onClick={() => onPageChange(page - 1)}
                  className="flex items-center justify-center h-9 px-3 text-sm rounded-l-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-400"
                >
                  <span className="sr-only">Previous</span>
                  <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </li>
              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                if (
                  pageNumber === 1 ||
                  pageNumber === totalPages ||
                  (pageNumber >= page - 2 && pageNumber <= page + 2)
                ) {
                  return (
                    <li key={pageNumber}>
                      <button
                        onClick={() => onPageChange(pageNumber)}
                        className={`h-9 px-3 text-sm border-t border-b ${
                          page === pageNumber
                            ? "bg-primary-600 text-white border-primary-600 hover:bg-primary-700"
                            : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100 hover:text-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700"
                        } focus:outline-none focus:ring-2 focus:ring-primary-400`}
                      >
                        {pageNumber}
                      </button>
                    </li>
                  );
                }
                if (
                  pageNumber === page - 3 ||
                  pageNumber === page + 3 ||
                  (pageNumber === 2 && page > 5) ||
                  (pageNumber === totalPages - 1 && page < totalPages - 4)
                ) {
                  return (
                    <li key={pageNumber}>
                      <span className="h-9 px-3 inline-flex items-center justify-center text-sm border-t border-b bg-white text-gray-500 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-400">
                        ...
                      </span>
                    </li>
                  );
                }
                return null;
              })}
              <li>
                <button
                  disabled={page === totalPages}
                  onClick={() => onPageChange(page + 1)}
                  className="flex items-center justify-center h-9 px-3 text-sm rounded-r-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-400"
                >
                  <span className="sr-only">Next</span>
                  <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4-4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </section>
  );
};

export default UnitPriceTable;