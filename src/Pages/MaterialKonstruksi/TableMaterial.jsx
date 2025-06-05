import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { filterByKelompok, clearFilter } from "../../Provider/materialSlice";

const TableMaterial = () => {
  const dispatch = useDispatch();
  const jenisMaterial = useSelector((state) => state.material.jenisMaterial);
  const filteredMaterial = useSelector(
    (state) => state.material.filteredMaterial
  );

  // Dapatkan kelompok unik untuk filter kelompok
  const kelompokList = [...new Set(jenisMaterial.map((j) => j.kelompok))];

  const handleKelompokClick = (kelompok) => {
    dispatch(filterByKelompok(kelompok));
  };

  const handleClear = () => {
    dispatch(clearFilter());
  };

  if (!filteredMaterial.length) return null;

  return (
    <div>
      <div className="flex gap-2 mb-4">
        {kelompokList.map((kelompok) => (
          <button
            key={kelompok}
            onClick={() => handleKelompokClick(kelompok)}
            className="px-4 py-2 bg-blue-200 rounded"
          >
            {kelompok}
          </button>
        ))}
        <button
          onClick={handleClear}
          className="px-4 py-2 bg-gray-300 rounded"
        >
          Clear Filter
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="border px-2 py-1">Uraian</th>
              <th className="border px-2 py-1">Satuan</th>
              <th className="border px-2 py-1">Harga Satuan</th>
              <th className="border px-2 py-1">Kelompok</th>
              <th className="border px-2 py-1">Tahun</th>
              <th className="border px-2 py-1">Proyek</th>
              <th className="border px-2 py-1">Lokasi</th>
              <th className="border px-2 py-1">Tipe</th>
            </tr>
          </thead>
          <tbody>
            {filteredMaterial.map((item) => (
              <tr key={item.id}>
                <td className="border px-2 py-1">{item.uraian}</td>
                <td className="border px-2 py-1">{item.satuan}</td>
                <td className="border px-2 py-1">
                  {item.hargaSatuan.toLocaleString()}
                </td>
                <td className="border px-2 py-1">{item.kelompok}</td>
                <td className="border px-2 py-1">{item.tahun}</td>
                <td className="border px-2 py-1">{item.proyek}</td>
                <td className="border px-2 py-1">{item.lokasi}</td>
                <td className="border px-2 py-1">{item.tipe}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableMaterial;