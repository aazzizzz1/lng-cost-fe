import React from 'react'

// Kolom yang ingin ditampilkan
const columns = [
  { key: "uraian", label: "Uraian" },
  { key: "kategori", label: "Kategori" },
  { key: "satuan", label: "Satuan" },
  { key: "qty", label: "Qty" },
  { key: "hargaSatuan", label: "Harga Satuan" },
  { key: "totalHarga", label: "Total Harga" },
  { key: "aaceClass", label: "AACE Class" },
  { key: "tahun", label: "Tahun" },
  { key: "proyek", label: "Proyek" },
  { key: "lokasi", label: "Lokasi" },
  { key: "kelompok", label: "Kelompok" },
  { key: "tipe", label: "Tipe" },
];

const ReceivingTerminalTable = ({ data }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border dark:border-gray-700 bg-white dark:bg-gray-900 rounded">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-800">
            {columns.map(col => (
              <th key={col.key} className="px-2 py-2 border dark:border-gray-700">{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {(!data || data.length === 0) && (
            <tr>
              <td colSpan={columns.length} className="text-center text-gray-400 py-6">Tidak ada data.</td>
            </tr>
          )}
          {data && data.map(row => (
            <tr key={row.id}>
              {columns.map(col => (
                <td key={col.key} className="border dark:border-gray-700 px-2 py-1">
                  {col.key === "hargaSatuan" || col.key === "totalHarga"
                    ? (row[col.key] ? `Rp${Number(row[col.key]).toLocaleString()}` : "")
                    : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReceivingTerminalTable