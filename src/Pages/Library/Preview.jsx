import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { fetchProjects, fetchProjectById } from "../../Provider/Project/ProjectSlice";
import { resolveFromProject, selectCurrentVariant, selectResolved } from "../../Provider/Library/PreviewSlice";
import OpexChart from "../Opex/OpexChart";
import { setActiveInfra, setActiveTab } from "../../Provider/Opex/OpexSlice";

const Card = ({ children }) => (
  <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">{children}</div>
);

// Simple thumbnail placeholder
const DrawingCard = ({ item }) => {
  const thumb = item.url || "https://placehold.co/640x360/1f2937/fff?text=Technical+Drawing";
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden flex flex-col">
      <img alt={item.title} src={thumb} className="w-full h-40 object-cover" />
      <div className="p-3 flex-1 flex flex-col">
        <div className="font-semibold text-gray-900 dark:text-white">{item.title}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">Image (PNG)</div>
        <div className="mt-auto flex gap-2">
          <a href={item.url} target="_blank" rel="noreferrer" className="flex-1 inline-flex justify-center items-center h-9 rounded-md bg-primary-700 text-white hover:bg-primary-800 text-sm">Open</a>
          <a href={item.url} download className="inline-flex justify-center items-center h-9 px-3 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 text-sm">Download</a>
        </div>
      </div>
    </div>
  );
};

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

  const totalHarga = projectDetails?.totalConstructionCost?.toLocaleString?.()
    ?? (projectDetails?.harga?.toLocaleString?.() ?? "-");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xl font-bold text-gray-900 dark:text-white">Project Library Preview</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Project: {projectDetails?.name || "-"}</div>
        </div>
        <Link
          to="/library"
          className="inline-flex items-center h-9 px-3 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
        >
          Back to Library
        </Link>
      </div>

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

      {currentVariant && (
        <Card>
          <div className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Parameters</div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs">
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
                    <td className="py-2 px-3 align-top font-semibold">{idx + 1}.</td>
                    <td className="py-2 px-3 align-top font-semibold">{row.group}</td>
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
        </Card>
      )}

      {currentVariant && (
        <Card>
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold text-gray-900 dark:text-white">Technical Drawings</div>
            <div>
              <a
                href={currentVariant.drawings?.[0]?.url || "#"}
                className="inline-flex items-center gap-2 rounded-md bg-primary-700 hover:bg-primary-800 text-white text-sm px-3 py-2"
                download
              >
                Download Image
              </a>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            {(currentVariant.drawings || []).map((d) => <DrawingCard key={d.key} item={d} />)}
          </div>
        </Card>
      )}

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

      <Card>
        <div className="text-lg font-semibold text-gray-900 dark:text-white mb-2">OPEX</div>
        <OpexChart />
      </Card>
    </div>
  );
};

export default Preview;
