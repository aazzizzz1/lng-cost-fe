import { createSlice } from "@reduxjs/toolkit";

// Resolve LNGBV images from src (support a couple of common filename variants)
let IMG_LNGBV_5K, IMG_LNGBV_10K, IMG_LNGBV_15K;
try { IMG_LNGBV_5K = require("../../Assets/Images/Drawing/LNGBV/GA-LNGBV-5000-M3.jpg"); } catch {}
try { if (!IMG_LNGBV_5K) IMG_LNGBV_5K = require("../../Assets/Images/Drawing/LNGBV/GA-LNGBV-5000-M3.jpg"); } catch {}
try { IMG_LNGBV_10K = require("../../Assets/Images/Drawing/LNGBV/GA-LNGBV-10000-M3.jpg"); } catch {}
try { if (!IMG_LNGBV_10K) IMG_LNGBV_10K = require("../../Assets/Images/Drawing/LNGBV/GA-LNGBV-10000-M3.jpg"); } catch {}
try { IMG_LNGBV_15K = require("../../Assets/Images/Drawing/LNGBV/GA-LNGBV-15000-M3.jpg"); } catch {}
try { if (!IMG_LNGBV_15K) IMG_LNGBV_15K = require("../../Assets/Images/Drawing/LNGBV/GA-LNGBV-15000-M3.jpg"); } catch {}

// Helper: build FSRU drawing set per capacity (5k/10k/15k) — SINGLE PNG per cap
const fsruDrawings = (cap) => {
  const capNum = String(cap).replace(/[^\d]/g, "");
  const cbmLabel = capNum ? `${Number(capNum).toLocaleString()} CBM` : cap.toUpperCase();
  const url =
    cap === "5k" ? IMG_LNGBV_5K :
    cap === "10k" ? IMG_LNGBV_10K :
    cap === "15k" ? IMG_LNGBV_15K :
    undefined;
  return [
    {
      key: "gl",
      title: `General Arrangement — LNGBV ${cbmLabel}`,
      url: url || "", // empty string if image not found
    },
  ];
};

/**
 * Simple catalog built from the provided matrix.
 * Keyed by infraGroup and variant keys.
 */
const catalog = {
  LNGC: {
    Rina: {
      label: "LNGC — Rina",
      params: {
        "Main Dimension": { LOA: "162.5", Breadth: "24.4", Deadweight: "12,500" },
        "Cargo Tank": { "Type of Cargo Tank": "Cylindrical", "Gas Capacities": "20k" },
        "Propeller Type": "Azimuth",
      },
      drawings: [
        { key: "ga", title: "General Arrangement", url: "/assets/drawings/lngc/rina/GA.pdf" },
        { key: "pfd", title: "Process Flow Diagram", url: "/assets/drawings/lngc/rina/PFD.pdf" },
        { key: "pidi", title: "Piping & Instrumentation", url: "/assets/drawings/lngc/rina/PID.pdf" },
      ],
    },
    Cssc: {
      label: "LNGC — Cssc",
      params: {
        "Main Dimension": { LOA: "159.9", Breadth: "24", Deadweight: "12,300" },
        "Cargo Tank": { "Type of Cargo Tank": "Bi-Lobe", "Gas Capacities": "20k" },
        "Propeller Type": "CPP",
      },
      drawings: [
        { key: "ga", title: "General Arrangement", url: "/assets/drawings/lngc/cssc/GA.pdf" },
        { key: "pfd", title: "Process Flow Diagram", url: "/assets/drawings/lngc/cssc/PFD.pdf" },
        { key: "pidi", title: "Piping & Instrumentation", url: "/assets/drawings/lngc/cssc/PID.pdf" },
      ],
    },
    Cimc: {
      label: "LNGC — Cimc",
      params: {
        "Main Dimension": { LOA: "159.9", Breadth: "25", Deadweight: "12,300" },
        "Cargo Tank": { "Type of Cargo Tank": "Cylindrical", "Gas Capacities": "20k" },
        "Propeller Type": "CPP",
      },
      drawings: [
        { key: "ga", title: "General Arrangement", url: "/assets/drawings/lngc/cimc/GA.pdf" },
        { key: "pfd", title: "Process Flow Diagram", url: "/assets/drawings/lngc/cimc/PFD.pdf" },
        { key: "pidi", title: "Piping & Instrumentation", url: "/assets/drawings/lngc/cimc/PID.pdf" },
      ],
    },
  },
  LNGBV: {
    "5k": {
      label: "LNGBV — 5k",
      params: {
        "Main Dimension": { LOA: "99.5", Breadth: "18", Deadweight: "-" },
        "Cargo Tank": { "Type of Cargo Tank": "Cylindrical", "Gas Capacities": "5k" },
        "Propeller Type": "CPP",
      },
      drawings: fsruDrawings("5k"),
    },
    "10k": {
      label: "LNGBV — 10k",
      params: {
        "Main Dimension": { LOA: "124.7", Breadth: "21.8", Deadweight: "-" },
        "Cargo Tank": { "Type of Cargo Tank": "Cylindrical", "Gas Capacities": "10k" },
        "Propeller Type": "CPP",
      },
      drawings: fsruDrawings("10k"),
    },
    "15k": {
      label: "LNGBV — 15k",
      params: {
        "Main Dimension": { LOA: "155.5", Breadth: "22", Deadweight: "-" },
        "Cargo Tank": { "Type of Cargo Tank": "Cylindrical", "Gas Capacities": "15k" },
        "Propeller Type": "CPP",
      },
      drawings: fsruDrawings("15k"),
    },
  },
};

// Helper: pick the raw volume from multiple possible fields
const pickProjectVolumeRaw = (project) =>
  project?.volume ??
  project?.kapasitas ??
  project?.capacity ??
  project?.volumeCbm ?? project?.volumeCBM ??
  project?.kapasitasCbm ?? project?.kapasitasCBM ??
  project?.kapasitas_m3 ?? project?.kapasitasM3 ??
  undefined;

// Helpers: parse volume and pick nearest capacity with tie going upward
const parseVolumeToNumber = (vol) => {
  if (vol === null || vol === undefined) return NaN;
  if (typeof vol === "number" && Number.isFinite(vol)) return vol;

  // Normalize string: remove unit labels, keep digits, dots and commas for later normalization
  const raw = String(vol).toLowerCase().replace(/(cbm|m3|m\u00b3|meter\s?kubik|kapasitas|capacity)/g, "").trim();

  // If contains 'k', treat number before 'k' as thousands, allow decimals like "15.5k"
  if (raw.includes("k")) {
    const n = parseFloat(raw.replace(/[^0-9.]/g, ""));
    return Number.isFinite(n) ? Math.round(n * 1000) : NaN;
  }

  // Remove thousand separators: "15.000" -> "15000", "15,000" -> "15000"
  const noThousands = raw.replace(/[\s,]/g, "").replace(/\.(?=\d{3}\b)/g, "");
  const n = parseFloat(noThousands.replace(/[^0-9.]/g, ""));
  if (!Number.isFinite(n)) return NaN;

  // Heuristic: small integers (<=100) are in "k"
  return n <= 100 ? Math.round(n * 1000) : Math.round(n);
};

const pickNearestCapacity = (vol, capacities) => {
  // Tie goes to higher capacity
  let best = capacities[0];
  let bestDiff = Math.abs(capacities[0] - vol);
  for (let i = 1; i < capacities.length; i++) {
    const diff = Math.abs(capacities[i] - vol);
    if (diff < bestDiff || (diff === bestDiff && capacities[i] > best)) {
      best = capacities[i];
      bestDiff = diff;
    }
  }
  return best;
};

// Resolver: map ANY parsed volume to the nearest LNGBV capacity (5k/10k/15k) — single drawing per volume
export const resolveVariant = (project) => {
  if (!project) return { group: null, variant: null };

  const volRaw = pickProjectVolumeRaw(project);
  const volNum = parseVolumeToNumber(volRaw);

  if (Number.isFinite(volNum)) {
    const capacities = [5000, 10000, 15000];
    const chosen = pickNearestCapacity(volNum, capacities);
    if (chosen === 5000) return { group: "LNGBV", variant: "5k" };
    if (chosen === 10000) return { group: "LNGBV", variant: "10k" };
    return { group: "LNGBV", variant: "15k" };
  }

  // Fallbacks when volume is missing/unparseable
  const infra = (project.infrastruktur || project.infrastructure || "").toUpperCase().trim();
  if (infra.includes("LNGBV")) return { group: "LNGBV", variant: "10k" };
  if (infra.includes("LNGC") || infra.includes("CARRIER") || infra.includes("VESSEL"))
    return { group: "LNGBV", variant: "15k" }; // prefer closest available asset
  return { group: null, variant: null };
};

const previewSlice = createSlice({
  name: "libraryPreview",
  initialState: {
    catalog,
    selectedProjectId: null,
    resolved: { group: null, variant: null },
  },
  reducers: {
    setSelectedProjectId(state, action) {
      state.selectedProjectId = action.payload;
    },
    setResolved(state, action) {
      state.resolved = action.payload || { group: null, variant: null };
    },
    resolveFromProject(state, action) {
      state.resolved = resolveVariant(action.payload);
    },
  },
});

export const { setSelectedProjectId, setResolved, resolveFromProject } = previewSlice.actions;

// selectors
export const selectLibraryState = (s) => s.libraryPreview;
export const selectCatalog = (s) => s.libraryPreview.catalog;
export const selectResolved = (s) => s.libraryPreview.resolved;
export const selectCurrentVariant = (s) => {
  const { resolved, catalog } = s.libraryPreview;
  return resolved.group && resolved.variant ? catalog[resolved.group]?.[resolved.variant] : null;
};

export default previewSlice.reducer;