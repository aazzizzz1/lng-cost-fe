import React, { useState, useMemo } from 'react'
import { useSelector } from 'react-redux'
import RecapModal from './RecapModal'

const formatCurrency = (value) =>
  value ? `Rp${Number(value).toLocaleString()}` : '';

const getUniqueItems = (costs, selectedProjects) => {
  // Ambil semua uraian unik (dan kode jika ada) dari semua project terpilih
  const items = [];
  selectedProjects.forEach((project) => {
    costs
      .filter(c => c.proyek === project.name)
      .forEach(c => {
        const key = (c.kode || '') + '|' + c.uraian;
        if (!items.find(i => i.key === key)) {
          items.push({
            key,
            kode: c.kode || '',
            uraian: c.uraian,
            kelompok: c.kelompok,
          });
        }
      });
  });
  // Urutkan: kelompok, kode (jika ada), lalu uraian
  items.sort((a, b) => {
    if (a.kelompok !== b.kelompok) return a.kelompok.localeCompare(b.kelompok);
    if (a.kode && b.kode) return a.kode.localeCompare(b.kode, undefined, { numeric: true });
    if (a.kode) return -1;
    if (b.kode) return 1;
    return a.uraian.localeCompare(b.uraian);
  });
  return items;
};

const RecapProject = () => {
  const [rekapTitle, setRekapTitle] = useState("Rekapitulasi Perbandingan Project");
  const projects = useSelector(state => state.projects.projects);
  const costs = useSelector(state => state.constractionCost.costs);

  const [selectedIds, setSelectedIds] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  // Handler tambah dari modal (multi-select)
  const handleAddFromModal = (projectIds) => {
    setSelectedIds(prev => [...prev, ...projectIds.filter(id => !prev.includes(id))]);
    setModalOpen(false);
  };

  const selectedProjects = projects.filter(p => selectedIds.includes(p.id));
  const availableProjects = projects.filter(p => !selectedIds.includes(p.id));

  // Ambil semua item pekerjaan unik (berdasarkan kode+uraian) dari semua project terpilih
  const uniqueItems = useMemo(
    () => getUniqueItems(costs, selectedProjects),
    [costs, selectedProjects]
  );

  // Buat mapping: { [projectName]: { [itemKey]: costObj } }
  const projectCostMap = useMemo(() => {
    const map = {};
    selectedProjects.forEach(project => {
      map[project.name] = {};
      costs
        .filter(c => c.proyek === project.name)
        .forEach(c => {
          const key = (c.kode || '') + '|' + c.uraian;
          map[project.name][key] = c;
        });
    });
    return map;
  }, [costs, selectedProjects]);

  // Summary per project
  const projectSummaries = selectedProjects.map(project => {
    const projectCosts = costs.filter(item => item.proyek === project.name);
    const totalHargaPekerjaan = projectCosts.reduce((sum, item) => sum + (item.totalHarga || 0), 0);
    const ppn = totalHargaPekerjaan * 0.11;
    const asuransi = totalHargaPekerjaan * 0.0025;
    const totalPerkiraan = totalHargaPekerjaan + ppn + asuransi;
    return {
      ...project,
      totalHargaPekerjaan,
      ppn,
      asuransi,
      totalPerkiraan,
    };
  });

  return (
    <div className="p-4">
      <div className="mb-6">
        <label className="block text-lg font-bold text-gray-900 dark:text-white mb-2">
          Judul Rekapitulasi
        </label>
        <input
          type="text"
          value={rekapTitle}
          onChange={e => setRekapTitle(e.target.value)}
          className="w-full max-w-lg border rounded px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
        />
      </div>
      <div className="mb-4 flex flex-col md:flex-row md:items-center md:gap-4">
        <button
          type="button"
          className="bg-primary-700 hover:bg-primary-800 text-white px-4 py-2 rounded font-semibold"
          onClick={() => setModalOpen(true)}
        >
          Tambah Project ke Rekap
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border dark:border-gray-700 bg-white dark:bg-gray-900 rounded mb-8">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800">
              <th className="px-3 py-2 border dark:border-gray-700 text-gray-900 dark:text-white text-center">No.</th>
              <th className="px-3 py-2 border dark:border-gray-700 text-gray-900 dark:text-white">Item Pekerjaan</th>
              {selectedProjects.map(p => (
                <th key={p.id} colSpan={2} className="px-3 py-2 border dark:border-gray-700 text-gray-900 dark:text-white text-center">
                  {p.name}
                </th>
              ))}
            </tr>
            <tr className="bg-gray-50 dark:bg-gray-800">
              <th className="px-3 py-2 border dark:border-gray-700"></th>
              <th className="px-3 py-2 border dark:border-gray-700"></th>
              {selectedProjects.map(p => (
                <React.Fragment key={p.id}>
                  <th className="px-3 py-2 border dark:border-gray-700 text-gray-900 dark:text-white text-center">USD</th>
                  <th className="px-3 py-2 border dark:border-gray-700 text-gray-900 dark:text-white text-center">IDR</th>
                </React.Fragment>
              ))}
            </tr>
          </thead>
          <tbody>
            {uniqueItems.length === 0 && (
              <tr>
                <td colSpan={2 + selectedProjects.length * 2} className="text-center py-6 text-gray-400 dark:text-gray-500">
                  Pilih project untuk menampilkan rekapitulasi.
                </td>
              </tr>
            )}
            {uniqueItems.map((item, idx) => (
              <tr key={item.key} className="border-b dark:border-gray-700">
                <td className="px-3 py-2 border dark:border-gray-700 text-center">
                  {item.kode || String(idx + 1)}
                </td>
                <td className="px-3 py-2 border dark:border-gray-700">{item.uraian}</td>
                {selectedProjects.map(p => {
                  const cost = projectCostMap[p.name][item.key];
                  return (
                    <React.Fragment key={p.id}>
                      <td className="px-3 py-2 border dark:border-gray-700 text-right">
                        {/* USD dummy: tampilkan 0 jika tidak ada, atau cost.usd jika ada */}
                        {cost && cost.usd ? formatCurrency(cost.usd) : '-'}
                      </td>
                      <td className="px-3 py-2 border dark:border-gray-700 text-right">
                        {cost ? formatCurrency(cost.totalHarga) : '-'}
                      </td>
                    </React.Fragment>
                  );
                })}
              </tr>
            ))}
            {/* TOTAL row */}
            <tr className="bg-yellow-100 dark:bg-yellow-900 font-bold">
              <td className="px-3 py-2 border dark:border-gray-700 text-center" colSpan={2}>TOTAL</td>
              {projectSummaries.map((p, idx) => (
                <React.Fragment key={p.id || idx}>
                  <td className="px-3 py-2 border dark:border-gray-700 text-right">-</td>
                  <td className="px-3 py-2 border dark:border-gray-700 text-right">{formatCurrency(p.totalHargaPekerjaan)}</td>
                </React.Fragment>
              ))}
            </tr>
            {/* PPN row */}
            <tr className="bg-yellow-50 dark:bg-yellow-800 font-semibold">
              <td className="px-3 py-2 border dark:border-gray-700 text-center" colSpan={2}>PPN 11%</td>
              {projectSummaries.map((p, idx) => (
                <React.Fragment key={p.id || idx}>
                  <td className="px-3 py-2 border dark:border-gray-700 text-right">-</td>
                  <td className="px-3 py-2 border dark:border-gray-700 text-right">{formatCurrency(p.ppn)}</td>
                </React.Fragment>
              ))}
            </tr>
            {/* GRAND TOTAL row */}
            <tr className="bg-yellow-200 dark:bg-yellow-700 font-bold">
              <td className="px-3 py-2 border dark:border-gray-700 text-center" colSpan={2}>GRAND TOTAL TERMASUK PPN</td>
              {projectSummaries.map((p, idx) => (
                <React.Fragment key={p.id || idx}>
                  <td className="px-3 py-2 border dark:border-gray-700 text-right">-</td>
                  <td className="px-3 py-2 border dark:border-gray-700 text-right">{formatCurrency(p.totalPerkiraan)}</td>
                </React.Fragment>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      {/* Detail Construction Cost per Project */}
      {selectedProjects.length > 0 && (
        <div className="mt-10">
          <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Detail Construction Cost per Project</h3>
          {selectedProjects.map((p, idx) => {
            const projectCosts = costs.filter(item => item.proyek === p.name);
            if (projectCosts.length === 0) return null;
            return (
              <div key={p.id} className="mb-8">
                <div className="font-semibold mb-2 text-primary-700 dark:text-primary-300">{p.name}</div>
                <div className="overflow-x-auto">
                  <table className="w-full border dark:border-gray-700 bg-white dark:bg-gray-900 rounded mb-2">
                    <thead>
                      <tr className="bg-gray-100 dark:bg-gray-800">
                        <th className="px-2 py-2 border dark:border-gray-700">No</th>
                        <th className="px-2 py-2 border dark:border-gray-700">Uraian</th>
                        <th className="px-2 py-2 border dark:border-gray-700">Satuan</th>
                        <th className="px-2 py-2 border dark:border-gray-700">Qty</th>
                        <th className="px-2 py-2 border dark:border-gray-700">Harga Satuan</th>
                        <th className="px-2 py-2 border dark:border-gray-700">Total Harga</th>
                        <th className="px-2 py-2 border dark:border-gray-700">Kelompok</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projectCosts.map((item, i) => (
                        <tr key={item.id || i} className="border-b dark:border-gray-700">
                          <td className="px-2 py-1 border dark:border-gray-700 text-center">{i + 1}</td>
                          <td className="px-2 py-1 border dark:border-gray-700">{item.uraian}</td>
                          <td className="px-2 py-1 border dark:border-gray-700">{item.satuan}</td>
                          <td className="px-2 py-1 border dark:border-gray-700 text-right">{item.qty}</td>
                          <td className="px-2 py-1 border dark:border-gray-700 text-right">{formatCurrency(item.hargaSatuan)}</td>
                          <td className="px-2 py-1 border dark:border-gray-700 text-right">{formatCurrency(item.totalHarga)}</td>
                          <td className="px-2 py-1 border dark:border-gray-700">{item.kelompok}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <RecapModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        projects={availableProjects}
        onAdd={handleAddFromModal}
      />
    </div>
  )
}

export default RecapProject