import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjectById, updateProject } from '../../Provider/Project/ProjectSlice';
import {
  setItems,
  selectItems,
  updateItem,
  addItem,
  deleteItem,
  openModal,
  closeModal,
  selectModal,
} from '../../Provider/Project/detailCreateProjectConstructionSlice';
import DetailCreateProjectConstructionModal from './DetailCreateProjectConstructionModal';

const formatCurrency = (v) => (v || v === 0 ? `Rp${Number(v).toLocaleString()}` : '-');

// Icons (SVG, follow currentColor)
const PriceTagIcon = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className} aria-hidden="true">
    <path strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
      d="M7.5 3h5.379a2.25 2.25 0 011.591.659l5.371 5.371a2.25 2.25 0 010 3.182l-6.439 6.439a2.25 2.25 0 01-3.182 0L3.659 12.13A2.25 2.25 0 013 10.538V5.25A2.25 2.25 0 015.25 3H7.5z" />
    <circle cx="9.75" cy="6.75" r="0.75" strokeWidth="1.5" />
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

const EditProjectConstruction = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Project and refs
  const project = useSelector((s) => s.projects.selectedProjectDetails);
  const provinces = useSelector((s) => s.administrator.provinces || []);
  const inflasiList = useSelector((s) => s.administrator.inflasi || []);

  // Items from slice (for modal reuse)
  const items = useSelector(selectItems);
  const modal = useSelector(selectModal);

  // Header form states
  const [name, setName] = useState('');
  const [infrastruktur, setInfrastruktur] = useState('');
  const [lokasi, setLokasi] = useState('');
  const [kategori, setKategori] = useState('');
  const [tahun, setTahun] = useState('');
  const [volume, setVolume] = useState('');
  const [saving, setSaving] = useState(false);
  const [inflasi, setInflasi] = useState(''); // NEW

  // Load project
  useEffect(() => {
    dispatch(fetchProjectById(id));
  }, [dispatch, id]);

  // Prefill form and items when project loaded
  useEffect(() => {
    if (!project) return;
    setName(project.name || '');
    setInfrastruktur(project.infrastruktur || '');
    setLokasi(project.lokasi || '');
    setKategori(project.kategori || '');
    setTahun(project.tahun || '');
    setVolume(project.volume || '');
    setInflasi(project.inflasi ?? ''); // NEW

    const mapped =
      Array.isArray(project.constructionCosts)
        ? project.constructionCosts.map((c) => ({
            id: c.id,                          // NEW: keep DB id
            kode: c.workcode || c.id,          // prefer workcode for display
            workcode: c.workcode || '', // NEW
            uraian: c.uraian,
            specification: c.specification, // preserved
            satuan: c.satuan,
            qty: c.qty,
            hargaSatuan: c.hargaSatuan,
            totalHarga: c.totalHarga,
            aaceClass: c.aaceClass,
            accuracyLow: c.accuracyLow,
            accuracyHigh: c.accuracyHigh,
            tahun: c.tahun,
            infrastruktur: c.infrastruktur,
            volume: c.volume,
            satuanVolume: c.satuanVolume,
            kelompok: c.kelompok,
            kelompokDetail: c.kelompokDetail,
            lokasi: c.lokasi,
            tipe: c.tipe,
            proyek: project.name,
            isCategory: false,
          }))
        : [];
    dispatch(setItems(mapped));
  }, [dispatch, project]);

  // Group by 'kelompok'
  const grouped = useMemo(() => {
    return (items || []).reduce((acc, it) => {
      const key = it.kelompok || '-';
      if (!acc[key]) acc[key] = [];
      acc[key].push(it);
      return acc;
    }, {});
  }, [items]);

  const kelompokList = useMemo(() => Object.keys(grouped), [grouped]);

  // Handlers
  const handleItemChange = (idx, field, value) => {
    if (field === 'qty' || field === 'hargaSatuan') {
      const item = items[idx];
      const qty = field === 'qty' ? parseFloat(value || 0) : parseFloat(item.qty || 0);
      const hargaSatuan = field === 'hargaSatuan' ? parseFloat(value || 0) : parseFloat(item.hargaSatuan || 0);
      dispatch(updateItem({ idx, field, value }));
      dispatch(updateItem({ idx, field: 'totalHarga', value: qty * hargaSatuan }));
    } else {
      dispatch(updateItem({ idx, field, value }));
    }
  };

  const handleAddItem = (kelompok) => {
    const within = items.filter((x) => x.kelompok === kelompok && !x.isCategory);
    const nextNum = within.length + 1;
    const kodeBase = typeof within[0]?.kode === 'string' && within[0].kode.includes('.')
      ? within[0].kode.split('.')[0]
      : kelompok || 'ITM';
    const newKode = `${kodeBase}.${nextNum}`;
    dispatch(addItem({
      kode: newKode,
      workcode: '', // NEW
      uraian: '',
      specification: '',
      satuan: '',
      qty: 1,
      hargaSatuan: 0,
      totalHarga: 0,
      aaceClass: 5,
      tahun: Number(tahun) || project?.tahun,
      proyek: name || project?.name,
      lokasi: lokasi || project?.lokasi,
      tipe: kategori || project?.kategori || '',
      kelompok,
      isCategory: false,
    }));
  };

  const handleDeleteItem = (idx) => dispatch(deleteItem(idx));

  const handleOpenModal = (idx) => dispatch(openModal({ type: 'material', itemIdx: idx, search: '' }));
  const handleCloseModal = () => dispatch(closeModal());

  // Validation: required headers
  const headerMissing = useMemo(() => {
    const miss = [];
    if (!name) miss.push('Nama Project');
    if (!infrastruktur) miss.push('Infrastruktur');
    if (!lokasi) miss.push('Lokasi');
    if (tahun === '' || tahun === null || tahun === undefined) miss.push('Tahun');
    if (volume === '' || volume === null || volume === undefined) miss.push('Volume');
    if (!kategori) miss.push('Kategori');
    return miss;
  }, [name, infrastruktur, lokasi, tahun, volume, kategori]);

  // Validation: required per construction item
  const requiredItemFields = useMemo(
    () => ['workcode','uraian','specification','satuan','qty','hargaSatuan','aaceClass','kelompok','kelompokDetail','satuanVolume'], // UPDATED
    []
  );
  const itemMissingMap = useMemo(() => {
    const isEmpty = (v) => v === undefined || v === null || v === '' || (typeof v === 'number' && Number.isNaN(v));
    return (items || []).map((it, idx) => {
      const missing = requiredItemFields.filter((f) => isEmpty(it[f]));
      return { idx, kode: it.kode, missing };
    });
  }, [items, requiredItemFields]);

  const hasMissingItems = useMemo(() => itemMissingMap.some((r) => r.missing.length > 0), [itemMissingMap]);
  const isSaveDisabled = headerMissing.length > 0 || hasMissingItems || saving;

  const columns = [
    { key: 'no', label: 'No' },
    { key: 'workcode', label: 'Workcode*' },                              // NEW
    { key: 'uraian', label: 'Uraian*' },
    { key: 'specification', label: 'Specification*' },
    { key: 'satuan', label: 'Satuan*' },
    { key: 'qty', label: 'Qty*' },
    { key: 'hargaSatuan', label: 'Harga Satuan*' },
    { key: 'totalHarga', label: 'Total Harga' },
    { key: 'aaceClass', label: 'AACE Class*' },
    { key: 'kelompokDetail', label: 'Kelompok Detail*' },
    { key: 'satuanVolume', label: 'Satuan Volume*' },
    { key: 'ambil', label: 'Ambil Harga' },
    { key: 'aksi', label: 'Action' },
  ];

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        name,
        infrastruktur,
        lokasi,
        kategori,
        tahun: Number(tahun),
        volume: Number(volume),
        inflasi: inflasi === '' ? null : Number(inflasi), // NEW include project inflasi
        constructionCosts: (items || []).map((it) => ({
          id: it.id ?? undefined,               // CHANGED: use stored DB id
          workcode: it.workcode || '', // NEW
          uraian: it.uraian,
          specification: it.specification || '',
          qty: Number(it.qty) || 0,
          satuan: it.satuan || '',
          hargaSatuan: Number(it.hargaSatuan) || 0,
          totalHarga: Number(it.totalHarga) || 0,
          aaceClass: Number(it.aaceClass) || 0,
          accuracyLow: Number.isFinite(it.accuracyLow) ? it.accuracyLow : 0,
          accuracyHigh: Number.isFinite(it.accuracyHigh) ? it.accuracyHigh : 0,
          tahun: Number(tahun),
          infrastruktur,
          volume: Number(volume),
          satuanVolume: it.satuanVolume || '',
          kelompok: it.kelompok || '',
          kelompokDetail: it.kelompokDetail || '',
          lokasi,
          tipe: kategori || '',
        })),
      };

      // quick debug on client before dispatch
      console.log('[EditProjectConstruction] submit payload:', payload);

      await dispatch(updateProject(id, payload));
      navigate('/project');
    } catch (e) {
      alert('Gagal menyimpan perubahan. Coba lagi.');
    } finally {
      setSaving(false);
    }
  };

  if (!project) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="p-6 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Edit Project</h1>

      {/* Validation Summary */}
      {(headerMissing.length > 0 || hasMissingItems) && (
        <div className="mb-4 border border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-700 text-red-800 dark:text-red-200 rounded p-3">
          <div className="font-semibold mb-2">Lengkapi data berikut sebelum menyimpan:</div>
          {headerMissing.length > 0 && (
            <div className="mb-2">
              <div className="text-sm font-semibold">Header Project:</div>
              <ul className="list-disc list-inside text-sm">
                {headerMissing.map((f) => (<li key={f}>{f}</li>))}
              </ul>
            </div>
          )}
          {hasMissingItems && (
            <div className="mt-2">
              <div className="text-sm font-semibold">Construction Items:</div>
              <div className="max-h-40 overflow-auto pr-2">
                <ul className="list-disc list-inside text-sm">
                  {itemMissingMap
                    .filter((r) => r.missing.length > 0)
                    .map((r) => (
                      <li key={r.idx}>
                        Item {r.kode ?? `#${r.idx + 1}`}: {r.missing.join(', ')}
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Header form */}
      <div className="mb-6 bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Nama Project</div>
            <input className="w-full px-2 py-1 rounded border dark:bg-gray-900 dark:border-gray-700"
                   value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Infrastruktur</div>
            <input className="w-full px-2 py-1 rounded border dark:bg-gray-900 dark:border-gray-700"
                   value={infrastruktur} onChange={(e) => setInfrastruktur(e.target.value)} />
          </div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Lokasi</div>
            <input className="w-full px-2 py-1 rounded border dark:bg-gray-900 dark:border-gray-700"
                   value={lokasi} onChange={(e) => setLokasi(e.target.value)} />
          </div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Kategori</div>
            <input className="w-full px-2 py-1 rounded border dark:bg-gray-900 dark:border-gray-700"
                   value={kategori} onChange={(e) => setKategori(e.target.value)} />
          </div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Tahun</div>
            <input type="number" className="w-full px-2 py-1 rounded border dark:bg-gray-900 dark:border-gray-700"
                   value={tahun} onChange={(e) => setTahun(e.target.value)} />
          </div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Volume</div>
            <input type="number" step="any" className="w-full px-2 py-1 rounded border dark:bg-gray-900 dark:border-gray-700"
                   value={volume} onChange={(e) => setVolume(e.target.value)} />
          </div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Inflasi (%)</div>
            <input type="number" step="any" className="w-full px-2 py-1 rounded border dark:bg-gray-900 dark:border-gray-700"
                   value={inflasi} onChange={(e) => setInflasi(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="mt-2 flex justify-end">
        <button
          type="button"
          disabled={isSaveDisabled}
          onClick={handleSave}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-500 disabled:opacity-60 text-white px-6 py-2 rounded-full font-semibold shadow-md hover:scale-[1.01] transition"
        >
          {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </div>

      {/* Tables per kelompok */}
      {kelompokList.map((kelompok) => (
        <div key={kelompok} className="mb-8">
          <div className="text-lg font-bold mb-2 text-primary-700 dark:text-primary-300 uppercase tracking-wide">{kelompok}</div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-separate border-spacing-y-2 border-spacing-x-0">
              <thead>
                <tr className="bg-transparent">
                  {columns.map((c) => (
                    <th
                      key={c.key}
                      className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
                    >
                      {c.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {grouped[kelompok].map((item) => {
                  const absIdx = items.findIndex((it) => it === item);
                  const missingFor = (field) => {
                    const rec = itemMissingMap[absIdx];
                    return rec && rec.missing.includes(field);
                  };

                  // Softer inputs with focus ring; missing shows red ring
                  const inputBaseCls =
                    "w-full bg-transparent px-2 py-1 rounded-md border border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500/60 dark:focus:ring-primary-400/40 placeholder-gray-400";
                  const inputBorderCls = "ring-0";
                  const missingCls = "ring-2 ring-red-500 focus:ring-red-500";

                  return (
                    <tr key={absIdx} className="group">
                      {/* tambahkan nomor urut per group */}
                      <td className="px-3 py-2 bg-white dark:bg-gray-900/60 group-hover:bg-gray-50 dark:group-hover:bg-gray-800/60 transition-colors rounded-l-xl font-medium text-gray-700 dark:text-gray-200">
                        {grouped[kelompok].indexOf(item) + 1}
                      </td>
                      <td className="px-3 py-2 bg-white dark:bg-gray-900/60 group-hover:bg-gray-50 dark:group-hover:bg-gray-800/60 transition-colors">
                        <input
                          value={item.workcode || ''}
                          onChange={(e) => handleItemChange(absIdx, 'workcode', e.target.value)}
                          className={`${inputBaseCls} ${missingFor('workcode') ? missingCls : inputBorderCls}`}
                        />
                      </td>
                      <td className="px-3 py-2 bg-white dark:bg-gray-900/60 group-hover:bg-gray-50 dark:group-hover:bg-gray-800/60 transition-colors">
                        <input
                          value={item.uraian || ''}
                          onChange={(e) => handleItemChange(absIdx, 'uraian', e.target.value)}
                          className={`${inputBaseCls} ${missingFor('uraian') ? missingCls : inputBorderCls}`}
                        />
                      </td>
                      <td className="px-3 py-2 bg-white dark:bg-gray-900/60 group-hover:bg-gray-50 dark:group-hover:bg-gray-800/60 transition-colors">
                        <textarea
                          rows={2}
                          value={item.specification || ''}
                          onChange={(e) => handleItemChange(absIdx, 'specification', e.target.value)}
                          className={`${inputBaseCls} resize-y ${missingFor('specification') ? missingCls : inputBorderCls}`}
                        />
                      </td>
                      <td className="px-3 py-2 bg-white dark:bg-gray-900/60 group-hover:bg-gray-50 dark:group-hover:bg-gray-800/60 transition-colors">
                        <input
                          value={item.satuan || ''}
                          onChange={(e) => handleItemChange(absIdx, 'satuan', e.target.value)}
                          className={`${inputBaseCls} ${missingFor('satuan') ? missingCls : inputBorderCls}`}
                        />
                      </td>
                      <td className="px-3 py-2 bg-white dark:bg-gray-900/60 group-hover:bg-gray-50 dark:group-hover:bg-gray-800/60 transition-colors">
                        <input
                          type="number" min={0} step="any"
                          value={item.qty ?? 0}
                          onChange={(e) => handleItemChange(absIdx, 'qty', e.target.value)}
                          className={`${inputBaseCls} text-right ${missingFor('qty') ? missingCls : inputBorderCls}`}
                        />
                      </td>
                      <td className="px-3 py-2 bg-white dark:bg-gray-900/60 group-hover:bg-gray-50 dark:group-hover:bg-gray-800/60 transition-colors">
                        <input
                          type="number" min={0} step="any"
                          value={item.hargaSatuan ?? 0}
                          onChange={(e) => handleItemChange(absIdx, 'hargaSatuan', e.target.value)}
                          className={`${inputBaseCls} text-right ${missingFor('hargaSatuan') ? missingCls : inputBorderCls}`}
                        />
                      </td>
                      <td className="px-3 py-2 bg-white dark:bg-gray-900/60 group-hover:bg-gray-50 dark:group-hover:bg-gray-800/60 transition-colors text-right">
                        {formatCurrency(item.totalHarga || 0)}
                      </td>
                      <td className="px-3 py-2 bg-white dark:bg-gray-900/60 group-hover:bg-gray-50 dark:group-hover:bg-gray-800/60 transition-colors">
                        <input
                          type="number" min={1} max={5}
                          value={item.aaceClass ?? 5}
                          onChange={(e) => handleItemChange(absIdx, 'aaceClass', e.target.value)}
                          className={`${inputBaseCls} text-center ${missingFor('aaceClass') ? missingCls : inputBorderCls}`}
                        />
                      </td>
                      <td className="px-3 py-2 bg-white dark:bg-gray-900/60 group-hover:bg-gray-50 dark:group-hover:bg-gray-800/60 transition-colors">
                        <input
                          value={item.kelompokDetail || ''}
                          onChange={(e) => handleItemChange(absIdx, 'kelompokDetail', e.target.value)}
                          className={`${inputBaseCls} ${missingFor('kelompokDetail') ? missingCls : inputBorderCls}`}
                        />
                      </td>
                      <td className="px-3 py-2 bg-white dark:bg-gray-900/60 group-hover:bg-gray-50 dark:group-hover:bg-gray-800/60 transition-colors">
                        <input
                          value={item.satuanVolume || ''}
                          onChange={(e) => handleItemChange(absIdx, 'satuanVolume', e.target.value)}
                          className={`${inputBaseCls} ${missingFor('satuanVolume') ? missingCls : inputBorderCls}`}
                        />
                      </td>
                      <td className="px-3 py-2 bg-white dark:bg-gray-900/60 group-hover:bg-gray-50 dark:group-hover:bg-gray-800/60 transition-colors">
                        <button
                          type="button"
                          title="Ambil Harga Satuan"
                          className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-primary-700 text-white hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-300 dark:focus:ring-primary-600 shadow-sm"
                          onClick={() => handleOpenModal(absIdx)}
                        >
                          <PriceTagIcon className="w-4 h-4" />
                        </button>
                      </td>
                      <td className="px-3 py-2 bg-white dark:bg-gray-900/60 group-hover:bg-gray-50 dark:group-hover:bg-gray-800/60 transition-colors rounded-r-xl">
                        <button
                          type="button"
                          title="Hapus Item"
                          className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-rose-600 text-white hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-300 dark:focus:ring-rose-600 shadow-sm"
                          onClick={() => handleDeleteItem(absIdx)}
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <button
            type="button"
            className="bg-primary-700 hover:bg-primary-800 text-white px-3 py-1 rounded mb-2"
            onClick={() => handleAddItem(kelompok)}
          >
            Tambah Item {kelompok}
          </button>
        </div>
      ))}

      {/* Modal Harga Satuan */}
      <DetailCreateProjectConstructionModal
        modal={modal}
        items={items}
        project={{ name, infrastruktur, lokasi, tahun: Number(tahun), volume: Number(volume) }}
        provinces={provinces}
        inflasiList={inflasiList}
        onClose={handleCloseModal}
        dispatch={dispatch}
      />
    </div>
  );
};

export default EditProjectConstruction;
