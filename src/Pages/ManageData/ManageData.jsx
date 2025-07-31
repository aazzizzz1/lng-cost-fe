import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteAllUnitPrices, uploadUnitPriceExcel } from '../../Provider/HargaSatuan/unitPriceSlice'
import { uploadCapacityFactorExcel, deleteAllCapacityFactor } from '../../Provider/CapacityFactorSlice'

const ManageData = () => {
  const dispatch = useDispatch();
  const { deleteLoading, deleteResult, uploadLoading, uploadResult } = useSelector(state => state.unitPrice);
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);

  // State untuk upload Capacity Factor
  const { cfUploadLoading, cfUploadResult, cfDeleteLoading, cfDeleteResult } = useSelector(state => state.capacityFactor);
  const [cfSelectedFile, setCfSelectedFile] = useState(null);
  const cfFileInputRef = useRef(null);

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

  // Handler upload Capacity Factor Excel
  const handleCfFileChange = (e) => {
    setCfSelectedFile(e.target.files[0]);
  };

  const handleUploadCfExcel = (e) => {
    e.preventDefault();
    if (cfSelectedFile) {
      dispatch(uploadCapacityFactorExcel(cfSelectedFile));
    }
  };

  // Handler delete all capacity factor
  const handleDeleteAllCapacityFactor = () => {
    dispatch(deleteAllCapacityFactor());
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
      {/* Tombol Delete All Capacity Factor */}
      <div className="mt-4">
        <button
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded shadow disabled:opacity-60"
          onClick={handleDeleteAllCapacityFactor}
          disabled={cfDeleteLoading}
        >
          {cfDeleteLoading ? "Deleting..." : "Delete All Capacity Factor"}
        </button>
        {cfDeleteResult && (
          <div className={`mt-4 px-4 py-2 rounded text-sm ${cfDeleteResult.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
            <div>{cfDeleteResult.message}</div>
            {cfDeleteResult.count !== undefined && (
              <div>Rows Deleted: <b>{cfDeleteResult.count}</b></div>
            )}
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
        {/* Upload Capacity Factor Excel */}
        <form onSubmit={handleUploadCfExcel} className="flex flex-col gap-4 max-w-md mt-8">
          <label className="block text-gray-700 dark:text-white font-semibold">
            Upload Capacity Factor Excel
          </label>
          <input
            type="file"
            accept=".xlsx,.xls"
            ref={cfFileInputRef}
            onChange={handleCfFileChange}
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 dark:bg-gray-700 dark:border-gray-600"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow disabled:opacity-60"
            disabled={cfUploadLoading || !cfSelectedFile}
          >
            {cfUploadLoading ? "Uploading..." : "Upload Excel"}
          </button>
        </form>
        {cfUploadResult && (
          <div className={`mt-4 px-4 py-2 rounded text-sm ${cfUploadResult.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
            <div>{cfUploadResult.message}</div>
            {cfUploadResult.count !== undefined && (
              <div>Rows Uploaded: <b>{cfUploadResult.count}</b></div>
            )}
            {cfUploadResult.skippedRows && cfUploadResult.skippedRows.length > 0 && (
              <div>
                Skipped Rows: <span className="font-mono">{cfUploadResult.skippedRows.join(', ')}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ManageData