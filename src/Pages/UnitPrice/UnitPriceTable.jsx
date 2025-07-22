import React from 'react';
import Spinner from '../../Components/Spinner/Spinner';

// Kolom yang ingin ditampilkan
const columns = [
  { key: "uraian", label: "Uraian" },
  { key: "kategori", label: "Kategori" },
  { key: "satuan", label: "Satuan" },
  { key: "qty", label: "Qty" },
  { key: "hargaSatuan", label: "Harga Satuan" },
  { key: "totalHarga", label: "Total Harga" },
  { key: "aaceClass", label: "AACE Class" },
  { key: "tahun", label: "Tahun" },
  { key: "proyek", label: "Proyek" },
  { key: "lokasi", label: "Lokasi" },
  { key: "kelompok", label: "Kelompok" },
  { key: "infrastruktur", label: "Infrastruktur" },
  { key: "volume", label: "Volume" },
  { key: "satuanVolume", label: "Satuan Volume" },
  { key: "kapasitasRegasifikasi", label: "Kapasitas Regasifikasi" },
  { key: "satuanKapasitas", label: "Satuan Kapasitas" },
  { key: "tipe", label: "Tipe" },
];

const UnitPriceTable = ({ data, loading, pagination, onPageChange, onLimitChange, onSortChange }) => {
  const { page, limit, total, totalPages } = pagination;

  const handleSort = (key) => {
    if (onSortChange) {
      onSortChange(key);
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
        <div className="flex-1 overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Spinner />
            </div>
          ) : (
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-4 py-3">No</th>
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      scope="col"
                      className="px-4 py-3 cursor-pointer hover:text-primary-600"
                      onClick={() => handleSort(col.key)}
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {!data || data.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="text-center py-6">
                      Tidak ada data.
                    </td>
                  </tr>
                ) : (
                  data.map((row, index) => (
                    <tr key={row.id} className="border-b dark:border-gray-700">
                      <td className="px-4 py-3">{index + 1 + (page - 1) * limit}</td>
                      {columns.map((col) => (
                        <td key={col.key} className="px-4 py-3">
                          {col.key === "hargaSatuan" || col.key === "totalHarga"
                            ? row[col.key]
                              ? `Rp${Number(row[col.key]).toLocaleString()}`
                              : ""
                            : row[col.key]}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
        <nav
          className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4"
          aria-label="Table navigation"
        >
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
            Showing
            <span className="font-semibold text-gray-900 dark:text-white">
              {Math.min((page - 1) * limit + 1, total)}-{Math.min(page * limit, total)}
            </span>
            of
            <span className="font-semibold text-gray-900 dark:text-white">
              {total}
            </span>
          </span>
          <div className="flex items-center space-x-4">
            <select
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              className="px-3 py-2 border rounded text-sm text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              {[10, 30, 50].map((option) => (
                <option key={option} value={option}>
                  {option} per page
                </option>
              ))}
            </select>
            <ul className="inline-flex items-stretch -space-x-px">
              <li>
                <button
                  disabled={page === 1}
                  onClick={() => onPageChange(page - 1)}
                  className="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  <span className="sr-only">Previous</span>
                  <svg
                    className="w-5 h-5"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </li>
              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                if (
                  pageNumber === 1 ||
                  pageNumber === totalPages ||
                  (pageNumber >= page - 2 && pageNumber <= page + 2)
                ) {
                  return (
                    <li key={pageNumber}>
                      <button
                        onClick={() => onPageChange(pageNumber)}
                        className={`flex items-center justify-center text-sm py-2 px-3 leading-tight ${
                          page === pageNumber
                            ? "text-primary-600 bg-primary-50 border border-primary-300 hover:bg-primary-100 hover:text-primary-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                            : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    </li>
                  );
                }
                if (
                  pageNumber === page - 3 ||
                  pageNumber === page + 3 ||
                  (pageNumber === 2 && page > 5) ||
                  (pageNumber === totalPages - 1 && page < totalPages - 4)
                ) {
                  return (
                    <li key={pageNumber}>
                      <span className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400">
                        ...
                      </span>
                    </li>
                  );
                }
                return null;
              })}
              <li>
                <button
                  disabled={page === totalPages}
                  onClick={() => onPageChange(page + 1)}
                  className="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  <span className="sr-only">Next</span>
                  <svg
                    className="w-5 h-5"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4-4a1 1 0 010 1.414l-4-4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </section>
  );
};

export default UnitPriceTable;