import React from 'react'

const JasaExportModal = ({ exportData, exportType, handleDownload, handleClose }) => {
  if (!exportData) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
        <h3 className="mb-4 text-lg font-bold">Export Result</h3>
        <div className="overflow-auto max-h-96 mb-4">
          <pre className="whitespace-pre-wrap text-xs">
            {Array.isArray(exportData)
              ? exportData.map((row) => row.join("\t")).join("\n")
              : exportData}
          </pre>
        </div>
        <div className="flex gap-2">
          <button
            className="px-4 py-2 bg-primary-700 text-white rounded hover:bg-primary-800"
            onClick={handleDownload}
          >
            Download
          </button>
          <button
            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-600"
            onClick={handleClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default JasaExportModal;