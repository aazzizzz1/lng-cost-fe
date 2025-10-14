import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import html2canvas from "html2canvas"; // NEW
import { jsPDF } from "jspdf"; // NEW
import axios from "axios";
import Cookies from "js-cookie";

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

// NEW: auth header helper (optional; will include token if present)
const getAuthHeaders = () => {
  const token = Cookies.get('accessToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// NEW: fetch only approved projects for Library
export const fetchApprovedLibraryProjects = createAsyncThunk(
  "libraryPreview/fetchApprovedLibraryProjects",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API}/projects/library`, {
        headers: getAuthHeaders(),
      });
      return res.data?.data || [];
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// NEW: helper to group costs (kelompok -> kelompokDetail)
function groupCostsTree(constructionCosts = []) {
  const groups = {};
  constructionCosts.forEach((item) => {
    const g = item.kelompok || "Lainnya";
    const sg = item.kelompokDetail || "Lainnya";
    if (!groups[g]) groups[g] = {};
    if (!groups[g][sg]) groups[g][sg] = [];
    groups[g][sg].push(item);
  });
  return Object.keys(groups)
    .sort((a, b) => a.localeCompare(b))
    .map((group) => ({
      group,
      subgroups: Object.keys(groups[group])
        .sort((a, b) => a.localeCompare(b))
        .map((subgroup) => ({ subgroup, items: groups[group][subgroup] })),
    }));
}

// NEW: export entire preview area into one multi-page PDF
export async function generatePreviewPdf(element, filename = "preview.pdf") {
  if (!element) throw new Error("Missing element ref for PDF");
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: "#ffffff",
    windowWidth: element.scrollWidth,
  });
  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "pt", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // Use image properties for aspect ratio
  const imgProps = pdf.getImageProperties(imgData);
  const pdfWidth = pageWidth;
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

  let heightLeft = pdfHeight;
  let position = 0;
  pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
  heightLeft -= pageHeight;

  while (heightLeft > 0) {
    position = heightLeft - pdfHeight;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
    heightLeft -= pageHeight;
  }

  pdf.save(filename);
}

// NEW: build and download recap-like Excel (TSV in .xls)
export function generatePreviewExcel({ projectDetails, currentVariant, resolved, title = "Project Library Preview" }) {
  const rows = [];
  const pd = projectDetails || {};
  const totalHarga = pd?.totalConstructionCost ?? pd?.harga ?? 0;

  // Title + Summary
  rows.push([title]);
  rows.push([]);
  rows.push(["Project", pd.name || ""]);
  rows.push(["Infrastructure", pd.infrastruktur || ""]);
  rows.push(["Location", pd.lokasi || ""]);
  rows.push(["Year", pd.tahun || ""]);
  rows.push(["Estimated Total (IDR)", totalHarga]);
  rows.push(["Resolved", `${resolved?.group || "-"} — ${currentVariant?.label || "-"}`]);
  rows.push([]);

  // Parameters
  if (currentVariant) {
    rows.push(["Parameters"]);
    const md = currentVariant.params?.["Main Dimension"] || {};
    const ct = currentVariant.params?.["Cargo Tank"] || {};
    rows.push(["Main Dimension"]);
    rows.push(["", "LOA (Length Over All)", md.LOA || ""]);
    rows.push(["", "Breadth", md.Breadth || ""]);
    rows.push(["", "Deadweight", md.Deadweight || ""]);
    rows.push(["Cargo Tank"]);
    rows.push(["", "Type of Cargo Tank", ct["Type of Cargo Tank"] || ""]);
    rows.push(["", "Gas Capacities", ct["Gas Capacities"] || ""]);
    rows.push(["Propeller Type", currentVariant.params?.["Propeller Type"] || ""]);
    rows.push([]);
  }

  // Drawings
  if (currentVariant?.drawings?.length) {
    rows.push(["Technical Drawings"]);
    rows.push(["Title", "URL"]);
    currentVariant.drawings.forEach((d) => {
      rows.push([d.title || "-", d.url || "-"]);
    });
    rows.push([]);
  }

  // Construction Costs (grouped)
  const tree = groupCostsTree(pd.constructionCosts || []);
  if (tree.length) {
    rows.push(["Construction Costs"]);
    rows.push(["Workcode", "Uraian", "Specification", "Qty", "Satuan", "Harga Satuan", "Total Harga", "AACE Class", "Kelompok", "Kelompok Detail"]);
    tree.forEach((g) => {
      rows.push([]);
      rows.push([g.group.toUpperCase()]);
      g.subgroups.forEach((sg) => {
        rows.push([sg.subgroup]);
        sg.items.forEach((it) => {
          rows.push([
            it.workcode || "",
            it.uraian || "",
            it.specification || "",
            it.qty ?? "",
            it.satuan || "",
            it.hargaSatuan ?? "",
            it.totalHarga ?? "",
            it.aaceClass ?? "",
            it.kelompok || "",
            it.kelompokDetail || "",
          ]);
        });
      });
    });
    rows.push([]);
    rows.push(["TOTAL", "", "", "", "", "", (pd.totalConstructionCost ?? 0)]);
    rows.push(["PPN 11%", "", "", "", "", "", (pd.ppn ?? 0)]);
    rows.push(["GRAND TOTAL TERMASUK PPN", "", "", "", "", "", (pd.totalEstimation ?? (pd.totalConstructionCost ?? 0) + (pd.ppn ?? 0))]);
  }

  // Download as .xls (TSV)
  const tsv = rows.map((r) => r.map((c) => (c === null || c === undefined ? "" : String(c))).join("\t")).join("\n");
  const blob = new Blob([tsv], { type: "text/tab-separated-values;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${(pd.name || "project").replace(/\s+/g, "_")}_preview.xls`;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}

const previewSlice = createSlice({
  name: "libraryPreview",
  initialState: {
    catalog,
    selectedProjectId: null,
    resolved: { group: null, variant: null },
    // NEW: library-approved projects state
    approvedProjects: [],
    approvedLoading: false,
    approvedError: null,
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
  extraReducers: (builder) => {
    // ...existing code...
    // NEW: reducers for approved library projects
    builder
      .addCase(fetchApprovedLibraryProjects.pending, (state) => {
        state.approvedLoading = true;
        state.approvedError = null;
      })
      .addCase(fetchApprovedLibraryProjects.fulfilled, (state, action) => {
        state.approvedLoading = false;
        state.approvedProjects = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchApprovedLibraryProjects.rejected, (state, action) => {
        state.approvedLoading = false;
        state.approvedError = action.payload || "Failed to load approved projects";
      });
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
// NEW: selector for approved projects
export const selectApprovedLibraryProjects = (s) => s.libraryPreview.approvedProjects;

export default previewSlice.reducer;