import React, { useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Spinner from '../../Components/Spinner/Spinner';
import { updateConstructionCost, deleteConstructionCostIds } from '../../Provider/ConstructionCost/ConstractionCostSlice';

// NEW: icons (match ProjectTable)
const EditIcon = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className} aria-hidden="true">
    <path
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.862 3.487a2.25 2.25 0 0 1 3.182 3.182L9.06 17.653a2 2 0 0 1-.9.53L5 19l.817-3.16a2 2 0 0 1 .53-.9L16.862 3.487z"
    />
    <path
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19 13v5a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h5"
    />
  </svg>
);
const TrashIcon = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className} aria-hidden="true">
    <path strokeWidth="1.6" strokeLinecap="round" d="M4 7h16" />
    <path strokeWidth="1.6" strokeLinecap="round" d="M10 11v6M14 11v6" />
    <path
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12"
    />
    <path strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
  </svg>
);

// Helper for currency formatting
const formatCurrency = (value) =>
  value === 0 ? 'Rp0' : value ? `Rp${Number(value).toLocaleString()}` : '';

// DB-aligned columns
const columns = [
  { key: 'no', label: 'No', className: 'text-center', width: 50 },
  { key: 'workcode', label: 'Workcode', width: 120 },
  { key: 'uraian', label: 'Uraian', width: 220 },
  { key: 'specification', label: 'Specification', width: 240 },
  { key: 'qty', label: 'Qty', className: 'text-right', width: 80 },
  { key: 'satuan', label: 'Satuan', width: 80 },
  { key: 'hargaSatuan', label: 'Harga Satuan', className: 'text-right', width: 120, isCurrency: true },
  { key: 'totalHarga', label: 'Total Harga', className: 'text-right', width: 140, isCurrency: true },
  { key: 'aaceClass', label: 'AACE Class', width: 90 },
  { key: 'accuracyLow', label: 'Accuracy Low', width: 110 },
  { key: 'accuracyHigh', label: 'Accuracy High', width: 110 },
  { key: 'tahun', label: 'Tahun', width: 80 },
  { key: 'infrastruktur', label: 'Infrastruktur', width: 140 },
  { key: 'volume', label: 'Volume', className: 'text-right', width: 100 },
  { key: 'satuanVolume', label: 'Satuan Volume', width: 120 },
  { key: 'kelompok', label: 'Kelompok', width: 140 },
  { key: 'kelompokDetail', label: 'Kelompok Detail', width: 160 },
  { key: 'lokasi', label: 'Lokasi', width: 120 },
  { key: 'tipe', label: 'Tipe', width: 120 },
];

const numericKeys = new Set([
  'qty',
  'hargaSatuan',
  'totalHarga',
  'aaceClass',
  'accuracyLow',
  'accuracyHigh',
  'tahun',
  'volume',
]);

const ConstractionCostTable = () => {
  const dispatch = useDispatch();
  const { costs, loading } = useSelector((state) => state.constractionCost);

  // Local edit state
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({});
  const { user } = useSelector((state) => state.auth);

  const startEdit = (row) => {
    setEditingId(row.id);
    setForm({
      // pick all DB fields
      workcode: row.workcode || '',
      uraian: row.uraian || '',
      specification: row.specification || '',
      qty: Number(row.qty ?? 0),
      satuan: row.satuan || '',
      hargaSatuan: Number(row.hargaSatuan ?? 0),
      totalHarga: Number(row.totalHarga ?? (Number(row.qty || 0) * Number(row.hargaSatuan || 0))),
      aaceClass: Number(row.aaceClass ?? 5),
      accuracyLow: Number(row.accuracyLow ?? 0),
      accuracyHigh: Number(row.accuracyHigh ?? 0),
      tahun: Number(row.tahun ?? new Date().getFullYear()),
      infrastruktur: row.infrastruktur || '',
      volume: Number(row.volume ?? 0),
      satuanVolume: row.satuanVolume || '',
      kelompok: row.kelompok || '',
      kelompokDetail: row.kelompokDetail || '',
      lokasi: row.lokasi || '',
      tipe: row.tipe || '',
    });
  };
  const cancelEdit = () => {
    setEditingId(null);
    setForm({});
  };
  const onChangeField = (key, value) => {
    const v = numericKeys.has(key) ? (value === '' ? '' : Number(value)) : value;
    setForm((prev) => {
      const next = { ...prev, [key]: v };
      // auto-calc totalHarga if qty or hargaSatuan changes
      if (key === 'qty' || key === 'hargaSatuan') {
        const qty = Number(next.qty || 0);
        const harga = Number(next.hargaSatuan || 0);
        next.totalHarga = qty * harga;
      }
      return next;
    });
  };
  const saveEdit = async () => {
    if (!editingId) return;
    const payload = {
      ...form,
      // ensure numeric fields are numbers
      qty: Number(form.qty || 0),
      hargaSatuan: Number(form.hargaSatuan || 0),
      totalHarga: Number(form.totalHarga || 0),
      aaceClass: Number(form.aaceClass || 0),
      accuracyLow: Number(form.accuracyLow || 0),
      accuracyHigh: Number(form.accuracyHigh || 0),
      tahun: Number(form.tahun || new Date().getFullYear()),
      volume: Number(form.volume || 0),
    };
    dispatch(updateConstructionCost({ id: editingId, data: payload })).then(() => {
      cancelEdit();
    });
  };
  const handleDelete = (row) => {
    if (!row?.id) return;
    if (window.confirm('Hapus construction cost ini? Tindakan tidak dapat dibatalkan.')) {
      dispatch(deleteConstructionCostIds([row.id]));
    }
  };

  // Group data -> kelompok -> kelompokDetail
  const grouped = useMemo(() => {
    return (costs || []).reduce((acc, item) => {
      const g = item.kelompok || 'Lainnya';
      const sg = item.kelompokDetail || 'Lainnya';
      if (!acc[g]) acc[g] = {};
      if (!acc[g][sg]) acc[g][sg] = [];
      acc[g][sg].push(item);
      return acc;
    }, {});
  }, [costs]);

  // Flatten with group headers
  const tableRows = useMemo(() => {
    let rows = [];
    let rowNo = 1;
    Object.keys(grouped)
      .sort((a, b) => a.localeCompare(b))
      .forEach((kelompok) => {
        rows.push({ isGroupHeader: true, kelompok });
        Object.keys(grouped[kelompok])
          .sort((a, b) => a.localeCompare(b))
          .forEach((kelompokDetail) => {
            rows.push({ isSubgroupHeader: true, kelompok, kelompokDetail });
            grouped[kelompok][kelompokDetail].forEach((item) => {
              rows.push({
                ...item,
                no: rowNo++,
                isGroupHeader: false,
                isSubgroupHeader: false,
              });
            });
          });
      });
    return rows;
  }, [grouped]);

  // Summary
  const summary = useMemo(() => {
    const totalHargaPekerjaan = (costs || []).reduce((sum, item) => sum + (Number(item.totalHarga) || 0), 0);
    const ppn = totalHargaPekerjaan * 0.11;
    const asuransi = totalHargaPekerjaan * 0.0025;
    const totalPerkiraan = totalHargaPekerjaan + ppn + asuransi;
    return { totalHargaPekerjaan, ppn, asuransi, totalPerkiraan };
  }, [costs]);

  // Render helpers for edit inputs
  const renderCell = (row, col) => {
    const isEditing = editingId === row.id;
    if (!isEditing) {
      if (col.isCurrency) return formatCurrency(row[col.key]);
      return row[col.key] ?? '';
    }

    // Edit mode: inputs for all fields
    const commonCls = 'w-full bg-transparent border px-2 py-1 rounded dark:bg-gray-900 dark:border-gray-700';
    if (col.key === 'specification') {
      return (
        <textarea
          rows={2}
          className={`${commonCls}`}
          value={form.specification}
          onChange={(e) => onChangeField('specification', e.target.value)}
        />
      );
    }
    if (col.key === 'totalHarga') {
      return (
        <input
          type="number"
          className={`${commonCls} text-right`}
          value={form.totalHarga}
          onChange={(e) => onChangeField('totalHarga', e.target.value)}
        />
      );
    }
    if (numericKeys.has(col.key)) {
      return (
        <input
          type="number"
          step="any"
          className={`${commonCls} ${col.className?.includes('text-right') ? 'text-right' : ''}`}
          value={form[col.key]}
          onChange={(e) => onChangeField(col.key, e.target.value)}
        />
      );
    }
    return (
      <input
        className={commonCls}
        value={form[col.key]}
        onChange={(e) => onChangeField(col.key, e.target.value)}
      />
    );
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
          <div className="w-full md:w-1/2">
            <h1 className="text-base dark:text-white">Construction Cost Overview</h1>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex-1 overflow-x-auto">
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <Spinner />
              </div>
            ) : (
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    {columns.map((col) => (
                      <th
                        key={col.key}
                        className={`px-4 py-3 font-semibold border-b border-gray-200 dark:border-gray-700 ${col.className || ''}`}
                        style={col.width ? { minWidth: col.width } : {}}
                      >
                        {col.label}
                      </th>
                    ))}
                    {user.role === 'admin' && (
                      <th className="px-4 py-3 font-semibold border-b border-gray-200 dark:border-gray-700 text-center">
                        Aksi
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {tableRows.length === 0 && (
                    <tr>
                      <td colSpan={columns.length + 1} className="text-center py-4 text-gray-400 dark:text-gray-500">
                        Tidak ada data.
                      </td>
                    </tr>
                  )}
                  {tableRows.map((row, idx) => {
                    if (row.isGroupHeader) {
                      return (
                        <tr key={`group-${row.kelompok}-${idx}`}>
                          <td
                            colSpan={columns.length + 1}
                            className="bg-gray-100 dark:bg-gray-800 font-bold text-left text-base border-b border-gray-200 dark:border-gray-700 py-2 pl-2 uppercase"
                          >
                            {row.kelompok}
                          </td>
                        </tr>
                      );
                    }
                    if (row.isSubgroupHeader) {
                      return (
                        <tr key={`subgroup-${row.kelompok}-${row.kelompokDetail}-${idx}`}>
                          <td
                            colSpan={columns.length + 1}
                            className="bg-gray-50 dark:bg-gray-700 font-semibold text-left border-b border-gray-200 dark:border-gray-700 py-2 pl-4"
                          >
                            {row.kelompokDetail}
                          </td>
                        </tr>
                      );
                    }
                    return (
                      <tr key={row.id || idx} className="border-b dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-700">
                        {columns.map((col) => (
                          <td key={col.key} className={`px-4 py-3 ${col.className || ''}`}>
                            {renderCell(row, col)}
                          </td>
                        ))}
                        {user.role === 'admin' && (
                          <td className="px-4 py-3">
                            {editingId === row.id ? (
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  className="px-3 py-1 rounded bg-primary-700 hover:bg-primary-800 text-white text-xs"
                                  onClick={saveEdit}
                                  disabled={loading}
                                >
                                  Simpan
                                </button>
                                <button
                                  className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400 text-gray-800 text-xs dark:bg-gray-600 dark:text-white"
                                  onClick={cancelEdit}
                                  disabled={loading}
                                >
                                  Batal
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-primary-700 text-white hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-300 dark:focus:ring-primary-600 shadow-sm"
                                  onClick={() => startEdit(row)}
                                  disabled={loading}
                                  title="Edit"
                                >
                                  <EditIcon />
                                </button>
                                <button
                                  className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-rose-600 text-white hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-300 dark:focus:ring-rose-600 shadow-sm"
                                  onClick={() => handleDelete(row)}
                                  disabled={loading}
                                  title="Delete"
                                >
                                  <TrashIcon />
                                </button>
                              </div>
                            )}
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
          {!loading && (
            <div className="w-full p-4 bg-gray-100 dark:bg-gray-700 mt-4 rounded">
              <div className="flex flex-col gap-2 text-sm text-gray-900 dark:text-white">
                <div>
                  <span className="font-semibold">Total Harga Pekerjaan: </span>
                  {formatCurrency(summary.totalHargaPekerjaan)}
                </div>
                <div>
                  <span className="font-semibold">PPN 11%: </span>
                  {formatCurrency(summary.ppn)}
                </div>
                <div>
                  <span className="font-semibold">Asuransi 2,5‰: </span>
                  {formatCurrency(summary.asuransi)}
                </div>
                <div>
                  <span className="font-semibold">Total Perkiraan Harga Pekerjaan: </span>
                  {formatCurrency(summary.totalPerkiraan)}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ConstractionCostTable;