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
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{project.name}</h1>
      <div className="mb-4 text-gray-700 dark:text-gray-200">
        <div><b>Lokasi:</b> {project.lokasi}</div>
        <div><b>Tahun:</b> {project.tahun}</div>
        <div><b>Kategori:</b> {project.kategori}</div>
        <div><b>Infrastruktur:</b> {project.infrastruktur}</div>
        <div><b>Volume:</b> {project.volume}</div>
        <div><b>Inflasi:</b> {project.inflasi ?? "-"}</div> {/* NEW */}
      </div>
      <div className="mb-4">
        <div className="font-semibold">Total Harga Pekerjaan: <span className="font-normal">{project.totalConstructionCost?.toLocaleString?.() ?? (project.harga?.toLocaleString?.() ?? "-")}</span></div>
        <div className="font-semibold">PPN 11%: <span className="font-normal">{project.ppn?.toLocaleString?.() ?? "-"}</span></div>
        <div className="font-semibold">Asuransi (2,5‰): <span className="font-normal">{project.insurance?.toLocaleString?.() ?? "-"}</span></div>
        <div className="font-semibold">Total Perkiraan: <span className="font-normal">{project.totalEstimation?.toLocaleString?.() ?? "-"}</span></div>
      </div>
      {Array.isArray(project.constructionCosts) && project.constructionCosts.length > 0 ? (
        <div>
          <div className="font-semibold mb-2 text-gray-900 dark:text-white">Construction Costs:</div>
          <div className="max-h-96 overflow-x-auto">
            <table className="w-full text-xs text-left text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 rounded">
              <thead>
                <tr>
                  {columns.map((col) => (
                    <th key={col.key} className={`px-2 py-1 border-b ${col.className || ''}`}>{col.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(grouped).map(([kelompok, items], groupIdx) => (
                  <React.Fragment key={kelompok}>
                    <tr>
                      <td colSpan={columns.length} className="bg-gray-100 dark:bg-gray-800 font-bold text-left text-base border-b border-gray-200 dark:border-gray-700 py-2 pl-2">
                        {kelompok}
                      </td>
                    </tr>
                    {items.map((cost, idx) => (
                      <tr key={idx}>
                        {columns.map((col) => (
                          <td key={col.key} className={`px-2 py-1 border-b ${col.className || ''}`}>
                            {col.isCurrency
                              ? formatCurrency(cost[col.key])
                              : cost[col.key] ?? '-'}
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