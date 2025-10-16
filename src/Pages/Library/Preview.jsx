import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { fetchProjects, fetchProjectById } from "../../Provider/Project/ProjectSlice";
import { resolveFromProject, selectCurrentVariant, selectResolved } from "../../Provider/Library/PreviewSlice";
import OpexChart from "../Opex/OpexChart";
import { setActiveInfra, setActiveTab } from "../../Provider/Opex/OpexSlice";
import { generatePreviewPdf, generatePreviewExcel } from "../../Provider/Library/PreviewSlice"; // NEW

const Card = ({ children }) => (
  <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">{children}</div>
);

// Parse project volume -> number (cbm)
const parseVol = (vol) => {
  if (vol === null || vol === undefined) return NaN;
  if (typeof vol === "number" && Number.isFinite(vol)) return vol;
  const s = String(vol).trim().toLowerCase();
  const m = s.match(/([\d.]+)\s*(k)?/);
  if (!m) return NaN;
  const num = parseFloat(m[1]);
  if (!Number.isFinite(num)) return NaN;
  const hasK = !!m[2] || s.includes("k");
  if (hasK || num <= 100) return Math.round(num * 1000);
  return Math.round(num);
};

// Nominal sizes for OPEX tabs
const vesselSizeMap = [
  { id: "3-5k", size: 4000 },
  { id: "5-6k", size: 5500 },
  { id: "6-8k", size: 7000 },
  { id: "8-12k", size: 10000 },
  { id: "12-15k", size: 13500 },
  { id: "15-20k", size: 20000 }, // 15-30K label
  { id: "20-30k", size: 35000 }, // 30-40K label
  { id: "30-40k", size: 45000 }, // 40-50K label
  { id: "30-70k", size: 60000 }, // 50-70K
  { id: "70k", size: 75000 },    // 70-80K
  { id: "80k", size: 80000 },
  { id: "70-80k", size: 100000 }, // 80-135K
  { id: "135-150k", size: 142500 },
  { id: "150-170k", size: 160000 },
  { id: "170-180k", size: 175000 },
];

const pickNearestTabId = (vol) => {
  if (!Number.isFinite(vol)) return "135-150k";
  let best = vesselSizeMap[0];
  let bestDiff = Math.abs(best.size - vol);
  for (let i = 1; i < vesselSizeMap.length; i++) {
    const cand = vesselSizeMap[i];
    const diff = Math.abs(cand.size - vol);
    if (diff < bestDiff || (diff === bestDiff && cand.size > best.size)) {
      best = cand;
      bestDiff = diff;
    }
  }
  return best.id;
};

const Preview = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const projects = useSelector((s) => s.projects.projects);
  const projectDetails = useSelector((s) => s.projects.selectedProjectDetails);
  const resolved = useSelector(selectResolved);
  const currentVariant = useSelector(selectCurrentVariant);

  // NEW: PDF export
  const pdfRef = useRef(null);
  const [pdfLoading, setPdfLoading] = useState(false);

  const downloadPdf = async () => {
    if (!pdfRef.current) return;
    setPdfLoading(true);
    try {
      await generatePreviewPdf(pdfRef.current, `${projectDetails?.name || "project"}-preview.pdf`); // CHANGED: use slice helper
    } catch (e) {
      console.error("PDF generation failed, falling back to print:", e);
      window.print();
    } finally {
      setPdfLoading(false);
    }
  };

  const downloadExcel = () => { // NEW
    generatePreviewExcel({
      projectDetails,
      currentVariant,
      resolved,
      title: "Project Library Preview",
    });
  };

  // Ensure projects are loaded
  useEffect(() => {
    if (!projects?.length) dispatch(fetchProjects());
  }, [dispatch, projects?.length]);

  // Load detail for the route id
  useEffect(() => {
    if (id) dispatch(fetchProjectById(id));
  }, [dispatch, id]);

  // Resolve variant when project changes
  useEffect(() => {
    if (!id || !projects?.length) return;
    const p = projects.find((x) => String(x.id) === String(id));
    if (p) dispatch(resolveFromProject(p));
  }, [dispatch, id, projects]);

  // NEW: re-resolve using full project details (ensures correct volume mapping for drawings)
  useEffect(() => {
    if (projectDetails?.id && String(projectDetails.id) === String(id)) {
      dispatch(resolveFromProject(projectDetails));
    }
  }, [dispatch, projectDetails, id]);

  // OPEX: set LNG Vessel and pick nearest tab by project volume
  useEffect(() => {
    if (!resolved?.group) return;
    // Prefer detailed record if available for accurate volume
    const p =
      (projectDetails && String(projectDetails.id) === String(id) && projectDetails) ||
      projects.find((x) => String(x.id) === String(id)) ||
      {};
    if (resolved.group === "LNGC" || resolved.group === "LNGBV") {
      const vol = parseVol(p.volume);
      const tabId = pickNearestTabId(vol);
      dispatch(setActiveInfra("lng-vessel"));
      dispatch(setActiveTab({ infraId: "lng-vessel", tabId }));
    }
  }, [dispatch, resolved, projects, id, projectDetails]);

  // Parameters for table
  const parameterRows = useMemo(() => {
    if (!currentVariant) return [];
    const md = currentVariant.params["Main Dimension"] || {};
    const ct = currentVariant.params["Cargo Tank"] || {};
    return [
      { group: "Main Dimension", items: [{ k: "LOA (Length Over All)", v: md.LOA }, { k: "Breadth", v: md.Breadth }, { k: "Deadweight", v: md.Deadweight }] },
      { group: "Cargo Tank", items: [{ k: "Type of Cargo Tank", v: ct["Type of Cargo Tank"] }, { k: "Gas Capacities", v: ct["Gas Capacities"] }] },
      { group: "Propeller Type", items: [{ k: "Propeller Type", v: currentVariant.params["Propeller Type"] }] },
    ];
  }, [currentVariant]);

  // NEW: Kelompok-only grouping + sorted items + totals (mirror ProjectDetail)
  const groupedKelompok = useMemo(() => {
    if (!projectDetails || !Array.isArray(projectDetails.constructionCosts)) return [];
    const groups = {};
    projectDetails.constructionCosts.forEach((item) => {
      const g = item.kelompok || "Lainnya";
      if (!groups[g]) groups[g] = [];
      groups[g].push(item);
    });
    return Object.keys(groups)
      .sort((a, b) => a.localeCompare(b))
      .map((group) => {
        const items = groups[group]
          .slice()
          .sort((a, b) => {
            const ak = a.workcode || a.kode || "";
            const bk = b.workcode || b.kode || "";
            if (ak && bk) {
              const lc = ak.localeCompare(bk, undefined, { numeric: true });
              if (lc !== 0) return lc;
            }
            return (a.uraian || "").localeCompare(b.uraian || "");
          });
        const groupTotal = items.reduce((s, it) => s + (it.totalHarga || 0), 0);
        return { group, items, groupTotal };
      });
  }, [projectDetails]);

  const costColumns = [
    { key: 'workcode', label: 'Workcode' },
    { key: 'uraian', label: 'Uraian' },
    { key: 'specification', label: 'Specification' },
    { key: 'qty', label: 'Qty', className: 'text-right' },
    { key: 'satuan', label: 'Satuan' },
    { key: 'hargaSatuan', label: 'Harga Satuan', className: 'text-right', isCurrency: true },
    { key: 'totalHarga', label: 'Total Harga', className: 'text-right', isCurrency: true },
    { key: 'aaceClass', label: 'AACE Class' },
    { key: 'accuracyLow', label: 'Accuracy Low', className: 'text-right' },
    { key: 'accuracyHigh', label: 'Accuracy High', className: 'text-right' },
    { key: 'tahun', label: 'Tahun', className: 'text-center' },
    { key: 'lokasi', label: 'Lokasi' },
    { key: 'satuanVolume', label: 'Satuan Volume' },
    { key: 'tipe', label: 'Tipe' },
  ];

  const formatCurrency = (value) => (value ? `Rp${Number(value).toLocaleString()}` : '-');

  // NEW: overall total like ProjectDetail
  const overallTotal = useMemo(
    () => groupedKelompok.reduce((s, g) => s + (g.groupTotal || 0), 0),
    [groupedKelompok]
  );

  // ADD BACK: used in CAPEX summary card
  const totalHarga =
    projectDetails?.totalConstructionCost?.toLocaleString?.() ??
    (projectDetails?.harga?.toLocaleString?.() ?? "-");

  return (
    <div className="space-y-6" ref={pdfRef}>
      <div className="flex items-center justify-between" data-html2canvas-ignore> {/* NEW */}
        <div>
          <div className="text-xl font-bold text-gray-900 dark:text-white">Project Library Preview</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Project: {projectDetails?.name || "-"}</div>
        </div>
        <div className="flex gap-2 print:hidden">
          <button
            onClick={downloadPdf}
            disabled={pdfLoading}
            className="inline-flex items-center h-9 px-3 rounded-md bg-primary-700 hover:bg-primary-800 text-white text-sm disabled:opacity-60"
            title="Download semua konten dalam 1 PDF"
          >
            {pdfLoading ? "Generating..." : "Download PDF"}
          </button>
          <button
            onClick={downloadExcel}
            className="inline-flex items-center h-9 px-3 rounded-md bg-green-600 hover:bg-green-700 text-white text-sm"
            title="Download Excel (TSV .xls)"
          >
            Download Excel
          </button>
          <Link
            to="/library"
            className="inline-flex items-center h-9 px-3 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          >
            Back to Library
          </Link>
        </div>
      </div>

      {/* Resolved info */}
      {currentVariant ? (
        <Card>
          <div className="text-sm text-gray-700 dark:text-gray-200">
            Resolved: <span className="font-semibold">{resolved.group}</span> — <span className="font-semibold">{currentVariant.label}</span>
          </div>
        </Card>
      ) : (
        <Card>
          <div className="text-sm text-rose-600">Unable to resolve infrastructure/volume for this project.</div>
        </Card>
      )}

      {/* Combined: Technical Parameters + Drawing (responsive, no cropping) */}
      {currentVariant && (
        <Card>
          <div className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Technical Specification & Drawing</div>
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Parameters */}
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs text-gray-700 dark:text-gray-200">
                <thead>
                  <tr className="text-left text-gray-600 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                    <th className="py-2 pr-3 font-semibold">No.</th>
                    <th className="py-2 pr-3 font-semibold">Parameter</th>
                    <th className="py-2 pr-3 font-semibold">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {parameterRows.flatMap((row, idx) => [
                    <tr key={`${row.group}-${idx}`} className="bg-gray-50 dark:bg-gray-700/40">
                      <td className="py-2 px-3 align-top font-semibold text-gray-900 dark:text-gray-100">{idx + 1}.</td>
                      <td className="py-2 px-3 align-top font-semibold text-gray-900 dark:text-gray-100">{row.group}</td>
                      <td className="py-2 px-3">
                        <div className="space-y-1">
                          {row.items.map((it) => (
                            <div key={it.k} className="flex gap-3">
                              <div className="w-56 text-gray-600 dark:text-gray-300">- {it.k}</div>
                              <div className="font-semibold text-gray-900 dark:text-white">{it.v}</div>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>,
                  ])}
                </tbody>
              </table>
            </div>

            {/* Drawing(s) with dynamic sizing */}
            <div className="space-y-4">
              {(currentVariant.drawings || []).map((d) => (
                <figure key={d.key} className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3">
                  <div className="w-full">
                    <img
                      alt={d.title}
                      src={d.url || "https://placehold.co/1200x800/1f2937/fff?text=Technical+Drawing"}
                      className="w-full h-auto object-contain"
                      style={{ maxHeight: 800 }}
                    />
                  </div>
                  <figcaption className="mt-2 text-xs text-gray-600 dark:text-gray-300">
                    {d.title}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* CAPEX summary */}
      {projectDetails && (
        <Card>
          <div className="text-lg font-semibold text-gray-900 dark:text-white mb-2">CAPEX — Project Construction Cost (Summary)</div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
            <div className="rounded-lg border border-gray-100 dark:border-gray-700 p-3">
              <div className="text-[10px] uppercase text-gray-500 dark:text-gray-400">Project</div>
              <div className="font-semibold text-gray-900 dark:text-white">{projectDetails.name}</div>
            </div>
            <div className="rounded-lg border border-gray-100 dark:border-gray-700 p-3">
              <div className="text-[10px] uppercase text-gray-500 dark:text-gray-400">Location</div>
              <div className="font-semibold text-gray-900 dark:text-white">{projectDetails.lokasi}</div>
            </div>
            <div className="rounded-lg border border-gray-100 dark:border-gray-700 p-3">
              <div className="text-[10px] uppercase text-gray-500 dark:text-gray-400">Year</div>
              <div className="font-semibold text-gray-900 dark:text-white">{projectDetails.tahun}</div>
            </div>
            <div className="rounded-lg border border-gray-100 dark:border-gray-700 p-3">
              <div className="text-[10px] uppercase text-gray-500 dark:text-gray-400">Estimated Total</div>
              <div className="font-semibold text-gray-900 dark:text-white">Rp{totalHarga}</div>
            </div>
          </div>
        </Card>
      )}

      {/* Project Detail (full) */}
      {projectDetails && (
        <Card>
          <div className="flex items-center justify-between mb-3">
            <div className="text-lg font-semibold text-gray-900 dark:text-white">Project Detail</div>
          </div>

          <div className="mb-4 flex flex-wrap gap-2 text-xs">
            <span className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">{projectDetails.infrastruktur}</span>
            <span className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">Tahun {projectDetails.tahun}</span>
            <span className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">Lokasi: {projectDetails.lokasi}</span>
            <span className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">Inflasi: {projectDetails.inflasi ?? "-"}</span>
            <span className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">Kategori: {projectDetails.kategori}</span>
            <span className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">Volume: {projectDetails.volume}</span>
          </div>

          {Array.isArray(projectDetails.constructionCosts) && projectDetails.constructionCosts.length > 0 ? (
            <div className="overflow-x-auto rounded-lg border border-gray-100 dark:border-gray-800">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300 sticky top-0">
                  <tr>
                    {costColumns.map((col) => (
                      <th
                        key={col.key}
                        className={`px-3 py-2 border-b border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 ${col.className || ''}`}
                      >
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {groupedKelompok.map((g) => (
                    <React.Fragment key={g.group}>
                      {/* Kelompok header (biru) */}
                      <tr className="bg-blue-100 dark:bg-blue-900">
                        <td colSpan={costColumns.length} className="font-bold text-gray-900 dark:text-white py-2 px-3 uppercase">
                          {g.group}
                        </td>
                      </tr>

                      {/* Items */}
                      {g.items.map((cost, idx) => (
                        <tr key={`${g.group}-${idx}`} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900">
                          {costColumns.map((col) => (
                            <td
                              key={col.key}
                              className={`px-3 py-2 border-b border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 ${col.className || ''}`}
                            >
                              {col.isCurrency ? formatCurrency(cost[col.key]) : (cost[col.key] ?? '-')}
                            </td>
                          ))}
                        </tr>
                      ))}

                      {/* Total per kelompok */}
                      <tr className="bg-yellow-100 dark:bg-yellow-900 font-bold">
                        <td
                          colSpan={costColumns.length - 1}
                          className="px-3 py-2 border-b border-gray-200 dark:border-gray-700 text-right text-gray-900 dark:text-gray-100"
                        >
                          Total {g.group}
                        </td>
                        <td className="px-3 py-2 border-b border-gray-200 dark:border-gray-700 text-right text-gray-900 dark:text-gray-100">
                          {formatCurrency(g.groupTotal)}
                        </td>
                      </tr>
                    </React.Fragment>
                  ))}

                  {/* TOTAL keseluruhan */}
                  <tr className="bg-orange-200 dark:bg-orange-700 font-bold">
                    <td colSpan={costColumns.length - 1} className="px-3 py-2 text-right text-gray-900 dark:text-white">
                      TOTAL
                    </td>
                    <td className="px-3 py-2 text-right text-gray-900 dark:text-white">
                      {formatCurrency(overallTotal)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-gray-400 dark:text-gray-300">Tidak ada construction cost.</div>
          )}
        </Card>
      )}

      {/* OPEX */}
      <Card>
        <div className="text-lg font-semibold text-gray-900 dark:text-white mb-2">OPEX</div>
        <OpexChart />
      </Card>
    </div>
  );
};

export default Preview;
