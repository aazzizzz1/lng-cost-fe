import { createSlice } from "@reduxjs/toolkit";

// Data contoh, mapping jenis material dan detailnya
const initialState = {
  jenisMaterial: [
    {
      id: "pipa_baja",
      nama: "Pipa Baja",
      kelompok: "Material Jaringan Pipeline",
      jumlah: 4,
    },
    {
      id: "valve_baja",
      nama: "Valve Baja",
      kelompok: "Material Jaringan Cryo",
      jumlah: 3,
    },
    {
      id: "elbow",
      nama: "Elbow",
      kelompok: "Material Jaringan Pipeline",
      jumlah: 3,
    },
    {
      id: "flange",
      nama: "Flange",
      kelompok: "Material Jaringan Pipeline",
      jumlah: 2,
    },
    {
      id: "fitting",
      nama: "Fitting",
      kelompok: "Material Jaringan Pipeline",
      jumlah: 2,
    },
    {
      id: "insulation",
      nama: "Insulation",
      kelompok: "Material Jaringan Cryo",
      jumlah: 1,
    },
    {
      id: "support",
      nama: "Support",
      kelompok: "Material Jaringan Pipeline",
      jumlah: 2,
    }
    // ...tambahkan jenis lain sesuai kebutuhan
  ],
  dataMaterial: [
    {
      id: 1,
      jenis: "pipa_baja",
      kelompok: "Material Jaringan Pipeline",
      uraian: 'Line Pipe, CS, ASME B36.10, ASTM A106, Sch 80, Gr.B, Bare Pipe, PE, Seamless, DRL, Dia. 1/2"',
      satuan: "M'",
      qty: 12,
      hargaSatuan: 118797.35,
      totalHarga: 1425568.15,
      tahun: 2019,
      proyek: "Mini LNG Plant Melak",
      lokasi: "Kalimantan",
      tipe: "LNG Plant"
    },
    {
      id: 2,
      jenis: "pipa_baja",
      kelompok: "Material Jaringan Pipeline",
      uraian: 'Line Pipe, CS, ASME B36.10, ASTM A106, Sch 80, Gr.B, Bare Pipe, PE, Seamless, DRL, Dia. 2"',
      satuan: "M'",
      qty: 24,
      hargaSatuan: 241384.71,
      totalHarga: 5793232.93,
      tahun: 2019,
      proyek: "Mini LNG Plant Melak",
      lokasi: "Kalimantan",
      tipe: "LNG Plant"
    },
    {
      id: 3,
      jenis: "valve_baja",
      kelompok: "Material Jaringan Cryo",
      uraian: 'Cryogenic Ball Valve, SS316L, CS+ENP Trim, API 6D, RF, Trunnion Mounted, Full Bore, Dia. 2"',
      satuan: "Pcs",
      qty: 4,
      hargaSatuan: 15341887.08,
      totalHarga: 61367548.32,
      tahun: 2019,
      proyek: "Mini LNG Plant Melak",
      lokasi: "Kalimantan",
      tipe: "LNG Plant"
    },
    {
      id: 4,
      jenis: "elbow",
      kelompok: "Material Jaringan Pipeline",
      uraian: 'ELBOW, 90 DEG, Sch 80, BW, BE, ASME B 16.9, ASTM A 234 WPB, Dia. 3"',
      satuan: "Pcs",
      qty: 3,
      hargaSatuan: 257088.00,
      totalHarga: 771264.00,
      tahun: 2019,
      proyek: "Mini LNG Plant Melak",
      lokasi: "Kalimantan",
      tipe: "LNG Plant"
    },
    // --- Data tambahan PGN LNG Material Konstruksi ---
    {
      id: 5,
      jenis: "pipa_baja",
      kelompok: "Material Jaringan Pipeline",
      uraian: 'Line Pipe, CS, API 5L Gr.B, Sch 40, Seamless, Dia. 4"',
      satuan: "M'",
      qty: 50,
      hargaSatuan: 350000,
      totalHarga: 17500000,
      tahun: 2020,
      proyek: "PGN LNG Lampung",
      lokasi: "Lampung",
      tipe: "LNG Plant"
    },
    {
      id: 6,
      jenis: "pipa_baja",
      kelompok: "Material Jaringan Pipeline",
      uraian: 'Line Pipe, CS, API 5L Gr.B, Sch 40, Seamless, Dia. 6"',
      satuan: "M'",
      qty: 40,
      hargaSatuan: 520000,
      totalHarga: 20800000,
      tahun: 2020,
      proyek: "PGN LNG Lampung",
      lokasi: "Lampung",
      tipe: "LNG Plant"
    },
    {
      id: 7,
      jenis: "valve_baja",
      kelompok: "Material Jaringan Cryo",
      uraian: 'Cryogenic Gate Valve, SS316, API 600, RF, Dia. 4"',
      satuan: "Pcs",
      qty: 2,
      hargaSatuan: 18500000,
      totalHarga: 37000000,
      tahun: 2020,
      proyek: "PGN LNG Lampung",
      lokasi: "Lampung",
      tipe: "LNG Plant"
    },
    {
      id: 8,
      jenis: "elbow",
      kelompok: "Material Jaringan Pipeline",
      uraian: 'ELBOW, 90 DEG, Sch 40, BW, BE, ASME B 16.9, ASTM A 234 WPB, Dia. 4"',
      satuan: "Pcs",
      qty: 10,
      hargaSatuan: 410000,
      totalHarga: 4100000,
      tahun: 2020,
      proyek: "PGN LNG Lampung",
      lokasi: "Lampung",
      tipe: "LNG Plant"
    },
    {
      id: 9,
      jenis: "elbow",
      kelompok: "Material Jaringan Pipeline",
      uraian: 'ELBOW, 45 DEG, Sch 40, BW, BE, ASME B 16.9, ASTM A 234 WPB, Dia. 6"',
      satuan: "Pcs",
      qty: 8,
      hargaSatuan: 520000,
      totalHarga: 4160000,
      tahun: 2020,
      proyek: "PGN LNG Lampung",
      lokasi: "Lampung",
      tipe: "LNG Plant"
    },
    {
      id: 10,
      jenis: "valve_baja",
      kelompok: "Material Jaringan Cryo",
      uraian: 'Cryogenic Ball Valve, SS316L, API 6D, RF, Dia. 6"',
      satuan: "Pcs",
      qty: 2,
      hargaSatuan: 23500000,
      totalHarga: 47000000,
      tahun: 2020,
      proyek: "PGN LNG Lampung",
      lokasi: "Lampung",
      tipe: "LNG Plant"
    },
    // --- End Data tambahan ---
    // --- Data tambahan untuk jenis flange ---
    {
      id: 11,
      jenis: "flange",
      kelompok: "Material Jaringan Pipeline",
      uraian: 'Flange, Weld Neck, CS, ASME B16.5, ASTM A105, Sch 40, RF, 4"',
      satuan: "Pcs",
      qty: 6,
      hargaSatuan: 950000,
      totalHarga: 5700000,
      tahun: 2020,
      proyek: "PGN LNG Lampung",
      lokasi: "Lampung",
      tipe: "LNG Plant"
    },
    {
      id: 12,
      jenis: "flange",
      kelompok: "Material Jaringan Pipeline",
      uraian: 'Flange, Blind, CS, ASME B16.5, ASTM A105, Sch 40, RF, 6"',
      satuan: "Pcs",
      qty: 4,
      hargaSatuan: 1200000,
      totalHarga: 4800000,
      tahun: 2020,
      proyek: "PGN LNG Lampung",
      lokasi: "Lampung",
      tipe: "LNG Plant"
    },
    // --- Data tambahan untuk jenis fitting ---
    {
      id: 13,
      jenis: "fitting",
      kelompok: "Material Jaringan Pipeline",
      uraian: 'Tee, Equal, CS, ASME B16.9, ASTM A234 WPB, Sch 40, 4"',
      satuan: "Pcs",
      qty: 5,
      hargaSatuan: 650000,
      totalHarga: 3250000,
      tahun: 2020,
      proyek: "PGN LNG Lampung",
      lokasi: "Lampung",
      tipe: "LNG Plant"
    },
    {
      id: 14,
      jenis: "fitting",
      kelompok: "Material Jaringan Pipeline",
      uraian: 'Reducer, Concentric, CS, ASME B16.9, ASTM A234 WPB, Sch 40, 6"x4"',
      satuan: "Pcs",
      qty: 3,
      hargaSatuan: 720000,
      totalHarga: 2160000,
      tahun: 2020,
      proyek: "PGN LNG Lampung",
      lokasi: "Lampung",
      tipe: "LNG Plant"
    },
    // --- Data tambahan untuk jenis insulation ---
    {
      id: 15,
      jenis: "insulation",
      kelompok: "Material Jaringan Cryo",
      uraian: 'Insulation, Polyurethane Foam, 2" thickness, for Pipe 4"',
      satuan: "M'",
      qty: 30,
      hargaSatuan: 180000,
      totalHarga: 5400000,
      tahun: 2020,
      proyek: "PGN LNG Lampung",
      lokasi: "Lampung",
      tipe: "LNG Plant"
    },
    // --- Data tambahan untuk jenis support ---
    {
      id: 16,
      jenis: "support",
      kelompok: "Material Jaringan Pipeline",
      uraian: 'Pipe Support, Adjustable, Carbon Steel, for Pipe 4"',
      satuan: "Set",
      qty: 8,
      hargaSatuan: 350000,
      totalHarga: 2800000,
      tahun: 2020,
      proyek: "PGN LNG Lampung",
      lokasi: "Lampung",
      tipe: "LNG Plant"
    },
    {
      id: 17,
      jenis: "support",
      kelompok: "Material Jaringan Pipeline",
      uraian: 'Pipe Shoe, Carbon Steel, for Pipe 6"',
      satuan: "Pcs",
      qty: 6,
      hargaSatuan: 420000,
      totalHarga: 2520000,
      tahun: 2020,
      proyek: "PGN LNG Lampung",
      lokasi: "Lampung",
      tipe: "LNG Plant"
    },
    // ...tambahkan data lain sesuai kebutuhan
  ],
};

const materialSlice = createSlice({
  name: "material",
  initialState,
  reducers: {
    filterByJenis: (state, action) => {
      const jenis = action.payload;
      state.filteredMaterial = state.dataMaterial.filter(
        (item) => item.jenis === jenis
      );
    },
  },
});

export const { filterByJenis } = materialSlice.actions;
export default materialSlice.reducer;
