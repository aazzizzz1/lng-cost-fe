import React, { useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProjectById } from '../../Provider/Project/ProjectSlice'

const ProjectDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const project = useSelector(state => state.projects.selectedProjectDetails);

  useEffect(() => {
    if (!project || String(project.id) !== String(id)) {
      dispatch(fetchProjectById(id));
    }
  }, [dispatch, id, project]);

  // Kelompokkan constructionCosts berdasarkan 'kelompok'
  const grouped = useMemo(() => {
    if (!project || !Array.isArray(project.constructionCosts)) return {};
    return project.constructionCosts.reduce((acc, item) => {
      if (!acc[item.kelompok]) acc[item.kelompok] = [];
      acc[item.kelompok].push(item);
      return acc;
    }, {});
  }, [project]);

  // Kolom tabel
  const columns = [
    { key: 'workcode', label: 'Workcode' }, // NEW
    { key: 'uraian', label: 'Uraian' },
    { key: 'specification', label: 'Specification' },
    { key: 'qty', label: 'Qty', className: 'text-right' },
    { key: 'satuan', label: 'Satuan' },
    { key: 'hargaSatuan', label: 'Harga Satuan', className: 'text-right', isCurrency: true },
    { key: 'totalHarga', label: 'Total Harga', className: 'text-right', isCurrency: true },
    { key: 'aaceClass', label: 'AACE Class' },
  ];

  const formatCurrency = (value) =>
    value ? `Rp${Number(value).toLocaleString()}` : '-';

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
          <div className="font-semibold mb-3 text-gray-900 dark:text-white">Construction Costs</div>
          <div className="max-h-96 overflow-auto rounded-lg shadow-sm border border-gray-100 dark:border-gray-800">
            <table className="w-full text-sm text-left table-auto">
              <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0">
                <tr>
                  {columns.map((col) => (
                    <th key={col.key} className={`px-3 py-2 border-b ${col.className || ''}`}>{col.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(grouped).map(([kelompok, items]) => (
                  <React.Fragment key={kelompok}>
                    <tr className="bg-gray-100 dark:bg-gray-800">
                      <td colSpan={columns.length} className="font-semibold text-gray-800 dark:text-gray-100 py-2 px-3">
                        {kelompok}
                      </td>
                    </tr>
                    {items.map((cost, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                        {columns.map((col) => (
                          <td key={col.key} className={`px-3 py-2 border-b ${col.className || ''}`}>
                            {col.isCurrency ? formatCurrency(cost[col.key]) : cost[col.key] ?? '-'
                            }
                          </td>
                        ))}
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
         </div>
       ) : (
         <div className="text-gray-400 dark:text-gray-300">Tidak ada construction cost.</div>
       )}
     </div>
   )
 }
 
 export default ProjectDetail