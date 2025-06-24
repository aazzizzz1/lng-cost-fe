import React, { useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  sortByField,
  setFilterJenis,
  setSearch,
  exportToSQL,
  exportToExcel,
  clearExportData,
  downloadExportData,
  clearDownloadUrl
} from '../../../Provider/HargaSatuan/MaterialAndPackageSlice'

const PackageTable = () => {
  const sortedPackages = useSelector(state => state.materialAndPackage.sortedPackages);
//   const sortDirection = useSelector(state => state.materialAndPackage.sortDirection);
//   const sortField = useSelector(state => state.materialAndPackage.sortField);
  const filterJenis = useSelector(state => state.materialAndPackage.filterJenis);
  const search = useSelector(state => state.materialAndPackage.search);
  const exportData = useSelector(state => state.materialAndPackage.exportData);
  const exportType = useSelector(state => state.materialAndPackage.exportType);
  const downloadUrl = useSelector(state => state.materialAndPackage.downloadUrl);
  const dispatch = useDispatch();

  const [showExportModal, setShowExportModal] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const exportModalRef = useRef(null);
  const filterDropdownRef = useRef(null);

  // Get all kelompok1 for filter
  const allKelompok1 = Array.from(new Set(
    useSelector(state => state.materialAndPackage.packages).map(j => j.kelompok1)
  ));

  const handleFilterChange = (kategori) => {
    let newFilter;
    if (filterJenis.includes(kategori)) {
      newFilter = filterJenis.filter((j) => j !== kategori);
    } else {
      newFilter = [...filterJenis, kategori];
    }
    dispatch(setFilterJenis(newFilter));
  };

  const handleSearchChange = (e) => {
    dispatch(setSearch(e.target.value));
  };

  const handleExportSQL = () => {
    dispatch(exportToSQL());
    setShowExportModal(false);
  };

  const handleExportExcel = () => {
    dispatch(exportToExcel());
    setShowExportModal(false);
  };

  const handleCloseExportResult = () => {
    dispatch(clearExportData());
    dispatch(clearDownloadUrl());
  };

  // Download logic via slice
  const handleDownload = () => {
    dispatch(downloadExportData());
  };

  // After downloadUrl ready, trigger download and clear url
  React.useEffect(() => {
    if (downloadUrl && exportType) {
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = exportType === "sql" ? "package_export.sql" : "package_export.xls";
      a.click();
      dispatch(clearDownloadUrl());
    }
  }, [downloadUrl, exportType, dispatch]);

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        exportModalRef.current &&
        !exportModalRef.current.contains(event.target)
      ) {
        setShowExportModal(false);
      }
      if (
        filterDropdownRef.current &&
        !filterDropdownRef.current.contains(event.target)
      ) {
        setShowFilterDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [exportModalRef, filterDropdownRef]);

  return (
    <>
      <section className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5 antialiased">
        <div className="">
          <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
              <div className="flex-1 flex items-center space-x-2">
                <h5>
                  <span className="text-gray-500">All Package:</span>
                  <span className="dark:text-white">{sortedPackages.length}</span>
                </h5>
              </div>
              <div className="flex-shrink-0 flex flex-col items-start md:flex-row md:items-center lg:justify-end space-y-3 md:space-y-0 md:space-x-3">
                <div className="flex items-center space-x-3 w-full md:w-auto">
                  {/* Export Dropdown */}
                  <div className="relative">
                    <button
                      className="w-full md:w-auto flex items-center justify-center py-2 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                      type="button"
                      onClick={() => setShowExportModal(!showExportModal)}
                    >
                      Export
                      <svg
                        className="-mr-1 ml-1.5 w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path
                          clipRule="evenodd"
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        />
                      </svg>
                    </button>
                    {showExportModal && (
                      <div
                        className="absolute z-50 mt-2 w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600"
                        ref={exportModalRef}
                      >
                        <ul className="py-1 text-sm text-gray-700 dark:text-gray-200">
                          <li>
                            <button
                              className="block w-full text-left py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                              onClick={handleExportExcel}
                            >
                              Export Excel
                            </button>
                          </li>
                          <li>
                            <button
                              className="block w-full text-left py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                              onClick={handleExportSQL}
                            >
                              Export SQL
                            </button>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                  {/* Filter Dropdown */}
                  <div className="relative">
                    <button
                      type="button"
                      className="w-full md:w-auto flex items-center justify-center py-2 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                      onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                    >
                      Filter Kelompok 1
                      <svg
                        className="-mr-1 ml-1.5 w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path
                          clipRule="evenodd"
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        />
                      </svg>
                    </button>
                    {showFilterDropdown && (
                      <div
                        className="absolute z-50 mt-2 w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600"
                        ref={filterDropdownRef}
                      >
                        <ul className="py-1 text-sm text-gray-700 dark:text-gray-200">
                          {allKelompok1.map((kat) => (
                            <li
                              key={kat}
                              className="px-2 py-1 flex items-center"
                            >
                              <input
                                type="checkbox"
                                checked={filterJenis.includes(kat)}
                                onChange={() => handleFilterChange(kat)}
                                className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 mr-2"
                              />
                              <span className="text-sm text-gray-900 dark:text-gray-100">
                                {kat}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  {/* Search */}
                  <div className="w-full md:w-64">
                    <input
                      type="text"
                      placeholder="Search uraian/spesifikasi"
                      value={search}
                      onChange={handleSearchChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs text-left text-gray-500 dark:text-gray-400 border">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th className="p-2">No</th>
                    <th
                      className="p-2 cursor-pointer select-none"
                      onClick={() => dispatch(sortByField("uraian"))}
                    >
                      Uraian Pekerjaan
                    </th>
                    <th
                      className="p-2 cursor-pointer select-none"
                      onClick={() => dispatch(sortByField("spesifikasi"))}
                    >
                      Spesifikasi
                    </th>
                    <th className="p-2">SAT</th>
                    <th
                      className="p-2 cursor-pointer select-none"
                      onClick={() => dispatch(sortByField("qty"))}
                    >
                      QTY
                    </th>
                    <th className="p-2">People/Day</th>
                    <th
                      className="p-2 cursor-pointer select-none"
                      onClick={() => dispatch(sortByField("hargaSatuan"))}
                    >
                      Harga Satuan
                    </th>
                    <th
                      className="p-2 cursor-pointer select-none"
                      onClick={() => dispatch(sortByField("totalHarga"))}
                    >
                      Total Harga
                    </th>
                    <th
                      className="p-2 cursor-pointer select-none"
                      onClick={() => dispatch(sortByField("aaceClass"))}
                    >
                      AACE Class
                    </th>
                    <th className="p-2">Accuracy %</th>
                    <th className="p-2">Kelompok 1</th>
                    <th className="p-2">Kelompok 1.1</th>
                    <th className="p-2">Tahun</th>
                    <th className="p-2">Infrastruktur</th>
                    <th className="p-2">Volume</th>
                    <th className="p-2">Proyek</th>
                    <th className="p-2">Lokasi</th>
                    <th className="p-2">Tipe</th>
                    <th className="p-2">Jenis</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedPackages.map((item, idx) => (
                    <tr key={item.id} className="border-b dark:border-gray-600">
                      <td className="p-2">{idx + 1}</td>
                      <td className="p-2">{item.uraian}</td>
                      <td className="p-2">{item.spesifikasi}</td>
                      <td className="p-2">{item.satuan}</td>
                      <td className="p-2">{item.qty}</td>
                      <td className="p-2">{item.peoplePerDay ?? '-'}</td>
                      <td className="p-2">{item.hargaSatuan.toLocaleString()}</td>
                      <td className="p-2">{item.totalHarga.toLocaleString()}</td>
                      <td className="p-2">{item.aaceClass}</td>
                      <td className="p-2">{item.accuracyLow}% ~ {item.accuracyHigh}%</td>
                      <td className="p-2">{item.kelompok1}</td>
                      <td className="p-2">{item.kelompok1_1}</td>
                      <td className="p-2">{item.tahun}</td>
                      <td className="p-2">{item.infrastruktur}</td>
                      <td className="p-2">{item.volume}</td>
                      <td className="p-2">{item.proyek}</td>
                      <td className="p-2">{item.lokasi}</td>
                      <td className="p-2">{item.tipe}</td>
                      <td className="p-2">{item.jenis}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Export result modal */}
            {exportData && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
                <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg max-w-lg w-full">
                  <h3 className="text-lg font-bold mb-2">Export Result</h3>
                  <div className="mb-4">
                    <pre className="overflow-x-auto text-xs bg-gray-100 dark:bg-gray-900 p-2 rounded max-h-60">
                      {exportType === "sql"
                        ? exportData
                        : exportData.map(row => row.join("\t")).join("\n")}
                    </pre>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={handleDownload}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Download
                    </button>
                    <button
                      onClick={handleCloseExportResult}
                      className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}

export default PackageTable