import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  jasa: [
    // PROJECT MANAGEMENT DAN PEKERJAAN PERSIAPAN
    {
      id: 1,
      kategori: "PROJECT MANAGEMENT DAN PEKERJAAN PERSIAPAN",
      nama: "Project Management",
      kelasAACE: "1",
      satuan: "ls",
      harga: 15000000,
    },
    {
      id: 2,
      kategori: "PROJECT MANAGEMENT DAN PEKERJAAN PERSIAPAN",
      nama: "Ijin MIGAS - Certificate of Inspection (COI) PSV",
      kelasAACE: "1",
      satuan: "ls",
      harga: 5000000,
    },
    {
      id: 3,
      kategori: "PROJECT MANAGEMENT DAN PEKERJAAN PERSIAPAN",
      nama: "Ijin Lingkungan",
      kelasAACE: "1",
      satuan: "ls",
      harga: 3000000,
    },
    {
      id: 4,
      kategori: "PROJECT MANAGEMENT DAN PEKERJAAN PERSIAPAN",
      nama: "Penelaahan Desain",
      kelasAACE: "1",
      satuan: "ls",
      harga: 4000000,
    },
    // Supporting Work
    {
      id: 5,
      kategori: "Supporting Work",
      nama: "Pekerjaan Soil Investigation + Laporan + Penentuan Kedalaman Pondasi",
      kelasAACE: "2",
      satuan: "ls",
      harga: 12000000,
    },
    {
      id: 6,
      kategori: "Supporting Work",
      nama: "Pekerjaan Survey Lokasi dan Pembuatan Gambar",
      kelasAACE: "2",
      satuan: "ls",
      harga: 8000000,
    },
    {
      id: 7,
      kategori: "Supporting Work",
      nama: "Pekerjaan pengukuran jalur",
      kelasAACE: "2",
      satuan: "ls",
      harga: 6000000,
    },
    {
      id: 8,
      kategori: "Supporting Work",
      nama: "Pembuatan Papan Nama Proyek",
      kelasAACE: "2",
      satuan: "ls",
      harga: 2000000,
    },
    {
      id: 9,
      kategori: "Supporting Work",
      nama: "Direksi Keet/kantor Lapangan",
      kelasAACE: "2",
      satuan: "ls",
      harga: 7000000,
    },
    {
      id: 10,
      kategori: "Supporting Work",
      nama: "Sewa Direksi Keet Container 40 ft",
      kelasAACE: "2",
      satuan: "ls",
      harga: 3000000,
    },
    {
      id: 11,
      kategori: "Supporting Work",
      nama: "Interior Direksi Keet Container 40 ft",
      kelasAACE: "2",
      satuan: "ls",
      harga: 2500000,
    },
    {
      id: 12,
      kategori: "Supporting Work",
      nama: "Pekerjaan Setting Direksi Keet Container 20 ft / 40 ft",
      kelasAACE: "2",
      satuan: "ls",
      harga: 3500000,
    },
    {
      id: 13,
      kategori: "Supporting Work",
      nama: "Pekerjaan Operational Kantor Proyek (Pipa Dinas/Servis)",
      kelasAACE: "2",
      satuan: "ls",
      harga: 4000000,
    },
    {
      id: 14,
      kategori: "Supporting Work",
      nama: "Pembuatan Dinding Pengaman Banner & Rambu Jalan",
      kelasAACE: "2",
      satuan: "ls",
      harga: 1500000,
    },
    {
      id: 15,
      kategori: "Supporting Work",
      nama: "Pembuatan Tanda Pengaman / Rambu2",
      kelasAACE: "2",
      satuan: "ls",
      harga: 1000000,
    },
    {
      id: 16,
      kategori: "Supporting Work",
      nama: "Mobilisasi - Demobilisasi",
      kelasAACE: "2",
      satuan: "ls",
      harga: 5000000,
    },
    {
      id: 17,
      kategori: "Supporting Work",
      nama: "Mobilisasi dan Demobilisasi; Transportasi Harian",
      kelasAACE: "2",
      satuan: "ls",
      harga: 2000000,
    },
    {
      id: 18,
      kategori: "Supporting Work",
      nama: "Mobilisasi dan Demobilisasi Alat Berat",
      kelasAACE: "2",
      satuan: "ls",
      harga: 3000000,
    },
    {
      id: 19,
      kategori: "Supporting Work",
      nama: "Pekerjaan Pengangkutan",
      kelasAACE: "2",
      satuan: "ls",
      harga: 4000000,
    },
    {
      id: 20,
      kategori: "Supporting Work",
      nama: "Pengangkutan Fitting Lump Sum Dia. sd 16\"",
      kelasAACE: "2",
      satuan: "ls",
      harga: 2500000,
    },
    {
      id: 21,
      kategori: "Supporting Work",
      nama: "Pengangkutan Pipa Baja",
      kelasAACE: "2",
      satuan: "ls",
      harga: 3500000,
    },
    {
      id: 22,
      kategori: "Supporting Work",
      nama: "Pengangkutan Filter",
      kelasAACE: "2",
      satuan: "ls",
      harga: 1500000,
    },
    {
      id: 23,
      kategori: "Supporting Work",
      nama: "Welder Performance Test",
      kelasAACE: "2",
      satuan: "ls",
      harga: 3000000,
    },
    {
      id: 24,
      kategori: "Supporting Work",
      nama: "WPT Dia s.d 10\"",
      kelasAACE: "2",
      satuan: "ls",
      harga: 2000000,
    },
    {
      id: 25,
      kategori: "Supporting Work",
      nama: "WPT Dia 12\" dan 16\"",
      kelasAACE: "2",
      satuan: "ls",
      harga: 2500000,
    },
    {
      id: 26,
      kategori: "Supporting Work",
      nama: "Operator Performance Test",
      kelasAACE: "2",
      satuan: "ls",
      harga: 2000000,
    },
    {
      id: 27,
      kategori: "Supporting Work",
      nama: "Welding Pra Qualification Test (WPQT)",
      kelasAACE: "2",
      satuan: "ls",
      harga: 4000000,
    },
    {
      id: 28,
      kategori: "Supporting Work",
      nama: "WPQT Dia s.d 4\"",
      kelasAACE: "2",
      satuan: "ls",
      harga: 1500000,
    },
    {
      id: 29,
      kategori: "Supporting Work",
      nama: "WPQT Dia 16\"",
      kelasAACE: "2",
      satuan: "ls",
      harga: 2000000,
    },
    {
      id: 30,
      kategori: "Supporting Work",
      nama: "Production Test",
      kelasAACE: "2",
      satuan: "ls",
      harga: 3000000,
    },
    {
      id: 31,
      kategori: "Supporting Work",
      nama: "Production Test Dia s.d 4\"",
      kelasAACE: "2",
      satuan: "ls",
      harga: 2000000,
    },
    {
      id: 32,
      kategori: "Supporting Work",
      nama: "Production Test Dia 16\"",
      kelasAACE: "2",
      satuan: "ls",
      harga: 2500000,
    },
    {
      id: 33,
      kategori: "Supporting Work",
      nama: "Daily Check Up (tenaga hiperkes)",
      kelasAACE: "2",
      satuan: "ls",
      harga: 1000000,
    },
    {
      id: 34,
      kategori: "Supporting Work",
      nama: "Temporary Facility",
      kelasAACE: "2",
      satuan: "ls",
      harga: 3000000,
    },
    {
      id: 35,
      kategori: "Supporting Work",
      nama: "MCU Pekerja & Perlengkapan K3",
      kelasAACE: "2",
      satuan: "ls",
      harga: 2000000,
    },
  ],
  exportData: null, // untuk menyimpan hasil export
  exportType: null, // 'sql' or 'excel'
  sortDirection: "asc",
  sortField: "kelasAACE", // default sort field
  filterJenis: [],
  search: "",
  sortedJasa: [],
  downloadUrl: null, // url blob untuk download
};

function filterAndSortJasa(jasa, direction, filterJenis, search, sortField) {
  let filtered = jasa;
  if (filterJenis && filterJenis.length > 0) {
    filtered = filtered.filter(j => filterJenis.includes(j.kategori));
  }
  if (search && search.trim() !== "") {
    const s = search.toLowerCase();
    filtered = filtered.filter(j =>
      j.nama.toLowerCase().includes(s) ||
      j.kategori.toLowerCase().includes(s)
    );
  }
  return [...filtered].sort((a, b) => {
    let aField = a[sortField];
    let bField = b[sortField];
    if (sortField === "kelasAACE" || sortField === "harga") {
      aField = Number(aField);
      bField = Number(bField);
    }
    if (aField !== bField) {
      return direction === "asc" ? aField - bField : bField - aField;
    }
    // fallback to id
    return direction === "asc" ? a.id - b.id : b.id - a.id;
  });
}

const jasaSlice = createSlice({
  name: 'jasa',
  initialState: {
    ...initialState,
    sortedJasa: filterAndSortJasa(
      initialState.jasa,
      initialState.sortDirection,
      initialState.filterJenis,
      initialState.search,
      initialState.sortField
    ),
  },
  reducers: {
    setSortDirection: (state, action) => {
      state.sortDirection = action.payload;
      state.sortedJasa = filterAndSortJasa(
        state.jasa,
        state.sortDirection,
        state.filterJenis,
        state.search,
        state.sortField
      );
    },
    sortByField: (state, action) => {
      // action.payload: { field }
      if (state.sortField === action.payload) {
        // toggle direction
        state.sortDirection = state.sortDirection === "asc" ? "desc" : "asc";
      } else {
        state.sortField = action.payload;
        state.sortDirection = "asc";
      }
      state.sortedJasa = filterAndSortJasa(
        state.jasa,
        state.sortDirection,
        state.filterJenis,
        state.search,
        state.sortField
      );
    },
    setFilterJenis: (state, action) => {
      state.filterJenis = action.payload;
      state.sortedJasa = filterAndSortJasa(
        state.jasa,
        state.sortDirection,
        state.filterJenis,
        state.search,
        state.sortField
      );
    },
    setSearch: (state, action) => {
      state.search = action.payload;
      state.sortedJasa = filterAndSortJasa(
        state.jasa,
        state.sortDirection,
        state.filterJenis,
        state.search,
        state.sortField
      );
    },
    exportToSQL: (state) => {
      // Export seluruh jasa ke format SQL insert
      const values = state.sortedJasa.map(j =>
        `(${j.id}, '${j.kategori.replace(/'/g, "''")}', '${j.nama.replace(/'/g, "''")}', '${j.kelasAACE}', '${j.satuan}', ${j.harga})`
      ).join(',\n');
      state.exportData = `INSERT INTO jasa (id, kategori, nama, kelasAACE, satuan, harga) VALUES\n${values};`;
      state.exportType = 'sql';
    },
    exportToExcel: (state) => {
      // Export seluruh jasa ke array 2D (header + rows)
      const header = ["id", "kategori", "nama", "kelasAACE", "satuan", "harga"];
      const rows = state.sortedJasa.map(j => [j.id, j.kategori, j.nama, j.kelasAACE, j.satuan, j.harga]);
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
  },
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
} = jasaSlice.actions;
export default jasaSlice.reducer;
