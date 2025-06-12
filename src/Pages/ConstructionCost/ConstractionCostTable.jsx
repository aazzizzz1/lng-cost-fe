import React from 'react'
import { useSelector } from 'react-redux'

const ConstractionCostTable = () => {
  const { costs, filterJenis } = useSelector((state) => state.constractionCost);
  const filteredCosts = filterJenis
    ? costs.filter((item) => item.tipe === filterJenis)
    : costs;

  // Perhitungan total
  const totalHargaPekerjaan = filteredCosts.reduce((sum, item) => sum + (item.totalHarga || 0), 0);
  const ppn = totalHargaPekerjaan * 0.11;
  const asuransi = totalHargaPekerjaan * 0.0025;
  const totalPerkiraan = totalHargaPekerjaan + ppn + asuransi;

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
                  <th className="px-4 py-3">No</th>
                  <th className="px-4 py-3">Uraian</th>
                  <th className="px-4 py-3">Satuan</th>
                  <th className="px-4 py-3">Qty</th>
                  <th className="px-4 py-3">Harga Satuan</th>
                  <th className="px-4 py-3">Total Harga</th>
                  <th className="px-4 py-3">AACE Class</th>
                  <th className="px-4 py-3">Accuracy %</th>
                  <th className="px-4 py-3">Kelompok</th>
                  <th className="px-4 py-3">Tahun</th>
                  <th className="px-4 py-3">Infrastruktur</th>
                  <th className="px-4 py-3">Volume</th>
                  <th className="px-4 py-3">Satuan Volume</th>
                  <th className="px-4 py-3">Kapasitas Regasifikasi</th>
                  <th className="px-4 py-3">Satuan Kapasitas</th>
                  <th className="px-4 py-3">Proyek</th>
                  <th className="px-4 py-3">Lokasi</th>
                  <th className="px-4 py-3">Tipe</th>
                </tr>
              </thead>
              <tbody>
                {filteredCosts.map((item, idx) => (
                  <tr key={item.id} className="border-b dark:border-gray-700">
                    <td className="px-4 py-3">{idx + 1}</td>
                    <td className="px-4 py-3">{item.uraian}</td>
                    <td className="px-4 py-3">{item.satuan}</td>
                    <td className="px-4 py-3">{item.qty}</td>
                    <td className="px-4 py-3">Rp{item.hargaSatuan?.toLocaleString()}</td>
                    <td className="px-4 py-3">Rp{item.totalHarga?.toLocaleString()}</td>
                    <td className="px-4 py-3">{item.aaceClass}</td>
                    <td className="px-4 py-3">{item.accuracyLow}% ~ {item.accuracyHigh}%</td>
                    <td className="px-4 py-3">{item.kelompok}</td>
                    <td className="px-4 py-3">{item.tahun}</td>
                    <td className="px-4 py-3">{item.infrastruktur}</td>
                    <td className="px-4 py-3">{item.volume}</td>
                    <td className="px-4 py-3">{item.satuanVolume}</td>
                    <td className="px-4 py-3">{item.kapasitasRegasifikasi}</td>
                    <td className="px-4 py-3">{item.satuanKapasitas}</td>
                    <td className="px-4 py-3">{item.proyek}</td>
                    <td className="px-4 py-3">{item.lokasi}</td>
                    <td className="px-4 py-3">{item.tipe}</td>
                  </tr>
                ))}
                {filteredCosts.length === 0 && (
                  <tr>
                    <td colSpan={18} className="text-center py-4 text-gray-400 dark:text-gray-500">
                      Tidak ada data.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="w-full md:w-80 md:min-w-[320px] md:max-w-xs p-4 bg-gray-100 dark:bg-gray-700 mt-2 md:mt-0 md:ml-4 rounded h-fit self-start">
            <div className="flex flex-col gap-1 text-sm dark:text-white">
              <div>
                <span className="font-semibold">Total Harga Pekerjaan (A+B+C+D+E+F): </span>
                Rp{totalHargaPekerjaan.toLocaleString()}
              </div>
              <div>
                <span className="font-semibold">PPN 11% (11% x G): </span>
                Rp{ppn.toLocaleString()}
              </div>
              <div>
                <span className="font-semibold">Asuransi (2,5‰ x G): </span>
                Rp{asuransi.toLocaleString()}
              </div>
              <div>
                <span className="font-semibold">Total Perkiraan Harga Pekerjaan (G+H+I): </span>
                Rp{totalPerkiraan.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ConstractionCostTable