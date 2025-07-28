import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteAllUnitPrices, uploadUnitPriceExcel } from '../../Provider/HargaSatuan/unitPriceSlice'

const ManageData = () => {
  const dispatch = useDispatch();
  const { deleteLoading, deleteResult, uploadLoading, uploadResult } = useSelector(state => state.unitPrice);
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleDeleteAllUnitPrices = () => {
    dispatch(deleteAllUnitPrices());
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUploadExcel = (e) => {
    e.preventDefault();
    if (selectedFile) {
      dispatch(uploadUnitPriceExcel(selectedFile));
    }
  };

  return (
    <div className="p-4 dark:bg-darkmode md:h-screen dark:overflow-auto">
      <p className="text-3xl font-bold text-gray-900 dark:text-white">
        Management and Configuration Project
      </p>
      <p className="text-xl text-gray-600 dark:text-white mb-2">
        Management and Configuration Project Detail
      </p>
      {/* Tombol Delete All Unit Prices */}
      <div className="mt-8">
        <button
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded shadow disabled:opacity-60"
          onClick={handleDeleteAllUnitPrices}
          disabled={deleteLoading}
        >
          {deleteLoading ? "Deleting..." : "Delete All Unit Prices"}
        </button>
        {deleteResult && (
          <div className={`mt-4 px-4 py-2 rounded text-sm ${deleteResult.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
            {deleteResult.message}
          </div>
        )}
      </div>
      {/* Upload Excel */}
      <div className="mt-12">
        <form onSubmit={handleUploadExcel} className="flex flex-col gap-4 max-w-md">
          <label className="block text-gray-700 dark:text-white font-semibold">
            Upload Unit Price Excel
          </label>
          <input
            type="file"
            accept=".xlsx,.xls"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 dark:bg-gray-700 dark:border-gray-600"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow disabled:opacity-60"
            disabled={uploadLoading || !selectedFile}
          >
            {uploadLoading ? "Uploading..." : "Upload Excel"}
          </button>
        </form>
        {uploadResult && (
          <div className={`mt-4 px-4 py-2 rounded text-sm ${uploadResult.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
            <div>{uploadResult.message}</div>
            {uploadResult.count !== undefined && (
              <div>Rows Uploaded: <b>{uploadResult.count}</b></div>
            )}
            {uploadResult.skippedRows && uploadResult.skippedRows.length > 0 && (
              <div>
                Skipped Rows: <span className="font-mono">{uploadResult.skippedRows.join(', ')}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ManageData