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
      jumlah: 6,
    },
    {
      id: "elbow",
      nama: "Elbow",
      kelompok: "Material Jaringan Pipeline",
      jumlah: 2,
    },
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
