import React, { useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setFilterJenis } from '../../Provider/ConstructionCost/ConstractionCostSlice';
import {
  selectItems,
  closeModal,
  selectModal,
  fetchRecommendedConstructionCosts,
} from '../../Provider/Project/detailCreateProjectConstructionSlice';
import DetailCreateProjectConstructionModal from './DetailCreateProjectConstructionModal';
import { saveProjectWithCosts } from '../../Provider/Project/ProjectSlice';

const satuanByJenis = {
  "Onshore LNG Plant": "MTPA",
  "Offshore LNG Plant": "MTPA",
  "LNG Carrier": "m³",
  "LNGC": "m³",
  "LNG Trucking": "CBM",
  FSRU: "m³ / MMSCFD",
  ORF: "MMSCFD",
  OTS: "MMSCFD",
  ORU: "m³ / MMSCFD",
};

const DetailCreateProjectConstruction = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const projects = useSelector((state) => state.projects.projects);
  const project = projects.find((p) => String(p.id) === String(id));
  const items = useSelector(selectItems);
  const modal = useSelector(selectModal);
  const recommendedCosts = useSelector((state) => state.projects.recommendedCosts);
  const recommendedCostsLoading = useSelector((state) => state.projects.loadingRecommendedCosts); // Ensure correct selector

  // Memoize kelompokListUsed to avoid unnecessary recalculations
  const kelompokListUsed = useMemo(
    () => [...new Set(recommendedCosts.map((cost) => cost.kelompok))],
    [recommendedCosts]
  );

  // Fetch recommended construction costs on project change
  useEffect(() => {
    if (project) {
      dispatch(fetchRecommendedConstructionCosts({
        name: project.name,
        infrastruktur: project.infrastruktur,
        lokasi: project.lokasi,
        volume: project.volume,
        tahun: project.tahun,
        kategori: project.kategori,
        inflasi: project?.inflasi ?? 5.0, // use project's inflasi if present, fallback to 5.0
        satuan: satuanByJenis[project?.infrastruktur] || project?.satuan || "", // NEW: pass unit to API
      }));
    }
  }, [dispatch, project]);

  // Save to dummy construction cost slice
  const handleSave = () => {
    const projectData = {
      name: project?.name || "New Project",
      infrastruktur: project?.infrastruktur || "MID SCALE LNG BV",
      lokasi: project?.lokasi || "Riau",
      volume: project?.volume || 6000,
      tahun: project?.tahun || 2025,
      kategori: project?.kategori || "MID SCALE LNG BV",
      inflasi: project?.inflasi ?? 0,
      satuan: satuanByJenis[project?.infrastruktur] || project?.satuan || "", // NEW: include top-level unit
      levelAACE: 3,
      harga: 5000000000,
      constructionCosts: recommendedCosts.map((cost) => ({
        workcode: cost.workcode || "", // NEW
        uraian: cost.uraian,
        specification: cost.specification,
        qty: cost.qty,
        satuan: cost.satuan,
        hargaSatuan: cost.hargaSatuan,
        totalHarga: cost.totalHarga,
        aaceClass: cost.aaceClass,
        accuracyLow: cost.accuracyLow,
        accuracyHigh: cost.accuracyHigh,
        tahun: cost.tahun,
        infrastruktur: cost.infrastruktur,
        volume: cost.volume,
        satuanVolume: cost.satuanVolume,
        // kapasitasRegasifikasi: cost.kapasitasRegasifikasi, // REMOVED
        // satuanKapasitas: cost.satuanKapasitas,             // REMOVED
        kelompok: cost.kelompok,
        kelompokDetail: cost.kelompokDetail,
        lokasi: cost.lokasi,
        tipe: cost.tipe,
      })),
    };
    dispatch(saveProjectWithCosts(projectData));
    dispatch(setFilterJenis({ tipe: project?.jenis, proyek: project?.name }));
    navigate('/project');
  };

  // Group recommendedCosts by kelompok
  const grouped = kelompokListUsed.reduce((acc, kelompok) => {
    acc[kelompok] = recommendedCosts.filter((item) => item.kelompok === kelompok);
    return acc;
  }, {});

  // Fetch additional data for modal
  const provinces = useSelector((state) => state.administrator.provinces || []);
  const inflasiList = useSelector((state) => state.administrator.inflasi || []);

  const handleCloseModal = () => {
    dispatch(closeModal());
  };

  // compute inflasi displayed: prefer project.inflasi, fallback to inflasiList by year
  const inflasi = (() => {
    if (project?.inflasi !== undefined && project?.inflasi !== null) return project.inflasi;
    if (!project?.tahun) return "";
    const inf = inflasiList.find((i) => Number(i.year) === Number(project.tahun));
    return inf ? inf.value : "";
  })();

  // format currency helper
  const formatCurrency = (v) => (v || v === 0 ? `Rp${Number(v).toLocaleString()}` : '-');

  // total rekomendasi dari recommendedCosts
  const totalRecommended = useMemo(() => {
    return (recommendedCosts || []).reduce((sum, it) => sum + (Number(it.totalHarga) || 0), 0);
  }, [recommendedCosts]);

  // compute tax/insurance and grand total
  const ppn = totalRecommended * 0.11;
  const insurance = totalRecommended * 0.0025; // 2.5‰ = 0.25%
  const grandTotal = totalRecommended + ppn + insurance;

  return (
    <div className="p-6 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
      {/* text gambaran umum judul */}
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
        Gambaran Umum Project
      </h1>
      {/* Gambaran Umum Project */}
      <div className="mb-6 bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Nama Project</div>
            <div className="font-semibold text-gray-900 dark:text-white">{project?.name || "-"}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Volume</div>
            <div className="font-semibold text-gray-900 dark:text-white">
              {project?.volume ? project.volume : "-"} <span className="text-xs">{satuanByJenis[project?.infrastruktur] || "-"}</span>
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Kategori</div>
            <div className="font-semibold text-gray-900 dark:text-white">{project?.kategori || "-"}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Lokasi</div>
            <div className="font-semibold text-gray-900 dark:text-white">{project?.lokasi || "-"}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Tahun</div>
            <div className="font-semibold text-gray-900 dark:text-white">{project?.tahun || "-"}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Asumsi Inflasi (%)</div>
            <div className="font-semibold text-gray-900 dark:text-white">{inflasi !== "" ? inflasi : "-"}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Infrastruktur</div>
            <div className="font-semibold text-gray-900 dark:text-white">{project?.infrastruktur || "-"}</div>
          </div>
        </div>
      </div>
      {/* END Gambaran Umum Project */}

      {/* Summary cards (total harga, pajak, asuransi, grand total) */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-2xl p-4 bg-white dark:bg-gray-900 shadow-md border border-gray-100 dark:border-gray-800">
          <div className="text-xs text-gray-500">Total Rekomendasi</div>
          <div className="text-xl font-bold text-gray-900 dark:text-white mt-1">{formatCurrency(totalRecommended)}</div>
        </div>
        <div className="rounded-2xl p-4 bg-white/80 dark:bg-gray-900 shadow-md border border-gray-100 dark:border-gray-800">
          <div className="text-xs text-gray-500">PPN (11%)</div>
          <div className="text-lg font-semibold text-amber-600 mt-1">{formatCurrency(ppn)}</div>
        </div>
        <div className="rounded-2xl p-4 bg-white/80 dark:bg-gray-900 shadow-md border border-gray-100 dark:border-gray-800">
          <div className="text-xs text-gray-500">Asuransi (2.5‰)</div>
          <div className="text-lg font-semibold text-fuchsia-600 mt-1">{formatCurrency(insurance)}</div>
        </div>
        <div className="rounded-2xl p-4 bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg border border-primary-600">
          <div className="text-xs opacity-90">Grand Total</div>
          <div className="text-2xl font-extrabold mt-1">{formatCurrency(grandTotal)}</div>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
      >
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            className="bg-primary-700 hover:bg-primary-800 text-white px-6 py-2 rounded font-semibold"
          >
            Simpan
          </button>
        </div>
        {recommendedCostsLoading ? (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
            <div role="status">
              <svg
                aria-hidden="true"
                className="w-12 h-12 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : (
          kelompokListUsed.map((kelompok) => (
            <div key={kelompok} className="mb-8">
              <div className="text-base font-semibold mb-2 text-primary-700 dark:text-primary-300 uppercase tracking-wide">{kelompok}</div>

              <div className="overflow-x-auto rounded-lg shadow-sm">
                <table className="w-full text-sm table-auto bg-white dark:bg-gray-900 rounded">
                  <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0">
                    <tr>
                      <th className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 border-b">No</th>
                      <th className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 border-b">Workcode</th>
                      <th className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 border-b">Uraian</th>
                      <th className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 border-b">Specification</th>
                      <th className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 border-b">Satuan</th>
                      <th className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 border-b text-right">Qty</th>
                      <th className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 border-b text-right">Harga Satuan</th>
                      <th className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 border-b text-right">Total Harga</th>
                      <th className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 border-b">AACE Class</th>
                      <th className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 border-b">Kelompok Detail</th>
                      <th className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 border-b">Satuan Volume</th>
                    </tr>
                  </thead>

                  <tbody>
                    {grouped[kelompok].map((item) => {
                      const absIdx = recommendedCosts.findIndex((it) => it === item);
                      return (
                        <tr
                          key={absIdx}
                          className={`transition hover:bg-gray-50 dark:hover:bg-gray-800 ${item.isCategory ? "bg-gray-50 dark:bg-gray-800 font-semibold" : "bg-white dark:bg-gray-900"}`}
                        >
                          {/* tambahkan nomor */}
                          <td className="px-3 py-2 text-xs text-gray-900 dark:text-white border-b">{grouped[kelompok].indexOf(item) + 1}</td>
                          <td className="px-3 py-2 text-xs text-gray-900 dark:text-white border-b">{item.workcode || '-'}</td>
                          <td className="px-3 py-2 text-xs text-gray-900 dark:text-white border-b">{item.uraian || '-'}</td>
                          <td className="px-3 py-2 text-xs text-gray-900 dark:text-white border-b">{item.specification || '-'}</td>
                          <td className="px-3 py-2 text-xs text-gray-900 dark:text-white border-b">{item.satuan || '-'}</td>
                          <td className="px-3 py-2 text-xs text-gray-900 dark:text-white border-b text-right">{item.qty ?? '-'}</td>
                          <td className="px-3 py-2 text-xs text-gray-900 dark:text-white border-b text-right">{item.hargaSatuan != null ? `Rp${Number(item.hargaSatuan).toLocaleString()}` : '-'}</td>
                          <td className="px-3 py-2 text-xs text-gray-900 dark:text-white border-b text-right">{item.totalHarga != null ? `Rp${Number(item.totalHarga).toLocaleString()}` : '-'}</td>
                          <td className="px-3 py-2 text-xs text-gray-900 dark:text-white border-b">{item.aaceClass ?? '-'}</td>
                          <td className="px-3 py-2 text-xs text-gray-900 dark:text-white border-b">{item.kelompokDetail || '-'}</td>
                          <td className="px-3 py-2 text-xs text-gray-900 dark:text-white border-b">{item.satuanVolume || '-'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        )}
      </form>

      {/* Modal tetap dipertahankan (tidak ter-trigger di UI rekomendasi) */}
      <DetailCreateProjectConstructionModal
        modal={modal}
        items={items}
        project={project}
        provinces={provinces}
        inflasiList={inflasiList}
        onClose={handleCloseModal}
        dispatch={dispatch}
      />
    </div>
  );
};

export default DetailCreateProjectConstruction;