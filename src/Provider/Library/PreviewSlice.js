import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import axios from "axios";
import Cookies from "js-cookie";

// Resolve LNGBV images from src (support a couple of common filename variants)
let IMG_LNGBV_5K, IMG_LNGBV_10K, IMG_LNGBV_15K;
try { IMG_LNGBV_5K = require("../../Assets/Images/Drawing/LNGBV/GA-LNGBV-5000-M3.png"); } catch {}
try { if (!IMG_LNGBV_5K) IMG_LNGBV_5K = require("../../Assets/Images/Drawing/LNGBV/GA-LNGBV-5000-M3.png"); } catch {}
try { IMG_LNGBV_10K = require("../../Assets/Images/Drawing/LNGBV/GA-LNGBV-10000-M3.png"); } catch {}
try { if (!IMG_LNGBV_10K) IMG_LNGBV_10K = require("../../Assets/Images/Drawing/LNGBV/GA-LNGBV-10000-M3.png"); } catch {}
try { IMG_LNGBV_15K = require("../../Assets/Images/Drawing/LNGBV/GA-LNGBV-15000-M3.png"); } catch {}
try { if (!IMG_LNGBV_15K) IMG_LNGBV_15K = require("../../Assets/Images/Drawing/LNGBV/GA-LNGBV-15000-M3.png"); } catch {}

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

let IMG_ORU_PFD, IMG_ORF_PID_4893, IMG_ORF_PID_1639;
try { IMG_ORU_PFD = require("../../Assets/Images/Drawing/ORU/2.2 MMSCFD.png"); } catch {}
try { IMG_ORF_PID_4893 = require("../../Assets/Images/Drawing/ORF/4.893 m3.png"); } catch {}
try { IMG_ORF_PID_1639 = require("../../Assets/Images/Drawing/ORF/16.39 m3.png"); } catch {}

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
    "18k": {
      label: "LNG Carrier 18,000 m³",
      params: {
        "Main Dimension": {
          "Length Over All (LOA)": "143 M",
          "Breadth (B)": "25.2 M",
          "Draught (T)": "6.6 M",
          "Deadweight (DWT)": "- TON",
        },
        "Cargo Tank": { Capacity: "18,000 m³", Type: "CIRCULAR", Quantity: "2 PCS" },
        "Propulsion Type": "CPP",
      },
      drawings: singleImageSet("General Arrangement — LNGC 18,000 m³", IMG_LNGC_18K),
    },
    "20k": {
      label: "LNG Carrier 20,000 m³",
      params: {
        "Main Dimension": {
          "Length Over All (LOA)": "159.9 M",
          "Breadth (B)": "24 M",
          "Draught (T)": "8 M",
          "Deadweight (DWT)": "- TON",
        },
        "Cargo Tank": { Capacity: "20,000 m³", Type: "CIRCULAR", Quantity: "3 PCS" },
        "Propulsion Type": "CPP",
      },
      drawings: singleImageSet("General Arrangement — LNGC 20,000 m³", IMG_LNGC_20K),
    },
  },
  LNGBV: {
    "5k": {
      label: "LNGBV 5,000 m³",
      params: {
        "Main Dimension": {
          "Length Over All (LOA)": "99.90 M",
          "Breadth (B)": "18 M",
          "Draught (T)": "4.10 M",
          "Deadweight (DWT)": "- TON",
        },
        "Cargo Tank": { Capacity: "5,000 m³", Type: "CIRCULAR", Quantity: "2 PCS" },
        "Propulsion Type": "CPP",
      },
      drawings: singleImageSet("General Arrangement — LNGBV 5,000 m³", IMG_LNGBV_5K),
    },
    "10k": {
      label: "LNGBV 10,000 m³",
      params: {
        "Main Dimension": {
          "Length Over All (LOA)": "124.7 M",
          "Breadth (B)": "21.8 M",
          "Draught (T)": "5.6 M",
          "Deadweight (DWT)": "- TON",
        },
        "Cargo Tank": { Capacity: "10,000 m³", Type: "CIRCULAR", Quantity: "2 PCS" },
        "Propulsion Type": "CPP",
      },
      drawings: singleImageSet("General Arrangement — LNGBV 10,000 m³", IMG_LNGBV_10K),
    },
    "15k": {
      label: "LNGBV 15,000 m³",
      params: {
        "Main Dimension": {
          "Length Over All (LOA)": "155.5 M",
          "Breadth (B)": "22 M",
          "Draught (T)": "8.40 M",
          "Deadweight (DWT)": "- TON",
        },
        "Cargo Tank": { Capacity: "15,000 m³", Type: "CIRCULAR", Quantity: "2 PCS" },
        "Propulsion Type": "CPP",
      },
      drawings: singleImageSet("General Arrangement — LNGBV 15,000 m³", IMG_LNGBV_15K),
    },
  },
  SPB: {
    "1k2": {
      label: "Self-Propelled Barge 1,200 m³",
      params: {
        "Main Dimension": {
          "Length Over All (LOA)": "66.80 M",
          "Breadth (B)": "15 M",
          "Draught (T)": "3 M",
          "Deadweight (DWT)": "800 TON",
        },
        "Cargo Tank": { Capacity: "1,200 m³", Type: "CIRCULAR", Quantity: "3 PCS" },
        "Propulsion Type": "FPP",
      },
      drawings: singleImageSet("General Arrangement — SPB 1,200 m³", IMG_SPB_1K2),
    },
    "4k": {
      label: "Self-Propelled Barge 4,000 m³",
      params: {
        "Main Dimension": {
          "Length Over All (LOA)": "75.70 M",
          "Breadth (B)": "20 M",
          "Draught (T)": "3 M",
          "Deadweight (DWT)": "2,300 TON",
        },
        "Cargo Tank": { Capacity: "4,000 m³", Type: "CIRCULAR", Quantity: "1 PCS" },
        "Propulsion Type": "FPP",
      },
      drawings: singleImageSet("General Arrangement — SPB 4,000 m³", IMG_SPB_4K),
    },
  },
  FSRU: {
    "83k": {
      label: "FSRU 83,000 m³",
      params: {
        "Main Dimension": {
          "Length Over All (LOA)": "200 M",
          "Breadth (B)": "39.80 M",
          "Draught (T)": "7.70 M",
          "Deadweight (DWT)": "- TON",
        },
        "Cargo Tank": { Capacity: "83,000 m³", Type: "CIRCULAR", Quantity: "4 PCS" },
        "Propulsion Type": "CPP",
      },
      drawings: singleImageSet("General Arrangement — FSRU 83,000 m³", IMG_FSRU_83K),
    },
  },
  TRUCK: {
    "40k": {
      label: "LNG Trucking 40k (39.6 m³)",
      params: {
        "Main Dimension": {
          "Length Over All (LOA)": "12,980 MM",
          "Width": "2,500 MM",
          "Height": "3,880 MM",
          "Deadweight (DWT)": "18,370 KG",
        },
        "Tank": { Capacity: "39.6 m³" },
      },
      drawings: singleImageSet("General Arrangement — LNG Truck 39.6 m³", IMG_TRUCK_39),
    },
    "52k": {
      label: "LNG Trucking 52k (52.5 m³)",
      params: {
        "Main Dimension": {
          "Length Over All (LOA)": "16,500 MM",
          "Width": "2,500 MM",
          "Height": "3,880 MM",
          "Deadweight (DWT)": "21,715 KG",
        },
        "Tank": { Capacity: "52.5 m³" },
      },
      drawings: singleImageSet("General Arrangement — LNG Truck 52.5 m³", IMG_TRUCK_52),
    },
  },
  ORU: {
    c1a6: {
      label: "ORU — Type C1A, 12 m³/HR",
      params: {
        "Storage Capacity": { Each: "500 m³", Total: "2,000 m³" },
        "Send Out System": { Capacity: "12 m³/HR", Pressure: "15.8 BARG" },
        "Engineering Spec": { "Storage Tank Technology": "", "Vaporizer Technology": "" },
      },
      drawings: singleImageSet("ORU Type C1A — typical", IMG_ORU_PFD),
    },
    c1b12: {
      label: "ORU — Type C1B, 12 m³/HR",
      params: {
        "Storage Capacity": { Each: "500 m³", Total: "2,000 m³" },
        "Send Out System": { Capacity: "12 m³/HR", Pressure: "15.8 BARG" },
        "Engineering Spec": { "Storage Tank Technology": "", "Vaporizer Technology": "" },
      },
      drawings: singleImageSet("ORU Type C1B — typical", IMG_ORU_PFD),
    },
  },
  ORF: {
    // CHANGED: label uses 4.893
    v5: {
      label: "ORF — 4.893 m³/HR",
      params: { "Parameter": { Capacity: "4.893 m³/HR", Pressure: "16 BARG" } },
      drawings: singleImageSet("P&ID — ORF 4.893", IMG_ORF_PID_4893),
    },
    // CHANGED: label uses 16.39
    v16: {
      label: "ORF — 16.39 m³/HR",
      params: { "Parameter": { Capacity: "16.39 m³/HR", Pressure: "16 BARG" } },
      drawings: singleImageSet("P&ID — ORF 16.39", IMG_ORF_PID_1639),
    },
  },
  LNG_PLANT: {
    onshore2: {
      label: "Onshore LNG Plant — 2.5 MMSCFD",
      params: {
        "Send Out System": { Capacity: "2.5 MMSCFD", Pressure: "- BARG" },
      },
      drawings: singleImageSet("PFD — Mini LNG Plant 2.5 MMSCFD", IMG_MINI_LNG_PFD),
    },
    mini25: {
      label: "Mini LNG Plant — 2.5 MMSCFD",
      params: {
        "Send Out System": { Capacity: "2.5 MMSCFD", Pressure: "- BARG" },
      },
      drawings: singleImageSet("PFD — Mini LNG Plant 2.5 MMSCFD", IMG_MINI_LNG_PFD),
    },
  },
  JETTY_LNGBV: {
    "2k": {
      label: "Jetty — 2k",
      params: {
        "Jetty": { Type: "CARGO", "Size (LOA)": "83 M", Deadweight: "- TON", Capacity: "2,000 CBM" },
      },
      drawings: singleImageSet("Jetty 2k", IMG_JETTY_LNGBV_2K),
    },
    "3k5": {
      label: "Jetty — 3.5k",
      params: {
        "Jetty": { Type: "CARGO", "Size (LOA)": "83 M", Deadweight: "- TON", Capacity: "2,000 CBM" },
      },
      drawings: singleImageSet("Jetty 3.5k", IMG_JETTY_LNGBV_3K5),
    },
  },
  JETTY_SPB: {
    "15k": {
      label: "Jetty — 15k",
      params: {
        "Jetty": { Type: "CARGO", "Size (LOA)": "83 M", Deadweight: "- TON", Capacity: "2,000 CBM" },
      },
      drawings: singleImageSet("Jetty 15k", IMG_JETTY_SPB_15K),
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
  if (typeof vol === "number") {
    // CHANGED: treat any numeric <= 100 as 'k' (thousands)
    return Number.isFinite(vol) ? (vol <= 100 ? Math.round(vol * 1000) : Math.round(vol)) : NaN;
  }

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

  // ADD: volume parsing (hilang sebelumnya)
  const volRaw = pickProjectVolumeRaw(project);
  const volNum = parseVolumeToNumber(volRaw);
  const volStr = String(volRaw || "").toLowerCase();

  // ADD: helper byVolume (hilang sebelumnya)
  const byVolume = (group, capsMap) => {
    const keys = Object.keys(capsMap);
    const caps = keys.map(k => capsMap[k]);
    const chosen = Number.isFinite(volNum) ? pickNearestCapacity(volNum, caps) : null;
    const matchKey = chosen ? keys.find(k => capsMap[k] === chosen) : keys[0];
    return { group, variant: matchKey };
  };

  // Plant
  if (/plant/.test(infraRaw)) {
    if (/mini/.test(infraRaw)) return { group: "LNG_PLANT", variant: "mini25" };
    if (/onshore/.test(infraRaw)) return { group: "LNG_PLANT", variant: "onshore2" };
    return { group: "LNG_PLANT", variant: "mini25" };
  }

  // ORU
  if (/oru|regasification\s*unit/.test(infraRaw)) {
    if (/c1a/.test(infraRaw)) return { group: "ORU", variant: "c1a6" };
    if (/c1b/.test(infraRaw) || /\b12\b/.test(infraRaw)) return { group: "ORU", variant: "c1b12" };
    return { group: "ORU", variant: "c1a6" };
  }

  // ORF (nearest antara 4.893 & 16.39)
  if (/orf|receiving\s*facility/.test(infraRaw)) {
    const has1639 = /(16[\s.,]?39)\b/.test(infraRaw) || /(16[\s.,]?39)\b/.test(volStr);
    const has4893 = /(4[\s.,]?893)\b/.test(infraRaw) || /(4[\s.,]?893)\b/.test(volStr);
    if (has1639) return { group: "ORF", variant: "v16" };
    if (has4893) return { group: "ORF", variant: "v5" };
    if (Number.isFinite(volNum)) {
      const chosen = pickNearestCapacity(volNum, [4893, 16390]);
      return { group: "ORF", variant: chosen === 16390 ? "v16" : "v5" };
    }
    return { group: "ORF", variant: "v5" };
  }

  // LNGBV
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
  if (/fsru/.test(infraRaw)) return { group: "FSRU", variant: "83k" };
  // Truck
  if (/truck/.test(infraRaw)) {
    return byVolume("TRUCK", { "40k": 39600, "52k": 52500 });
  }

  // Jetty LNGBV
  if (/\bjetty\b.*\blngbv\b|\blngbv\b.*\bjetty\b|\bjetty lngbv infrastructure\b|\bjetty\b.*\binfrastruktur\b.*\blngbv\b|\blngbv\b.*\binfrastruktur\b.*\bjetty\b/i.test(infraRaw)) {
    if (Number.isFinite(volNum)) {
      const chosen = pickNearestCapacity(volNum, [2000, 3500]);
      return { group: "JETTY_LNGBV", variant: chosen === 3500 ? "3k5" : "2k" };
    }
    return { group: "JETTY_LNGBV", variant: "2k" };
  }
  // Jetty SPB
  if (/\bjetty\b.*\bspb\b|\bspb\b.*\bjetty\b|\bjetty spb infrastructure\b|dolphin.*spb|\bjetty\b.*\binfrastruktur\b.*\bspb\b|\bspb\b.*\binfrastruktur\b.*\bjetty\b/i.test(infraRaw)) {
    return { group: "JETTY_SPB", variant: "15k" };
  }

  // Fallback ke LNGBV berdasarkan volume
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
    catalog,
    selectedProjectId: null,
    resolved: { group: null, variant: null },
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
export const selectLibraryState = (s) => s.libraryPreview;
export const selectCatalog = (s) => s.libraryPreview.catalog;
export const selectResolved = (s) => s.libraryPreview.resolved;
export const selectCurrentVariant = (s) => {
  const { resolved, catalog } = s.libraryPreview;
  return resolved.group && resolved.variant ? catalog[resolved.group]?.[resolved.variant] : null;
};
export const selectApprovedLibraryProjects = (s) => s.libraryPreview.approvedProjects;

export default previewSlice.reducer;
