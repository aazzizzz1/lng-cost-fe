import { createSlice } from '@reduxjs/toolkit';

// Data dummy package
const initialPackages = [
  {
    id: 1,
    uraian: "Conversion Kit",
    spesifikasi: "HSK800-0.35D8V: Bi-Fuel kit suitable for engines from 360 to 800 KW with 2 turbo and 8 cylinders",
    satuan: "Pcs",
    qty: 1,
    peoplePerDay: null,
    hargaSatuan: 874403063,
    totalHarga: 874403063,
    aaceClass: 2,
    accuracyLow: -15,
    accuracyHigh: 20,
    kelompok1: "PENYEDIAAN MATERIAL",
    kelompok1_1: "Material Mechanical",
    tahun: 2021,
    infrastruktur: "Installation 1 unit of Dual Fuel Conversion System for Auxiliary Engine in Train P-06704 in the Engine Deutz BF8M 1015 CP (400kW/500kVA, 8 cylinders)",
    volume: 1,
    proyek: "PT. Risco Energy Power Solutions",
    lokasi: "Jakarta",
    tipe: "Quotation",
    jenis: "Package"
  },
  {
    id: 2,
    uraian: "LNG Storage",
    spesifikasi: "LNG storage tank 490L (including the supporting components)",
    satuan: "Pcs",
    qty: 1,
    peoplePerDay: null,
    hargaSatuan: 523600000,
    totalHarga: 523600000,
    aaceClass: 2,
    accuracyLow: -15,
    accuracyHigh: 20,
    kelompok1: "PENYEDIAAN MATERIAL",
    kelompok1_1: "Material Mechanical",
    tahun: 2021,
    infrastruktur: "Installation 1 unit of Dual Fuel Conversion System for Auxiliary Engine in Train P-06704 in the Engine Deutz BF8M 1015 CP (400kW/500kVA, 8 cylinders)",
    volume: 1,
    proyek: "PT. Risco Energy Power Solutions",
    lokasi: "Jakarta",
    tipe: "Quotation",
    jenis: "Package"
  },
  {
    id: 3,
    uraian: "Gas Flow Meter",
    spesifikasi: "Non-custody gas flow meter",
    satuan: "Pcs",
    qty: 1,
    peoplePerDay: null,
    hargaSatuan: 44660000,
    totalHarga: 44660000,
    aaceClass: 2,
    accuracyLow: -15,
    accuracyHigh: 20,
    kelompok1: "PENYEDIAAN MATERIAL",
    kelompok1_1: "Material Mechanical",
    tahun: 2021,
    infrastruktur: "Installation 1 unit of Dual Fuel Conversion System for Auxiliary Engine in Train P-06704 in the Engine Deutz BF8M 1015 CP (400kW/500kVA, 8 cylinders)",
    volume: 1,
    proyek: "PT. Risco Energy Power Solutions",
    lokasi: "Jakarta",
    tipe: "Quotation",
    jenis: "Package"
  },
  {
    id: 4,
    uraian: "Diesel Flow Meter",
    spesifikasi: "Non-custody diesel flow meter",
    satuan: "Pcs",
    qty: 1,
    peoplePerDay: null,
    hargaSatuan: 44375000,
    totalHarga: 44375000,
    aaceClass: 2,
    accuracyLow: -15,
    accuracyHigh: 20,
    kelompok1: "PENYEDIAAN MATERIAL",
    kelompok1_1: "Material Mechanical",
    tahun: 2021,
    infrastruktur: "Installation 1 unit of Dual Fuel Conversion System for Auxiliary Engine in Train P-06704 in the Engine Deutz BF8M 1015 CP (400kW/500kVA, 8 cylinders)",
    volume: 1,
    proyek: "PT. Risco Energy Power Solutions",
    lokasi: "Jakarta",
    tipe: "Quotation",
    jenis: "Package"
  },
  {
    id: 5,
    uraian: "Certification",
    spesifikasi: "COI from inspection agency for pressure vessel, pressure safety valve, and generator",
    satuan: "ls",
    qty: 1,
    peoplePerDay: null,
    hargaSatuan: 85800000,
    totalHarga: 85800000,
    aaceClass: 2,
    accuracyLow: -15,
    accuracyHigh: 20,
    kelompok1: "PENYEDIAAN MATERIAL",
    kelompok1_1: "Material Mechanical",
    tahun: 2021,
    infrastruktur: "Installation 1 unit of Dual Fuel Conversion System for Auxiliary Engine in Train P-06704 in the Engine Deutz BF8M 1015 CP (400kW/500kVA, 8 cylinders)",
    volume: 1,
    proyek: "PT. Risco Energy Power Solutions",
    lokasi: "Jakarta",
    tipe: "Quotation",
    jenis: "Package"
  },
  {
    id: 6,
    uraian: "Delivery Cost",
    spesifikasi: "Jakarta to Manggarai Station",
    satuan: "ls",
    qty: 1,
    peoplePerDay: null,
    hargaSatuan: 5600000,
    totalHarga: 5600000,
    aaceClass: 2,
    accuracyLow: -15,
    accuracyHigh: 20,
    kelompok1: "PENYEDIAAN MATERIAL",
    kelompok1_1: "Material Mechanical",
    tahun: 2021,
    infrastruktur: "Installation 1 unit of Dual Fuel Conversion System for Auxiliary Engine in Train P-06704 in the Engine Deutz BF8M 1015 CP (400kW/500kVA, 8 cylinders)",
    volume: 1,
    proyek: "PT. Risco Energy Power Solutions",
    lokasi: "Jakarta",
    tipe: "Quotation",
    jenis: "Package"
  },
  {
    id: 7,
    uraian: "Others",
    spesifikasi: "PGN LNG visitation assistance",
    satuan: "ls",
    qty: 1,
    peoplePerDay: null,
    hargaSatuan: 43500000,
    totalHarga: 43500000,
    aaceClass: 2,
    accuracyLow: -15,
    accuracyHigh: 20,
    kelompok1: "PENYEDIAAN MATERIAL",
    kelompok1_1: "Material Mechanical",
    tahun: 2021,
    infrastruktur: "Installation 1 unit of Dual Fuel Conversion System for Auxiliary Engine in Train P-06704 in the Engine Deutz BF8M 1015 CP (400kW/500kVA, 8 cylinders)",
    volume: 1,
    proyek: "PT. Risco Energy Power Solutions",
    lokasi: "Jakarta",
    tipe: "Quotation",
    jenis: "Package"
  },
  {
    id: 8,
    uraian: "Installation",
    spesifikasi: "Risco' engineers responsible for the carrying out of the mechanical installation",
    satuan: "Days",
    qty: 7,
    peoplePerDay: 2,
    hargaSatuan: 4500000,
    totalHarga: 31500000,
    aaceClass: 2,
    accuracyLow: -15,
    accuracyHigh: 20,
    kelompok1: "PENYEDIAAN MATERIAL",
    kelompok1_1: "Material Mechanical",
    tahun: 2021,
    infrastruktur: "Installation 1 unit of Dual Fuel Conversion System for Auxiliary Engine in Train P-06704 in the Engine Deutz BF8M 1015 CP (400kW/500kVA, 8 cylinders)",
    volume: 1,
    proyek: "PT. Risco Energy Power Solutions",
    lokasi: "Jakarta",
    tipe: "Quotation",
    jenis: "Package"
  },
  {
    id: 9,
    uraian: "Commissioning (Risco)",
    spesifikasi: "Risco' engineers responsible for the carrying out of commissioning (off-board and on-board)",
    satuan: "Days",
    qty: 13,
    peoplePerDay: 2,
    hargaSatuan: 4500000,
    totalHarga: 58500000,
    aaceClass: 2,
    accuracyLow: -15,
    accuracyHigh: 20,
    kelompok1: "PENYEDIAAN MATERIAL",
    kelompok1_1: "Material Mechanical",
    tahun: 2021,
    infrastruktur: "Installation 1 unit of Dual Fuel Conversion System for Auxiliary Engine in Train P-06704 in the Engine Deutz BF8M 1015 CP (400kW/500kVA, 8 cylinders)",
    volume: 1,
    proyek: "PT. Risco Energy Power Solutions",
    lokasi: "Jakarta",
    tipe: "Quotation",
    jenis: "Package"
  },
  {
    id: 10,
    uraian: "Commissioning (ComAp)",
    spesifikasi: "One ComAp specialist conducts on-line supervising engineer for supervision of Risco's engineers for Commissioning, providing training, guidance and supervision Services.",
    satuan: "Days",
    qty: 5,
    peoplePerDay: 1,
    hargaSatuan: 7000000,
    totalHarga: 35000000,
    aaceClass: 2,
    accuracyLow: -15,
    accuracyHigh: 20,
    kelompok1: "PENYEDIAAN MATERIAL",
    kelompok1_1: "Material Mechanical",
    tahun: 2021,
    infrastruktur: "Installation 1 unit of Dual Fuel Conversion System for Auxiliary Engine in Train P-06704 in the Engine Deutz BF8M 1015 CP (400kW/500kVA, 8 cylinders)",
    volume: 1,
    proyek: "PT. Risco Energy Power Solutions",
    lokasi: "Jakarta",
    tipe: "Quotation",
    jenis: "Package"
  },
  {
    id: 11,
    uraian: "Accomodation",
    spesifikasi: "Hotels for Risco's engineers during on-board commissioning",
    satuan: "Days",
    qty: 10,
    peoplePerDay: 2,
    hargaSatuan: 2000000,
    totalHarga: 20000000,
    aaceClass: 2,
    accuracyLow: -15,
    accuracyHigh: 20,
    kelompok1: "PENYEDIAAN MATERIAL",
    kelompok1_1: "Material Mechanical",
    tahun: 2021,
    infrastruktur: "Installation 1 unit of Dual Fuel Conversion System for Auxiliary Engine in Train P-06704 in the Engine Deutz BF8M 1015 CP (400kW/500kVA, 8 cylinders)",
    volume: 1,
    proyek: "PT. Risco Energy Power Solutions",
    lokasi: "Jakarta",
    tipe: "Quotation",
    jenis: "Package"
  }
];

function filterAndSortPackages(packages, direction, filterJenis, search, sortField) {
  let filtered = packages;
  if (filterJenis && filterJenis.length > 0) {
    filtered = filtered.filter(j => filterJenis.includes(j.kelompok1));
  }
  if (search && search.trim() !== "") {
    const s = search.toLowerCase();
    filtered = filtered.filter(j =>
      (j.uraian?.toLowerCase().includes(s) || "") ||
      (j.spesifikasi?.toLowerCase().includes(s) || "") ||
      (j.kelompok1?.toLowerCase().includes(s) || "") ||
      (j.kelompok1_1?.toLowerCase().includes(s) || "")
    );
  }
  return [...filtered].sort((a, b) => {
    let aField = a[sortField];
    let bField = b[sortField];
    if (sortField === "aaceClass" || sortField === "hargaSatuan" || sortField === "totalHarga" || sortField === "qty") {
      aField = Number(aField);
      bField = Number(bField);
    }
    if (aField !== bField) {
      return direction === "asc" ? aField - bField : bField - aField;
    }
    return direction === "asc" ? a.id - b.id : b.id - a.id;
  });
}

const initialState = {
  packages: initialPackages,
  exportData: null,
  exportType: null,
  sortDirection: "asc",
  sortField: "aaceClass",
  filterJenis: [],
  search: "",
  sortedPackages: [],
  downloadUrl: null,
};

const materialAndPackageSlice = createSlice({
  name: 'materialAndPackage',
  initialState: {
    ...initialState,
    sortedPackages: filterAndSortPackages(
      initialState.packages,
      initialState.sortDirection,
      initialState.filterJenis,
      initialState.search,
      initialState.sortField
    ),
  },
  reducers: {
    setSortDirection: (state, action) => {
      state.sortDirection = action.payload;
      state.sortedPackages = filterAndSortPackages(
        state.packages,
        state.sortDirection,
        state.filterJenis,
        state.search,
        state.sortField
      );
    },
    sortByField: (state, action) => {
      if (state.sortField === action.payload) {
        state.sortDirection = state.sortDirection === "asc" ? "desc" : "asc";
      } else {
        state.sortField = action.payload;
        state.sortDirection = "asc";
      }
      state.sortedPackages = filterAndSortPackages(
        state.packages,
        state.sortDirection,
        state.filterJenis,
        state.search,
        state.sortField
      );
    },
    setFilterJenis: (state, action) => {
      state.filterJenis = action.payload;
      state.sortedPackages = filterAndSortPackages(
        state.packages,
        state.sortDirection,
        state.filterJenis,
        state.search,
        state.sortField
      );
    },
    setSearch: (state, action) => {
      state.search = action.payload;
      state.sortedPackages = filterAndSortPackages(
        state.packages,
        state.sortDirection,
        state.filterJenis,
        state.search,
        state.sortField
      );
    },
    exportToSQL: (state) => {
      const values = state.sortedPackages.map(j =>
        `(${j.id}, '${(j.uraian || '').replace(/'/g, "''")}', '${(j.spesifikasi || '').replace(/'/g, "''")}', '${j.satuan}', ${j.qty}, ${j.peoplePerDay ?? 'NULL'}, ${j.hargaSatuan}, ${j.totalHarga}, ${j.aaceClass}, ${j.accuracyLow}, ${j.accuracyHigh}, '${(j.kelompok1 || '').replace(/'/g, "''")}', '${(j.kelompok1_1 || '').replace(/'/g, "''")}', ${j.tahun}, '${(j.infrastruktur || '').replace(/'/g, "''")}', ${j.volume}, '${(j.proyek || '').replace(/'/g, "''")}', '${(j.lokasi || '').replace(/'/g, "''")}', '${(j.tipe || '').replace(/'/g, "''")}', '${(j.jenis || '').replace(/'/g, "''")}')`
      ).join(',\n');
      state.exportData = `INSERT INTO packages (id, uraian, spesifikasi, satuan, qty, peoplePerDay, hargaSatuan, totalHarga, aaceClass, accuracyLow, accuracyHigh, kelompok1, kelompok1_1, tahun, infrastruktur, volume, proyek, lokasi, tipe, jenis) VALUES\n${values};`;
      state.exportType = 'sql';
    },
    exportToExcel: (state) => {
      const header = [
        "id", "uraian", "spesifikasi", "satuan", "qty", "peoplePerDay", "hargaSatuan", "totalHarga", "aaceClass", "accuracyLow", "accuracyHigh", "kelompok1", "kelompok1_1", "tahun", "infrastruktur", "volume", "proyek", "lokasi", "tipe", "jenis"
      ];
      const rows = state.sortedPackages.map(j => [
        j.id, j.uraian, j.spesifikasi, j.satuan, j.qty, j.peoplePerDay, j.hargaSatuan, j.totalHarga, j.aaceClass, j.accuracyLow, j.accuracyHigh, j.kelompok1, j.kelompok1_1, j.tahun, j.infrastruktur, j.volume, j.proyek, j.lokasi, j.tipe, j.jenis
      ]);
      state.exportData = [header, ...rows];
      state.exportType = 'excel';
    },
    clearExportData: (state) => {
      state.exportData = null;
      state.exportType = null;
      if (state.downloadUrl) {
        URL.revokeObjectURL(state.downloadUrl);
        state.downloadUrl = null;
      }
    },
    downloadExportData: (state) => {
      if (!state.exportData) return;
      if (state.downloadUrl) {
        URL.revokeObjectURL(state.downloadUrl);
        state.downloadUrl = null;
      }
      let blob, url;
      if (state.exportType === 'sql') {
        blob = new Blob([state.exportData], { type: 'text/sql' });
        url = URL.createObjectURL(blob);
        state.downloadUrl = url;
      } else if (state.exportType === 'excel') {
        const tsv = state.exportData.map(row => row.join("\t")).join("\n");
        blob = new Blob([tsv], { type: 'text/tab-separated-values' });
        url = URL.createObjectURL(blob);
        state.downloadUrl = url;
      }
    },
    clearDownloadUrl: (state) => {
      if (state.downloadUrl) {
        URL.revokeObjectURL(state.downloadUrl);
        state.downloadUrl = null;
      }
    }
  }
});

export const {
  setSortDirection,
  sortByField,
  setFilterJenis,
  setSearch,
  exportToSQL,
  exportToExcel,
  clearExportData,
  downloadExportData,
  clearDownloadUrl
} = materialAndPackageSlice.actions;
export default materialAndPackageSlice.reducer;
