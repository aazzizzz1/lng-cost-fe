import React, { useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProjectById, generateProjectDetailExcel } from '../../Provider/Project/ProjectSlice'

const ProjectDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const project = useSelector(state => state.projects.selectedProjectDetails);

  useEffect(() => {
    if (!project || String(project.id) !== String(id)) {
      dispatch(fetchProjectById(id));
    }
  }, [dispatch, id, project]);

  // Kelompokkan constructionCosts berdasarkan 'kelompok' dan 'kelompokDetail' (seperti Recap)
  const groupedTree = useMemo(() => {
    if (!project || !Array.isArray(project.constructionCosts)) return [];
    const structure = {};
    project.constructionCosts.forEach((item) => {
      const g = item.kelompok || "Lainnya";
      const sg = item.kelompokDetail || "Lainnya";
      if (!structure[g]) structure[g] = {};
      if (!structure[g][sg]) structure[g][sg] = [];
      structure[g][sg].push(item);
    });

    return Object.keys(structure)
      .sort((a, b) => a.localeCompare(b))
      .map((group) => {
        const subgroups = Object.keys(structure[group])
          .sort((a, b) => a.localeCompare(b))
          .map((sgName) => {
            const items = structure[group][sgName]
              .slice()
              .sort((a, b) => {
                const ak = a.workcode || a.kode || '';
                const bk = b.workcode || b.kode || '';
                if (ak && bk) {
                  const lc = ak.localeCompare(bk, undefined, { numeric: true });
                  if (lc !== 0) return lc;
                }
                return (a.uraian || '').localeCompare(b.uraian || '');
              });
            return { name: sgName, items };
          });

        const groupTotal = subgroups.reduce(
          (s, sg) => s + sg.items.reduce((t, it) => t + (it.totalHarga || 0), 0),
          0
        );
        return { group, subgroups, groupTotal };
      });
  }, [project]);

  // Kolom tabel
  const columns = [
    { key: 'workcode', label: 'Workcode' },
    { key: 'uraian', label: 'Uraian' },
    { key: 'specification', label: 'Specification' },
    { key: 'qty', label: 'Qty', className: 'text-right' },
    { key: 'satuan', label: 'Satuan' },
    { key: 'hargaSatuan', label: 'Harga Satuan', className: 'text-right', isCurrency: true },
    { key: 'totalHarga', label: 'Total Harga', className: 'text-right', isCurrency: true },
    { key: 'aaceClass', label: 'AACE Class' },
    // NEW: more complete fields
    { key: 'accuracyLow', label: 'Accuracy Low', className: 'text-right' },
    { key: 'accuracyHigh', label: 'Accuracy High', className: 'text-right' },
    { key: 'tahun', label: 'Tahun', className: 'text-center' },
    { key: 'lokasi', label: 'Lokasi' },
    { key: 'satuanVolume', label: 'Satuan Volume' },
    { key: 'tipe', label: 'Tipe' },
  ];

  const formatCurrency = (value) =>
    value ? `Rp${Number(value).toLocaleString()}` : '-';

  // NEW: total seluruh kelompok
  const overallTotal = useMemo(
    () => groupedTree.reduce((s, g) => s + (g.groupTotal || 0), 0),
    [groupedTree]
  );

  // NEW: Delegate export to slice helper (kept styling & grouping in slice)
  const handleExportExcel = () => {
    generateProjectDetailExcel({ project, columns });
  };

  if (!project) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="p-6 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white">{project.name}</h1>
          <div className="mt-1 flex flex-wrap gap-2">
            <span className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">{project.infrastruktur}</span>
            <span className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">Tahun {project.tahun}</span>
            <span className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">Lokasi: {project.lokasi}</span>
            <span className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">Inflasi: {project.inflasi ?? "-"}</span>
          </div>
        </div>
        <div className="text-right text-sm text-gray-600 dark:text-gray-300">
          <div className="font-semibold">Total Harga Pekerjaan</div>
          <div className="text-lg font-bold">{project.totalConstructionCost?.toLocaleString?.() ?? (project.harga?.toLocaleString?.() ?? "-")}</div>
        </div>
      </div>
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="text-xs text-gray-500">Kategori</div>
          <div className="font-semibold">{project.kategori}</div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="text-xs text-gray-500">Volume</div>
          <div className="font-semibold">{project.volume}</div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="text-xs text-gray-500">PPN 11%</div>
          <div className="font-semibold">{project.ppn?.toLocaleString?.() ?? "-"}</div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="text-xs text-gray-500">Total Estimasi</div>
          <div className="font-semibold">{project.totalEstimation?.toLocaleString?.() ?? "-"}</div>
        </div>
      </div>
      {Array.isArray(project.constructionCosts) && project.constructionCosts.length > 0 ? (
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="font-semibold text-gray-900 dark:text-white">Construction Costs</div>
            <button
              type="button"
              onClick={handleExportExcel}
              className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1.5 rounded"
            >
              Export ke Excel
            </button>
          </div>
          <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-100 dark:border-gray-800">
            {/* CHANGED: Flowbite-like table + dark text/borders */}
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300 sticky top-0">
                <tr>
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className={`px-4 py-3 border-b border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 ${col.className || ''}`}
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {groupedTree.map((g) => (
                  <React.Fragment key={g.group}>
                    {/* Group header (biru) */}
                    <tr className="bg-blue-100 dark:bg-blue-900">
                      <td colSpan={columns.length} className="font-bold text-gray-900 dark:text-white py-2 px-3 uppercase">
                        {g.group}
                      </td>
                    </tr>

                    {/* Subgroup header + items */}
                    {g.subgroups.map((sg) => (
                      <React.Fragment key={`${g.group}-${sg.name}`}>
                        <tr className="bg-blue-50 dark:bg-blue-800">
                          <td colSpan={columns.length} className="font-semibold text-gray-900 dark:text-white py-2 px-4">
                            {sg.name}
                          </td>
                        </tr>
                        {sg.items.map((cost, idx) => (
                          <tr
                            key={`${g.group}-${sg.name}-${idx}`}
                            className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900"
                          >
                            {columns.map((col) => (
                              <td
                                key={col.key}
                                className={`px-4 py-3 border-b border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 ${col.className || ''}`}
                              >
                                {col.isCurrency
                                  ? formatCurrency(cost[col.key])
                                  : (cost[col.key] ?? '-')}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}

                    {/* Total per kelompok (dipulihkan) */}
                    <tr className="bg-yellow-100 dark:bg-yellow-900 font-bold">
                      <td
                        colSpan={columns.length - 1}
                        className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 text-right text-gray-900 dark:text-gray-100"
                      >
                        Total {g.group}
                      </td>
                      <td className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 text-right text-gray-900 dark:text-gray-100">
                        {formatCurrency(g.groupTotal)}
                      </td>
                    </tr>
                  </React.Fragment>
                ))}

                {/* TOTAL keseluruhan (dipulihkan) */}
                <tr className="bg-orange-200 dark:bg-orange-700 font-bold">
                  <td
                    colSpan={columns.length - 1}
                    className="px-4 py-2 text-right text-gray-900 dark:text-white"
                  >
                    TOTAL
                  </td>
                  <td className="px-4 py-2 text-right text-gray-900 dark:text-white">
                    {formatCurrency(overallTotal)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="p-4 text-center text-gray-500 dark:text-gray-400">
          Tidak ada data biaya konstruksi.
        </div>
      )}

      {/* REMOVED: separate overall total section to keep previous table format */}
    </div>
  );
}

export default ProjectDetail;