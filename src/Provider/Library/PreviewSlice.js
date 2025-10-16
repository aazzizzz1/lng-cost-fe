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
// change to exported to avoid no-unused-vars warning
export function groupCostsTree(constructionCosts = []) {
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

// NEW: build grouped-by-kelompok, styled HTML workbook for Excel
export function generatePreviewExcel({ projectDetails, currentVariant, resolved, title = "Project Library Preview" }) {
  const pd = projectDetails || {};
  const costs = Array.isArray(pd.constructionCosts) ? pd.constructionCosts : [];

  // Columns matching UI
  const columns = [
    { key: 'workcode', label: 'Workcode' },
    { key: 'uraian', label: 'Uraian' },
    { key: 'specification', label: 'Specification' },
    { key: 'qty', label: 'Qty', align: 'right' },
    { key: 'satuan', label: 'Satuan' },
    { key: 'hargaSatuan', label: 'Harga Satuan', align: 'right', currency: true },
    { key: 'totalHarga', label: 'Total Harga', align: 'right', currency: true },
    { key: 'aaceClass', label: 'AACE Class' },
    { key: 'accuracyLow', label: 'Accuracy Low', align: 'right' },
    { key: 'accuracyHigh', label: 'Accuracy High', align: 'right' },
    { key: 'tahun', label: 'Tahun', align: 'center' },
    { key: 'lokasi', label: 'Lokasi' },
    { key: 'satuanVolume', label: 'Satuan Volume' },
    { key: 'tipe', label: 'Tipe' },
  ];

  // Group by kelompok only (mirror UI)
  const groupsMap = {};
  costs.forEach((it) => {
    const g = it.kelompok || 'Lainnya';
    if (!groupsMap[g]) groupsMap[g] = [];
    groupsMap[g].push(it);
  });
  const groups = Object.keys(groupsMap).sort((a,b)=>a.localeCompare(b)).map((g)=> {
    const items = groupsMap[g].slice().sort((a,b) => {
      const ak = a.workcode || a.kode || '';
      const bk = b.workcode || b.kode || '';
      if (ak && bk) {
        const lc = ak.localeCompare(bk, undefined, { numeric: true });
        if (lc !== 0) return lc;
      }
      return (a.uraian || '').localeCompare(b.uraian || '');
    });
    const total = items.reduce((s, it)=> s + (Number(it.totalHarga) || 0), 0);
    return { name: g, items, total };
  });
  const overallTotal = groups.reduce((s, g)=> s + g.total, 0);

  const summaryRows = [
    ['Project', pd.name || ''],
    ['Infrastructure', pd.infrastruktur || ''],
    ['Location', pd.lokasi || ''],
    ['Year', pd.tahun || ''],
    ['Estimated Total (IDR)', (pd.totalConstructionCost ?? pd.harga ?? 0)],
    ['Resolved', `${resolved?.group || '-'} — ${currentVariant?.label || '-'}`],
  ];

  const th = columns.map(c =>
    `<th style="border:1px solid #e5e7eb;padding:6px 8px;background:#f3f4f6;color:#374151;text-align:${c.align || 'left'};font-weight:600;">${c.label}</th>`
  ).join('');

  const groupsHtml = groups.map(g => {
    const header = `
      <tr>
        <td colspan="${columns.length}" style="background:#dbeafe;color:#111827;padding:8px 10px;font-weight:700;border:1px solid #e5e7eb;text-transform:uppercase;">
          ${g.name}
        </td>
      </tr>`;
    const rows = g.items.map(item => `
      <tr>
        ${columns.map(c => {
          const valRaw = item[c.key];
          const v = c.currency ? (valRaw ? `Rp${Number(valRaw).toLocaleString()}` : '-') : (valRaw ?? '-');
          return `<td style="border:1px solid #e5e7eb;padding:6px 8px;color:#111827;text-align:${c.align || 'left'};">${v}</td>`;
        }).join('')}
      </tr>`
    ).join('');
    const total = `
      <tr>
        <td colspan="${columns.length - 1}" style="background:#fef3c7;color:#111827;padding:8px 10px;font-weight:700;border:1px solid #e5e7eb;text-align:right;">Total ${g.name}</td>
        <td style="background:#fef3c7;color:#111827;padding:8px 10px;font-weight:700;border:1px solid #e5e7eb;text-align:right;">Rp${Number(g.total).toLocaleString()}</td>
      </tr>`;
    return header + rows + total;
  }).join('');

  const overallRow = `
    <tr>
      <td colspan="${columns.length - 1}" style="background:#fed7aa;color:#111827;padding:8px 10px;font-weight:700;border:1px solid #e5e7eb;text-align:right;">TOTAL</td>
      <td style="background:#fed7aa;color:#111827;padding:8px 10px;font-weight:700;border:1px solid #e5e7eb;text-align:right;">Rp${Number(overallTotal).toLocaleString()}</td>
    </tr>`;

  const summaryTable = `
    <table cellspacing="0" cellpadding="0" style="border-collapse:collapse;margin-bottom:12px;">
      ${summaryRows.map(r => `
        <tr>
          <td style="padding:4px 8px;border:1px solid #e5e7eb;background:#f9fafb;font-weight:600;color:#374151;">${r[0]}</td>
          <td style="padding:4px 8px;border:1px solid #e5e7eb;color:#111827;">${r[1]}</td>
        </tr>`).join('')}
    </table>`;

  const costsTable = `
    <table cellspacing="0" cellpadding="0" style="border-collapse:collapse;width:100%;font-family:Arial,Helvetica,sans-serif;font-size:12px;">
      <thead><tr>${th}</tr></thead>
      <tbody>
        ${groupsHtml}
        ${overallRow}
      </tbody>
    </table>`;

  const drawingsHtml = (currentVariant?.drawings || []).length
    ? `
      <h3 style="font-family:Arial,Helvetica,sans-serif;color:#111827;margin:14px 0 6px;">Technical Drawings</h3>
      <table cellspacing="0" cellpadding="0" style="border-collapse:collapse;margin-bottom:12px;">
        <tr>
          <th style="border:1px solid #e5e7eb;padding:6px 8px;background:#f3f4f6;color:#374151;text-align:left;font-weight:600;">Title</th>
          <th style="border:1px solid #e5e7eb;padding:6px 8px;background:#f3f4f6;color:#374151;text-align:left;font-weight:600;">URL</th>
        </tr>
        ${(currentVariant.drawings || []).map(d => `
          <tr>
            <td style="border:1px solid #e5e7eb;padding:6px 8px;color:#111827;">${d.title || '-'}</td>
            <td style="border:1px solid #e5e7eb;padding:6px 8px;color:#2563eb;text-decoration:underline;">${d.url || '-'}</td>
          </tr>
        `).join('')}
      </table>`
    : '';

  const html = `
    <!DOCTYPE html>
    <html><head><meta charset="utf-8"><title>${title}</title></head>
    <body>
      <h2 style="font-family:Arial,Helvetica,sans-serif;color:#111827;">${title}</h2>
      ${summaryTable}
      ${drawingsHtml}
      ${costsTable}
    </body></html>`;

  const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${(pd.name || 'project').replace(/\s+/g, '_')}_preview.xls`;
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
        state.approvedProjects = [];
      });
  },
});

export const { setSelectedProjectId, setResolved, resolveFromProject } = previewSlice.actions;

// NEW: selectors (needed by LibraryPages, Preview, RecapModal)
export const selectLibraryState = (s) => s.libraryPreview;
export const selectCatalog = (s) => s.libraryPreview.catalog;
export const selectResolved = (s) => s.libraryPreview.resolved;
export const selectCurrentVariant = (s) => {
  const { resolved, catalog } = s.libraryPreview;
  return resolved.group && resolved.variant ? catalog[resolved.group]?.[resolved.variant] : null;
};
export const selectApprovedLibraryProjects = (s) => s.libraryPreview.approvedProjects;

export default previewSlice.reducer;