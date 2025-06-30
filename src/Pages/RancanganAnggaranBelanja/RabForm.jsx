import React, { useState } from 'react'
// import ModalUnitPriceRab from './ModalUnitPriceRab'
import ModalSelectUnitPriceRab from './ModalSelectUnitPriceRab'
import CreateRabModal from './CreateRabModal'

const RabForm = () => {
  const [items, setItems] = useState([]);
  const [modalSelectOpen, setModalSelectOpen] = useState(false);
  const [rabData, setRabData] = useState(null);
  const [rabModalOpen, setRabModalOpen] = useState(true);

  // Handler tambah item dari harga satuan
  const handleAddFromUnitPrice = (item) => {
    setItems([...items, item]);
    setModalSelectOpen(false);
  };

  // Handler simpan data RAB
  const handleSaveRabData = (data) => {
    setRabData(data);
    setRabModalOpen(false);
  };

  return (
    <div>
      {/* Modal input data RAB */}
      <CreateRabModal
        isOpen={rabModalOpen}
        onClose={() => setRabModalOpen(false)}
        onSubmit={handleSaveRabData}
        initialData={rabData}
      />
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Daftar RAB</h2>
        <div className="flex gap-2">
          <button
            className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded disabled:opacity-50"
            onClick={() => setModalSelectOpen(true)}
            disabled={!rabData}
          >
            Tambah Item dari Harga Satuan
          </button>
          <button
            className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
            onClick={() => setRabModalOpen(true)}
          >
            Edit Data RAB
          </button>
        </div>
      </div>
      {/* Tampilkan data RAB jika sudah diisi */}
      {rabData && (
        <div className="mb-4 bg-gray-50 dark:bg-gray-800 rounded p-3 border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Nama RAB</div>
              <div className="font-semibold text-gray-900 dark:text-white">{rabData.namaRab}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Tahun</div>
              <div className="font-semibold text-gray-900 dark:text-white">{rabData.tahun}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Asumsi Inflasi (%)</div>
              <div className="font-semibold text-gray-900 dark:text-white">{rabData.inflasi}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Lokasi</div>
              <div className="font-semibold text-gray-900 dark:text-white">{rabData.lokasi}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Jenis</div>
              <div className="font-semibold text-gray-900 dark:text-white">{rabData.jenis}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Volume</div>
              <div className="font-semibold text-gray-900 dark:text-white">{rabData.volume}</div>
            </div>
          </div>
        </div>
      )}
      <table className="w-full border dark:border-gray-700 mb-4">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-800">
            <th className="px-2 py-2 border dark:border-gray-700">Uraian</th>
            <th className="px-2 py-2 border dark:border-gray-700">Satuan</th>
            <th className="px-2 py-2 border dark:border-gray-700">Qty</th>
            <th className="px-2 py-2 border dark:border-gray-700">Harga Satuan</th>
            <th className="px-2 py-2 border dark:border-gray-700">Total Harga</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center text-gray-400 py-4">Belum ada item.</td>
            </tr>
          )}
          {items.map((item, idx) => (
            <tr key={idx}>
              <td className="border px-2 py-1">{item.uraian}</td>
              <td className="border px-2 py-1">{item.satuan}</td>
              <td className="border px-2 py-1">{item.qty}</td>
              <td className="border px-2 py-1">{item.hargaSatuan}</td>
              <td className="border px-2 py-1">{item.qty * item.hargaSatuan}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Modal pilih dari harga satuan */}
      {modalSelectOpen && rabData && (
        <ModalSelectUnitPriceRab
          onClose={() => setModalSelectOpen(false)}
          onSubmit={handleAddFromUnitPrice}
          rabData={rabData}
        />
      )}
    </div>
  )
}

export default RabForm