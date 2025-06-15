import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'

// Helper for currency formatting
const formatCurrency = (value) =>
  value ? `Rp${Number(value).toLocaleString()}` : '';

const columns = [
  { key: 'no', label: 'No', className: 'text-center', width: 50 },
  { key: 'uraian', label: 'Uraian', width: 200 },
  { key: 'satuan', label: 'Satuan', width: 70 },
  { key: 'qty', label: 'Qty', className: 'text-right', width: 60 },
  { key: 'hargaSatuan', label: 'Harga Satuan', className: 'text-right', width: 120, isCurrency: true },
  { key: 'totalHarga', label: 'Total Harga', className: 'text-right', width: 120, isCurrency: true },
  { key: 'aaceClass', label: 'AACE Class', width: 80 },
  { key: 'accuracy', label: 'Accuracy %', width: 90 },
  { key: 'kelompok', label: 'Kelompok', width: 120 },
  { key: 'tahun', label: 'Tahun', width: 70 },
  { key: 'infrastruktur', label: 'Infrastruktur', width: 120 },
  { key: 'volume', label: 'Volume', className: 'text-right', width: 80 },
  { key: 'satuanVolume', label: 'Satuan Volume', width: 100 },
  { key: 'kapasitasRegasifikasi', label: 'Kapasitas Regasifikasi', className: 'text-right', width: 120 },
  { key: 'satuanKapasitas', label: 'Satuan Kapasitas', width: 110 },
  { key: 'proyek', label: 'Proyek', width: 120 },
  { key: 'lokasi', label: 'Lokasi', width: 100 },
  { key: 'tipe', label: 'Tipe', width: 80 },
];

const ConstractionCostTable = () => {
  const { costs, filterJenis } = useSelector((state) => state.constractionCost);

  // Filter data sesuai jenis project
  const filteredCosts = useMemo(() => (
    filterJenis ? costs.filter((item) => item.tipe === filterJenis) : costs
  ), [costs, filterJenis]);

  // Kelompokkan data berdasarkan 'kelompok'
  const grouped = useMemo(() => {
    return filteredCosts.reduce((acc, item) => {
      if (!acc[item.kelompok]) acc[item.kelompok] = [];
      acc[item.kelompok].push(item);
      return acc;
    }, {});
  }, [filteredCosts]);

  // Prepare data untuk table (flat, tapi dengan baris judul kelompok)
  let tableRows = [];
  let rowNo = 1;
  Object.entries(grouped).forEach(([kelompok, items]) => {
    tableRows.push({ isGroupHeader: true, kelompok });
    items.forEach((item) => {
      tableRows.push({
        ...item,
        no: rowNo++,
        accuracy: `${item.accuracyLow}% ~ ${item.accuracyHigh}%`,
        isGroupHeader: false,
      });
    });
  });

  // Summary
  const summary = useMemo(() => {
    const totalHargaPekerjaan = filteredCosts.reduce((sum, item) => sum + (Number(item.totalHarga) || 0), 0);
    const ppn = totalHargaPekerjaan * 0.11;
    const asuransi = totalHargaPekerjaan * 0.0025;
    const totalPerkiraan = totalHargaPekerjaan + ppn + asuransi;
    return { totalHargaPekerjaan, ppn, asuransi, totalPerkiraan };
  }, [filteredCosts]);

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
          <div className="w-full md:w-1/2">
            <h1 className="text-base dark:text-white">Construction Cost Overview</h1>
          </div>
        </div>
        <div className="flex flex-col md:flex-row">
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className={`px-4 py-3 font-semibold border-b border-gray-200 dark:border-gray-700 ${col.className || ''}`}
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableRows.length === 0 && (
                  <tr>
                    <td colSpan={columns.length} className="text-center py-4 text-gray-400 dark:text-gray-500">
                      Tidak ada data.
                    </td>
                  </tr>
                )}
                {tableRows.map((row, idx) =>
                  row.isGroupHeader ? (
                    <tr key={`group-${row.kelompok}-${idx}`}>
                      <td colSpan={columns.length} className="bg-gray-100 dark:bg-gray-800 font-bold text-left text-base border-b border-gray-200 dark:border-gray-700 py-2 pl-2">
                        {row.kelompok}
                      </td>
                    </tr>
                  ) : (
                    <tr key={row.id || idx} className="border-b dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-700">
                      {columns.map((col) => (
                        <td
                          key={col.key}
                          className={`px-4 py-3 ${col.className || ''}`}
                        >
                          {col.isCurrency
                            ? formatCurrency(row[col.key])
                            : row[col.key] ?? ''}
                        </td>
                      ))}
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
          <div className="w-full md:w-96 md:min-w-[320px] md:max-w-md p-4 bg-gray-100 dark:bg-gray-700 mt-2 md:mt-0 md:ml-4 rounded h-fit self-start">
            <div className="flex flex-col gap-2 text-sm text-gray-900 dark:text-white">
              <div>
                <span className="font-semibold">Total Harga Pekerjaan (A+B+C+D+E+F): </span>
                {formatCurrency(summary.totalHargaPekerjaan)}
              </div>
              <div>
                <span className="font-semibold">PPN 11% (11% x G): </span>
                {formatCurrency(summary.ppn)}
              </div>
              <div>
                <span className="font-semibold">Asuransi (2,5‰ x G): </span>
                {formatCurrency(summary.asuransi)}
              </div>
              <div>
                <span className="font-semibold">Total Perkiraan Harga Pekerjaan (G+H+I): </span>
                {formatCurrency(summary.totalPerkiraan)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ConstractionCostTable