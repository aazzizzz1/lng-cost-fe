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
      inflasi: project?.inflasi ?? 0, // NEW include inflasi
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

  return (
    <div className="p-4">
      {/* text gambaran umum judul */}
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        Gambaran Umum Project
      </h1>
      {/* Gambaran Umum Project */}
      <div className="mb-6 bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
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
              <div className="text-lg font-bold mb-2 text-primary-700 dark:text-primary-300 uppercase tracking-wide">{kelompok}</div>
              <div className="overflow-x-auto">
                <table className="w-full mb-2 border dark:border-gray-700 bg-white dark:bg-gray-900 rounded">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-800">
                      <th className="px-4 py-2 border dark:border-gray-700 text-gray-900 dark:text-white">Kode</th>
                      <th className="px-4 py-2 border dark:border-gray-700 text-gray-900 dark:text-white">Workcode</th>
                      <th className="px-4 py-2 border dark:border-gray-700 text-gray-900 dark:text-white">Uraian</th>
                      <th className="px-4 py-2 border dark:border-gray-700 text-gray-900 dark:text-white">Specification</th>
                      <th className="px-4 py-2 border dark:border-gray-700 text-gray-900 dark:text-white">Satuan</th>
                      <th className="px-4 py-2 border dark:border-gray-700 text-gray-900 dark:text-white">Qty</th>
                      <th className="px-4 py-2 border dark:border-gray-700 text-gray-900 dark:text-white">Harga Satuan</th>
                      <th className="px-4 py-2 border dark:border-gray-700 text-gray-900 dark:text-white">Total Harga</th>
                      <th className="px-4 py-2 border dark:border-gray-700 text-gray-900 dark:text-white">AACE Class</th>
                      <th className="px-4 py-2 border dark:border-gray-700 text-gray-900 dark:text-white">Kelompok Detail</th>
                      <th className="px-4 py-2 border dark:border-gray-700 text-gray-900 dark:text-white">Satuan Volume</th>
                    </tr>
                  </thead>
                  <tbody>
                    {grouped[kelompok].map((item, idx) => {
                      const absIdx = recommendedCosts.findIndex((it) => it === item);
                      return (
                        <tr
                          key={absIdx}
                          className={item.isCategory ? "bg-gray-50 dark:bg-gray-800 font-semibold" : "bg-white dark:bg-gray-900"}
                        >
                          <td className="border dark:border-gray-700 px-4 py-2 text-gray-900 dark:text-white">
                            {item.workcode || item.kode || item.id}
                          </td>

                          <td className="border dark:border-gray-700 px-4 py-2 text-gray-900 dark:text-white">
                            {item.workcode || '-'}
                          </td>

                          <td className="border dark:border-gray-700 px-4 py-2 text-gray-900 dark:text-white">
                            {item.uraian || '-'}
                          </td>

                          <td className="border dark:border-gray-700 px-4 py-2 text-gray-900 dark:text-white">
                            {item.specification || '-'}
                          </td>

                          <td className="border dark:border-gray-700 px-4 py-2 text-gray-900 dark:text-white">
                            {item.satuan || '-'}
                          </td>

                          <td className="border dark:border-gray-700 px-4 py-2 text-gray-900 dark:text-white">
                            {item.qty ?? '-'}
                          </td>

                          <td className="border dark:border-gray-700 px-4 py-2 text-gray-900 dark:text-white">
                            {item.hargaSatuan != null ? `Rp${Number(item.hargaSatuan).toLocaleString()}` : '-'}
                          </td>

                          <td className="border dark:border-gray-700 px-4 py-2 text-right text-gray-900 dark:text-white">
                            {item.totalHarga != null ? `Rp${Number(item.totalHarga).toLocaleString()}` : '-'}
                          </td>

                          <td className="border dark:border-gray-700 px-4 py-2 text-gray-900 dark:text-white">
                            {item.aaceClass ?? '-'}
                          </td>

                          <td className="border dark:border-gray-700 px-4 py-2 text-gray-900 dark:text-white">
                            {item.kelompokDetail || '-'}
                          </td>

                          <td className="border dark:border-gray-700 px-4 py-2 text-gray-900 dark:text-white">
                            {item.satuanVolume || '-'}
                          </td>
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