import React, { useState } from 'react'

const ModalUnitPriceRab = ({ onClose, onSubmit }) => {
  const [uraian, setUraian] = useState('');
  const [satuan, setSatuan] = useState('');
  const [qty, setQty] = useState(1);
  const [hargaSatuan, setHargaSatuan] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      uraian,
      satuan,
      qty: Number(qty),
      hargaSatuan: Number(hargaSatuan),
    });
    // reset form
    setUraian('');
    setSatuan('');
    setQty(1);
    setHargaSatuan(0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 min-w-[320px]">
        <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Tambah Item Harga Satuan</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">Uraian</label>
            <input
              type="text"
              value={uraian}
              onChange={e => setUraian(e.target.value)}
              className="w-full border rounded px-2 py-1"
              required
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">Satuan</label>
            <input
              type="text"
              value={satuan}
              onChange={e => setSatuan(e.target.value)}
              className="w-full border rounded px-2 py-1"
              required
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">Qty</label>
            <input
              type="number"
              value={qty}
              min={1}
              onChange={e => setQty(e.target.value)}
              className="w-full border rounded px-2 py-1"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">Harga Satuan</label>
            <input
              type="number"
              value={hargaSatuan}
              min={0}
              onChange={e => setHargaSatuan(e.target.value)}
              className="w-full border rounded px-2 py-1"
              required
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-1 rounded"
              onClick={onClose}
            >
              Batal
            </button>
            <button
              type="submit"
              className="bg-primary-700 hover:bg-primary-800 text-white px-4 py-1 rounded"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ModalUnitPriceRab