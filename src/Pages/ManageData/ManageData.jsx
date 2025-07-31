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
    <div className="p-4 dark:bg-darkmode min-h-screen dark:overflow-auto">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Management and Configuration Project
        </h1>
        <p className="text-xl text-gray-600 dark:text-white mb-8">
          Management and Configuration Project Detail
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* UNIT PRICE SECTION */}
          <section className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col gap-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-300 mb-2 flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
              Unit Price
            </h2>
            <div>
              <button
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded shadow disabled:opacity-60 w-full"
                onClick={handleDeleteAllUnitPrices}
                disabled={deleteLoading}
              >
                {deleteLoading ? "Deleting..." : "Delete All Unit Prices"}
              </button>
              {deleteResult && (
                <div className={`mt-3 px-4 py-2 rounded text-sm ${deleteResult.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                  {deleteResult.message}
                </div>
              )}
            </div>
            <form onSubmit={handleUploadExcel} className="flex flex-col gap-3">
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
              <div className={`mt-3 px-4 py-2 rounded text-sm ${uploadResult.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
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
          </section>
          {/* CAPACITY FACTOR SECTION */}
          <section className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col gap-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-green-700 dark:text-green-300 mb-2 flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
              Capacity Factor
            </h2>
            <div>
              <button
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded shadow disabled:opacity-60 w-full"
                onClick={handleDeleteAllCapacityFactor}
                disabled={cfDeleteLoading}
              >
                {cfDeleteLoading ? "Deleting..." : "Delete All Capacity Factor"}
              </button>
              {cfDeleteResult && (
                <div className={`mt-3 px-4 py-2 rounded text-sm ${cfDeleteResult.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                  <div>{cfDeleteResult.message}</div>
                  {cfDeleteResult.count !== undefined && (
                    <div>Rows Deleted: <b>{cfDeleteResult.count}</b></div>
                  )}
                </div>
              )}
            </div>
            <form onSubmit={handleUploadCfExcel} className="flex flex-col gap-3">
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
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded shadow disabled:opacity-60"
                disabled={cfUploadLoading || !cfSelectedFile}
              >
                {cfUploadLoading ? "Uploading..." : "Upload Excel"}
              </button>
            </form>
            {cfUploadResult && (
              <div className={`mt-3 px-4 py-2 rounded text-sm ${cfUploadResult.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
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
          </section>
        </div>
      </div>
    </div>
  )
}

export default ManageData