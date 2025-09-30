import React, { useRef, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteAllUnitPrices, uploadUnitPriceExcel } from '../../Provider/HargaSatuan/unitPriceSlice'
import { uploadCapacityFactorExcel, deleteAllCapacityFactor } from '../../Provider/CapacityFactorSlice'
import DeleteModal from '../../Components/Modal/DeleteModal'; // NEW

const ManageData = () => {
  const dispatch = useDispatch();
  const { deleteLoading, deleteResult, uploadLoading, uploadResult } = useSelector(state => state.unitPrice);
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);

  // State untuk upload Capacity Factor
  const { cfUploadLoading, cfUploadResult, cfDeleteLoading, cfDeleteResult } = useSelector(state => state.capacityFactor);
  const [cfSelectedFile, setCfSelectedFile] = useState(null);
  const cfFileInputRef = useRef(null);

  // NEW: modal states
  const [showDelUnitModal, setShowDelUnitModal] = useState(false);
  const [showDelCFModal, setShowDelCFModal] = useState(false);
  // NEW: focus refs
  const unitYesRef = useRef(null);
  const cfYesRef = useRef(null);
  // NEW: focus effect
  useEffect(() => {
    if (showDelUnitModal && unitYesRef.current) unitYesRef.current.focus();
  }, [showDelUnitModal]);
  useEffect(() => {
    if (showDelCFModal && cfYesRef.current) cfYesRef.current.focus();
  }, [showDelCFModal]);

  const handleDeleteAllUnitPrices = () => {
    dispatch(deleteAllUnitPrices()).then(() => setShowDelUnitModal(false));
  };
  const handleDeleteAllCapacityFactor = () => {
    dispatch(deleteAllCapacityFactor()).then(() => setShowDelCFModal(false));
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
            {/* Informasi format Excel */}
            <div className="bg-gradient-to-r from-blue-50 via-blue-100 to-blue-50 dark:from-blue-900 dark:via-blue-800 dark:to-blue-900 border border-blue-300 dark:border-blue-700 rounded-lg p-4 text-sm text-blue-900 dark:text-blue-100 mb-2 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-blue-500 dark:text-blue-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" />
                </svg>
                <b className="font-semibold">Format Excel yang diperlukan</b>
              </div>
              <div className="overflow-x-auto mt-1">
                <table className="min-w-max text-xs font-mono border border-blue-200 dark:border-blue-700 rounded">
                  <thead>
                    <tr>
                      {["Work code","Item", "Specification", "Qty", "Satuan", "Cost", "Total Cost", "Group 1", "Group 1.1", "AACE Class", "Low", "High", "Year", "Infrastructure", "Volume", "Satuan", "Project", "Location", "Type"].map((col, idx) => (
                        <th key={idx} className="px-2 py-1 bg-blue-100 dark:bg-blue-800 border-r border-blue-200 dark:border-blue-700 last:border-r-0 text-blue-700 dark:text-blue-100 font-semibold">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                </table>
              </div>
            </div>
            <div>
              <button
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded shadow disabled:opacity-60 w-full"
                onClick={() => setShowDelUnitModal(true)} /* CHANGED */
                disabled={deleteLoading}
              >
                {deleteLoading ? "Deleting..." : "Delete All Unit Prices"}
              </button>
              {/* ...existing deleteResult message... */}
              {deleteResult && (
                // ...existing code...
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
              Calculator
            </h2>
            {/* Informasi format Excel Capacity Factor */}
            <div className="bg-gradient-to-r from-green-50 via-green-100 to-green-50 dark:from-green-900 dark:via-green-800 dark:to-green-900 border border-green-300 dark:border-green-700 rounded-lg p-4 text-sm text-green-900 dark:text-green-100 mb-2 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-green-500 dark:text-green-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" />
                </svg>
                <b className="font-semibold">Format Excel yang diperlukan</b>
              </div>
              <div className="overflow-x-auto mt-1">
                <table className="min-w-max text-xs font-mono border border-green-200 dark:border-green-700 rounded">
                  <thead>
                    <tr>
                      {[
                        "Infrastructure", "Volume", "Unit", "Total Cost", "Year", "Location", "Low", "High", "information"
                      ].map((col, idx) => (
                        <th key={idx} className="px-2 py-1 bg-green-100 dark:bg-green-800 border-r border-green-200 dark:border-green-700 last:border-r-0 text-green-700 dark:text-green-100 font-semibold">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                </table>
              </div>
            </div>
            <div>
              <button
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded shadow disabled:opacity-60 w-full"
                onClick={() => setShowDelCFModal(true)} /* CHANGED */
                disabled={cfDeleteLoading}
              >
                {cfDeleteLoading ? "Deleting..." : "Delete All Calculator Data"}
              </button>
              {cfDeleteResult && (
                // ...existing code...
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
                Upload Calculator Excel
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

      {/* NEW: Reusable Delete Modals */}
      <DeleteModal
        isOpen={showDelUnitModal}
        title="Delete All Unit Prices"
        message="This will permanently remove ALL Unit Price records from the database. This action cannot be undone. Proceed?"
        confirmText="Yes, delete all"
        cancelText="Cancel"
        loading={deleteLoading}
        onConfirm={handleDeleteAllUnitPrices}
        onCancel={() => setShowDelUnitModal(false)}
        danger
      />
      <DeleteModal
        isOpen={showDelCFModal}
        title="Delete All Calculator Data"
        message="All Calculator Data records will be permanently removed. Are you sure you want to continue?"
        confirmText="Yes, delete all"
        cancelText="Cancel"
        loading={cfDeleteLoading}
        onConfirm={handleDeleteAllCapacityFactor}
        onCancel={() => setShowDelCFModal(false)}
        danger
      />
    </div>
  )
}

export default ManageData