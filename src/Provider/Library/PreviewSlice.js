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

// ADD: static requires for other infrastructures (seperti LNGBV)
let IMG_LNGC_20K, IMG_LNGC_18K;
try { IMG_LNGC_20K = require("../../Assets/Images/Drawing/LNGC/20000.png"); } catch {}
try { IMG_LNGC_18K = require("../../Assets/Images/Drawing/LNGC/18000.png"); } catch {}

let IMG_SPB_4K, IMG_SPB_1K2;
try { IMG_SPB_4K = require("../../Assets/Images/Drawing/SPB/4000 m3.png"); } catch {}
try { IMG_SPB_1K2 = require("../../Assets/Images/Drawing/SPB/1200 m3.png"); } catch {}

let IMG_FSRU_83K;
try { IMG_FSRU_83K = require("../../Assets/Images/Drawing/FSRU/83000.png"); } catch {}

let IMG_TRUCK_52, IMG_TRUCK_39;
try { IMG_TRUCK_52 = require("../../Assets/Images/Drawing/LNG Trucking/52.5 m3.png"); } catch {}
try { IMG_TRUCK_39 = require("../../Assets/Images/Drawing/LNG Trucking/39.6 m3.png"); } catch {}

let IMG_ORU_PFD, IMG_ORF_PID;
try { IMG_ORU_PFD = require("../../Assets/Images/Drawing/ORU/2.2 MMSCFD.png"); } catch {}
try { IMG_ORF_PID = require("../../Assets/Images/Drawing/ORF/4.893 m3.png"); } catch {}

let IMG_MINI_LNG_PFD;
try { IMG_MINI_LNG_PFD = require("../../Assets/Images/Drawing/LNG Plant/2.5 MMSCFD.png"); } catch {}

let IMG_JETTY_LNGBV_2K, IMG_JETTY_LNGBV_3K5, IMG_JETTY_SPB_15K;
try { IMG_JETTY_LNGBV_2K = require("../../Assets/Images/Drawing/Jetty/2000 m3.png"); } catch {}
try { IMG_JETTY_LNGBV_3K5 = require("../../Assets/Images/Drawing/Jetty/3500 m3.png"); } catch {}
try { IMG_JETTY_SPB_15K = require("../../Assets/Images/Drawing/Jetty/15000.png"); } catch {}

// Helper: set gambar tunggal (judul dinamis)
const singleImageSet = (title, url) => [{ key: "ga", title, url: url || "" }];

/**
 * Katalog gambar + parameter per infrastruktur.
 * Nilai akan ditampilkan apa adanya oleh Preview.jsx (generik).
 */
const catalog = {
  LNGC: {
    "20k": {
      label: "LNG Carrier 20,000 m³",
      params: {
        "Main Dimension": { LOA: "159.9 m", Breadth: "24 m", Draught: "8 m" },
        "Cargo Tank": { Type: "Cylindrical", Capacity: "20,000 m³", Quantity: "3" },
        "Propeller Type": "CPP",
      },
      drawings: singleImageSet("General Arrangement — LNGC 20,000 m³", IMG_LNGC_20K),
    },
    "18k": {
      label: "LNG Carrier 18,000 m³",
      params: {
        "Main Dimension": { LOA: "143 m", Breadth: "25.2 m", Draught: "6.6 m" },
        "Cargo Tank": { Type: "Cylindrical", Capacity: "18,000 m³", Quantity: "2" },
        "Propeller Type": "CPP",
      },
      drawings: singleImageSet("General Arrangement — LNGC 18,000 m³", IMG_LNGC_18K),
    },
  },
  LNGBV: {
    "5k": {
      label: "LNGBV 5,000 m³",
      params: {
        "Main Dimension": { LOA: "≈99.5 m", Breadth: "≈18 m" },
        "Cargo Tank": { Type: "Cylindrical", Capacity: "5,000 m³" },
        "Propeller Type": "CPP",
      },
      drawings: singleImageSet("General Arrangement — LNGBV 5,000 m³", IMG_LNGBV_5K),
    },
    "10k": {
      label: "LNGBV 10,000 m³",
      params: {
        "Main Dimension": { LOA: "≈124.7 m", Breadth: "≈21.8 m" },
        "Cargo Tank": { Type: "Cylindrical", Capacity: "10,000 m³" },
        "Propeller Type": "CPP",
      },
      drawings: singleImageSet("General Arrangement — LNGBV 10,000 m³", IMG_LNGBV_10K),
    },
    "15k": {
      label: "LNGBV 15,000 m³",
      params: {
        "Main Dimension": { LOA: "≈155.5 m", Breadth: "≈22 m" },
        "Cargo Tank": { Type: "Cylindrical", Capacity: "15,000 m³" },
        "Propeller Type": "CPP",
      },
      drawings: singleImageSet("General Arrangement — LNGBV 15,000 m³", IMG_LNGBV_15K),
    },
  },
  SPB: {
    "4k": {
      label: "Self-Propelled Barge 4,000 m³",
      params: {
        "Main Dimension": { LOA: "75.7 m", Breadth: "20 m", Draught: "3 m" },
        "Cargo Tank": { Type: "Cylindrical", Capacity: "4,000 m³", Quantity: "1" },
        "Propeller Type": "FPP",
      },
      drawings: singleImageSet("General Arrangement — SPB 4,000 m³", IMG_SPB_4K),
    },
    "1k2": {
      label: "Self-Propelled Barge 1,200 m³",
      params: {
        "Main Dimension": { LOA: "66.8 m", Breadth: "15 m", Draught: "3 m" },
        "Cargo Tank": { Type: "Cylindrical", Capacity: "1,200 m³", Quantity: "3" },
        "Propeller Type": "FPP",
      },
      drawings: singleImageSet("General Arrangement — SPB 1,200 m³", IMG_SPB_1K2),
    },
  },
  FSRU: {
    "83k": {
      label: "FSRU 83,000 m³",
      params: {
        "Main Dimension": { LOA: "200 m", Breadth: "39.8 m", Draught: "7.7 m" },
        "Cargo Tank": { Type: "Cylindrical", Capacity: "83,000 m³", Quantity: "4" },
        "Propeller Type": "CPP",
      },
      drawings: singleImageSet("General Arrangement — FSRU 83,000 m³", IMG_FSRU_83K),
    },
  },
  TRUCK: {
    "52k": {
      label: "LNG Truck 52.5 m³",
      params: {
        "Main Dimension": { Length: "16.5 m", Width: "2.5 m", Height: "3.88 m" },
        "Tank": { Capacity: "52.5 m³" },
      },
      drawings: singleImageSet("General Arrangement — LNG Truck 52.5 m³", IMG_TRUCK_52),
    },
    "39k": {
      label: "LNG Truck 39.6 m³",
      params: {
        "Main Dimension": { Length: "12.98 m", Width: "2.5 m", Height: "3.88 m" },
        "Tank": { Capacity: "39.6 m³" },
      },
      drawings: singleImageSet("General Arrangement — LNG Truck 39.6 m³", IMG_TRUCK_39),
    },
  },
  ORU: {
    base: {
      label: "Onshore Regasification Unit (ORU)",
      params: {
        "Process": { Capacity: "≈12 MMSCFD", Pressure: "≈15.6 barg" },
      },
      drawings: singleImageSet("PFD — ORU (typical)", IMG_ORU_PFD),
    },
  },
  ORF: {
    base: {
      label: "Onshore Receiving Facility (ORF)",
      params: {
        "Metering & Conditioning": { Pressure: "≈16 barg", Capacity: "≈16.39 MMSCFD" },
      },
      drawings: singleImageSet("P&ID — ORF (typical)", IMG_ORF_PID),
    },
  },
  LNG_PLANT: {
    mini25: {
      label: "Mini LNG Plant — 2.5 MMSCFD",
      params: {
        "Plant Capacity": { Capacity: "2.5 MMSCFD" },
      },
      drawings: singleImageSet("PFD — Mini LNG Plant 2.5 MMSCFD", IMG_MINI_LNG_PFD),
    },
  },
  JETTY_LNGBV: {
    "2k": {
      label: "Jetty Layout — 2,000 CBM Vessel",
      params: {
        "Jetty": { Type: "Type-1", LOA: "≈83 m", Berth: "≈30 m" },
      },
      drawings: singleImageSet("Jetty Layout Type-1 (2,000 CBM)", IMG_JETTY_LNGBV_2K),
    },
    "3k5": {
      label: "Jetty Layout — 3,500 CBM Vessel",
      params: {
        "Jetty": { Type: "Type-2", LOA: "≈94.4 m", Berth: "≈35 m" },
      },
      drawings: singleImageSet("Jetty Layout Type-2 (3,500 CBM)", IMG_JETTY_LNGBV_3K5),
    },
  },
  JETTY_SPB: {
    "15k": {
      label: "Jetty Layout — up to 15,000 CBM Vessel",
      params: {
        "Jetty": { Type: "Type-3", LOA: "≈131.9 m", Berth: "≈30 m" },
      },
      drawings: singleImageSet("Jetty Layout Type-3 (6.5k–15k CBM)", IMG_JETTY_SPB_15K),
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

// Resolver: pilih variant berdasarkan infrastruktur + volume terdekat
export const resolveVariant = (project) => {
  if (!project) return { group: null, variant: null };

  const infraRaw = (project.infrastruktur || project.infrastructure || "").toLowerCase();
  const volRaw = pickProjectVolumeRaw(project);
  const volNum = parseVolumeToNumber(volRaw);

  const byVolume = (group, capsMap) => {
    const keys = Object.keys(capsMap);
    const caps = keys.map((k) => capsMap[k]);
    const chosen = Number.isFinite(volNum) ? pickNearestCapacity(volNum, caps) : null;
    const matchKey = chosen
      ? keys.find((k) => capsMap[k] === chosen)
      : keys[0];
    return { group, variant: matchKey };
  };

  // LNGBV first (hindari "bunker vessel" terdeteksi sebagai LNGC)
  if (/lngbv|bunker/.test(infraRaw)) {
    return byVolume("LNGBV", { "5k": 5000, "10k": 10000, "15k": 15000 });
  }
  // LNGC
  if (/lngc|carrier|vessel/.test(infraRaw)) {
    return byVolume("LNGC", { "18k": 18000, "20k": 20000 });
  }
  // SPB
  if (/spb|self[\s-]*propel/.test(infraRaw)) {
    return byVolume("SPB", { "1k2": 1200, "4k": 4000 });
  }
  // FSRU
  if (/fsru/.test(infraRaw)) {
    return { group: "FSRU", variant: "83k" };
  }
  // Truck
  if (/truck/.test(infraRaw)) {
    return byVolume("TRUCK", { "39k": 39600, "52k": 52500 });
  }
  // ORU
  if (/oru|regasification\s*unit/.test(infraRaw)) {
    return { group: "ORU", variant: "base" };
  }
  // ORF
  if (/orf|receiving\s*facility/.test(infraRaw)) {
    return { group: "ORF", variant: "base" };
  }
  // LNG Plant (onshore/offshore/mini)
  if (/plant/.test(infraRaw)) {
    return { group: "LNG_PLANT", variant: "mini25" };
  }
  // Jetty for LNGBV
  if (/jetty.*lngbv|lngbv.*jetty/.test(infraRaw)) {
    return byVolume("JETTY_LNGBV", { "2k": 2000, "3k5": 3500 });
  }
  // Jetty for SPB
  if (/jetty.*spb|spb.*jetty|dolphin.*spb/.test(infraRaw)) {
    return { group: "JETTY_SPB", variant: "15k" };
  }

  // Fallback ke LNGBV terdekat bila volume tersedia
  if (Number.isFinite(volNum)) {
    const capacities = [5000, 10000, 15000];
    const chosen = pickNearestCapacity(volNum, capacities);
    return chosen === 5000
      ? { group: "LNGBV", variant: "5k" }
      : chosen === 10000
      ? { group: "LNGBV", variant: "10k" }
      : { group: "LNGBV", variant: "15k" };
  }

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

/* eslint-disable no-unused-vars */
const previewSlice = createSlice({
  name: "libraryPreview",
  initialState: {
    // use the capacity-based catalog to enable nearest-volume resolution
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
/* eslint-enable no-unused-vars */

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