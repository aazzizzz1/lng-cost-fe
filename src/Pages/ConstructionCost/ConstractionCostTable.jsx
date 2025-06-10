import React from 'react'
import { useSelector } from 'react-redux'

const ConstractionCostTable = () => {
  const { costs, filterJenis } = useSelector((state) => state.constractionCost);
  const filteredCosts = filterJenis
    ? costs.filter((item) => item.jenis === filterJenis)
    : costs;

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
          <div className="w-full md:w-1/2">
            <h1 className="text-base dark:text-white">Construction Cost Overview</h1>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th className="px-4 py-3">No</th>
                <th className="px-4 py-3">Nama</th>
                <th className="px-4 py-3">Jenis</th>
                <th className="px-4 py-3">Kategori</th>
                <th className="px-4 py-3">Lokasi</th>
                <th className="px-4 py-3">Tahun</th>
                <th className="px-4 py-3">Level AACE</th>
                <th className="px-4 py-3">Harga</th>
              </tr>
            </thead>
            <tbody>
              {filteredCosts.map((item, idx) => (
                <tr key={item.id} className="border-b dark:border-gray-700">
                  <td className="px-4 py-3">{idx + 1}</td>
                  <td className="px-4 py-3">{item.name}</td>
                  <td className="px-4 py-3">{item.jenis}</td>
                  <td className="px-4 py-3">{item.kategori}</td>
                  <td className="px-4 py-3">{item.lokasi}</td>
                  <td className="px-4 py-3">{item.tahun}</td>
                  <td className="px-4 py-3">{item.levelAACE}</td>
                  <td className="px-4 py-3">
                    Rp<span className="text-green-500 font-semibold">{item.harga.toLocaleString()}</span>
                  </td>
                </tr>
              ))}
              {filteredCosts.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-4 text-gray-400 dark:text-gray-500">
                    Tidak ada data.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

export default ConstractionCostTable