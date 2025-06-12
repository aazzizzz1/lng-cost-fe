import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import CreateProjectModal from "./CreateProjectModal";
import { createProject } from "../../Provider/ProjectSlice";
import { setFilterJenis } from "../../Provider/ConstractionCostSlice";
import { useNavigate } from "react-router-dom";

// Helper untuk mapping jenis dan kategori ke summary
const getProjectSummary = (project) => {
  if (!project) return null;
  const { jenis, kategori } = project;
  // FSRU
  if (jenis.toLowerCase().includes("fsru")) {
    if (kategori.toLowerCase().includes("big") || kategori.includes("> 150")) {
      return {
        title: "BIG SCALE LNG FSRU [> 150.000 m³]",
        tahun: "TAHUN 2024",
        perusahaan: "PT. PGN LNG INDONESIA",
        tipe: "FSRU",
      };
    }
    if (kategori.toLowerCase().includes("mid") || kategori.includes("50.000 - 150.000")) {
      return {
        title: "MID SCALE LNG FSRU [50.000 - 150.000 m³]",
        tahun: "TAHUN 2024",
        perusahaan: "PT. PGN LNG INDONESIA",
        tipe: "FSRU",
      };
    }
    if (kategori.toLowerCase().includes("small") || kategori.includes("< 30")) {
      return {
        title: "SMALL SCALE LNG FSRU [< 30.000 m³]",
        tahun: "TAHUN 2024",
        perusahaan: "PT. PGN LNG INDONESIA",
        tipe: "FSRU",
      };
    }
  }
  // LNG Plant
  if (jenis.toLowerCase().includes("liquefaction") || jenis.toLowerCase().includes("plant")) {
    if (kategori.toLowerCase().includes("big") || kategori.includes("2 mtpa")) {
      return {
        title: "BIG SCALEI LIQUEFACTION PLANT 2 MTPA",
        tahun: "TAHUN 2024",
        perusahaan: "PT. PGN LNG INDONESIA",
        tipe: "LNG Plant",
      };
    }
    if (kategori.toLowerCase().includes("small") || kategori.includes("100 - 800")) {
      return {
        title: "SMALL-SCALE LIQUEFACTION PLANT (100 - 800 TPD)",
        tahun: "TAHUN 2024",
        perusahaan: "PT. PGN LNG INDONESIA",
        tipe: "LNG Plant",
      };
    }
    if (kategori.toLowerCase().includes("mini") || kategori.includes("50–100")) {
      return {
        title: "MINI LIQUEFACTION PLANT (50–100 TPD)",
        tahun: "TAHUN 2024",
        perusahaan: "PT. PGN LNG INDONESIA",
        tipe: "LNG Plant",
      };
    }
  }
  // LNGC
  if (jenis.toLowerCase().includes("lngc") || jenis.toLowerCase().includes("carrier")) {
    if (kategori.toLowerCase().includes("big") || kategori.includes("> 100")) {
      return {
        title: "BIG SCALE LNG CARRIER (LNGC) [> 100.000 m³]",
        tahun: "TAHUN 2024",
        perusahaan: "PT. PGN LNG INDONESIA",
        tipe: "LNGC",
      };
    }
    if (kategori.toLowerCase().includes("mid") || kategori.includes("30.000 - 100.000")) {
      return {
        title: "MID SCALE LNG CARRIER (LNGC) [30.000 - 100.000 m³]",
        tahun: "TAHUN 2024",
        perusahaan: "PT. PGN LNG INDONESIA",
        tipe: "LNGC",
      };
    }
    if (kategori.toLowerCase().includes("small") || kategori.includes("< 30")) {
      return {
        title: "SMALL SCALE LNG CARRIER (LNGC) [< 30.000 m³]",
        tahun: "TAHUN 2024",
        perusahaan: "PT. PGN LNG INDONESIA",
        tipe: "LNGC",
      };
    }
  }
  // Default
  return {
    title: project.name,
    tahun: `TAHUN ${project.tahun}`,
    perusahaan: "PT. PGN LNG INDONESIA",
    tipe: project.jenis,
  };
};

const ProjectTable = () => {
  const dispatch = useDispatch();
  const projects = useSelector((state) => state.projects.projects);
  const costs = useSelector((state) => state.constractionCost.costs);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const navigate = useNavigate();

  const handleCreateProject = (newProject) => {
    dispatch(createProject(newProject));
  };

  const handleRowClick = (project) => {
    setSelectedProject(project);
  };

  const handleDetailClick = (summary) => {
    dispatch(setFilterJenis(summary.tipe));
    navigate("/construction-cost");
  };

  const summary = getProjectSummary(selectedProject);

  // Ambil summary biaya dari constractionCost sesuai tipe project
  let biayaSummary = null;
  if (selectedProject) {
    const summary = getProjectSummary(selectedProject);
    const filteredCosts = costs.filter(item => item.tipe === summary.tipe);
    const totalHargaPekerjaan = filteredCosts.reduce((sum, item) => sum + (item.totalHarga || 0), 0);
    const ppn = totalHargaPekerjaan * 0.11;
    const asuransi = totalHargaPekerjaan * 0.0025;
    const totalPerkiraan = totalHargaPekerjaan + ppn + asuransi;
    biayaSummary = {
      totalHargaPekerjaan,
      ppn,
      asuransi,
      totalPerkiraan
    };
  }

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
          <div className="w-full md:w-1/2">
            <h1 className="text-base dark:text-white">Project Overview</h1>
          </div>
          <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
            <button
              type="button"
              className="flex items-center justify-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
              onClick={() => setCreateModalOpen(true)}
            >
              <svg
                className="h-3.5 w-3.5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  clipRule="evenodd"
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                />
              </svg>
              Add Project
            </button>
            <div className="flex items-center space-x-3 w-full md:w-auto">
              <button
                id="filterDropdownButton"
                data-dropdown-toggle="filterDropdown"
                className="w-full md:w-auto flex items-center justify-center py-2 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                type="button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  className="h-4 w-4 mr-2 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                    clipRule="evenodd"
                  />
                </svg>
                Filter
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
              <div
                id="filterDropdown"
                className="z-10 hidden w-48 p-3 bg-white rounded-lg shadow dark:bg-gray-700"
              >
                <h6 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">
                  Pilih Jenis
                </h6>
                <ul
                  className="space-y-2 text-sm"
                  aria-labelledby="filterDropdownButton"
                >
                  <li className="flex items-center">
                    <input
                      id="apple"
                      type="checkbox"
                      defaultValue=""
                      className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                    />
                    <label
                      htmlFor="apple"
                      className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
                    >
                      LNG Plant
                    </label>
                  </li>
                  <li className="flex items-center">
                    <input
                      id="fitbit"
                      type="checkbox"
                      defaultValue=""
                      className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                    />
                    <label
                      htmlFor="fitbit"
                      className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
                    >
                       OTS/ORF
                    </label>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row">
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-4 py-3">
                    No
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Nama Project
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Jenis
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Kategori
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Lokasi
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Tahun
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Level AACE
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Harga
                  </th>
                  <th scope="col" className="px-4 py-3 flex items-center justify-center">
                    Setting
                  </th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project, index) => (
                  <tr
                    key={project.id}
                    className={`border-b dark:border-gray-700 cursor-pointer ${
                      selectedProject && selectedProject.id === project.id
                        ? "bg-blue-50 dark:bg-blue-900"
                        : ""
                    }`}
                    onClick={() => handleRowClick(project)}
                  >
                    <td className="px-4 py-3">{index + 1}</td>
                    <th
                      scope="row"
                      className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {project.name}
                    </th>
                    <td className="px-4 py-3">{project.jenis}</td>
                    <td className="px-4 py-3">{project.kategori}</td>
                    <td className="px-4 py-3">{project.lokasi}</td>
                    <td className="px-4 py-3">{project.tahun}</td>
                    <td className="px-4 py-3">{project.levelAACE}</td>
                    <td className="px-4 py-3">
                      Rp<span className="text-green-500 font-semibold">{project.harga.toLocaleString()}</span>
                    </td>
                    <td className="flex items-center justify-center">
                      <button
                        id="apple-imac-27-dropdown-button"
                        data-dropdown-toggle="apple-imac-27-dropdown"
                        className="inline-flex items-center p-0.5 text-sm font-medium text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100"
                        type="button"
                      >
                        <svg
                          className="w-5 h-5"
                          aria-hidden="true"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                        </svg>
                      </button>
                      <div
                        id="apple-imac-27-dropdown"
                        className="hidden z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600"
                      >
                        <ul
                          className="py-1 text-sm text-gray-700 dark:text-gray-200"
                          aria-labelledby="apple-imac-27-dropdown-button"
                        >
                          <li>
                            <a
                              href="#d"
                              className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            >
                              Show
                            </a>
                          </li>
                          <li>
                            <a
                              href="#d"
                              className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            >
                              Edit
                            </a>
                          </li>
                        </ul>
                        <div className="py-1">
                          <a
                            href="#s"
                            className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                          >
                            Delete
                          </a>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Detail summary di kanan */}
          <div className="w-full md:w-96 md:min-w-[320px] md:max-w-md p-4 bg-gray-100 dark:bg-gray-700 mt-2 md:mt-0 md:ml-4 rounded h-fit self-start">
            {summary ? (
              <div className="flex flex-col gap-2">
                <div className="font-bold text-center text-gray-900 dark:text-white">{summary.title}</div>
                <div className="text-center text-gray-700 dark:text-gray-200">{summary.tahun}</div>
                <div className="text-center text-gray-700 dark:text-gray-200">{summary.perusahaan}</div>
                {biayaSummary && (
                  <div className="mt-4 flex flex-col gap-1 text-sm bg-white dark:bg-gray-800 rounded p-3 shadow">
                    <div>
                      <span className="font-semibold text-gray-700 dark:text-gray-200">Total Harga Pekerjaan: </span>
                      <span className="text-gray-900 dark:text-white">Rp{biayaSummary.totalHargaPekerjaan.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700 dark:text-gray-200">PPN 11%: </span>
                      <span className="text-gray-900 dark:text-white">Rp{biayaSummary.ppn.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700 dark:text-gray-200">Asuransi (2,5‰): </span>
                      <span className="text-gray-900 dark:text-white">Rp{biayaSummary.asuransi.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700 dark:text-gray-200">Total Perkiraan: </span>
                      <span className="text-gray-900 dark:text-white">Rp{biayaSummary.totalPerkiraan.toLocaleString()}</span>
                    </div>
                  </div>
                )}
                <button
                  className="mt-4 bg-primary-700 hover:bg-primary-800 text-white font-semibold py-2 px-4 rounded"
                  onClick={() => handleDetailClick(summary)}
                >
                  Lihat Detail Harga Konstruksi
                </button>
              </div>
            ) : (
              <div className="text-gray-400 dark:text-gray-300 text-center">
                Klik salah satu project untuk melihat detail harga konstruksi.
              </div>
            )}
          </div>
        </div>
        <nav
          className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4"
          aria-label="Table navigation"
        >
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
            Showing
            <span className="font-semibold text-gray-900 dark:text-white">
              1-10
            </span>
            of
            <span className="font-semibold text-gray-900 dark:text-white">
              1000
            </span>
          </span>
          <ul className="inline-flex items-stretch -space-x-px">
            <li>
              <a
                href="#d"
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
              </a>
            </li>
            <li>
              <a
                href="#d"
                className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                1
              </a>
            </li>
            <li>
              <a
                href="#d"
                className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                2
              </a>
            </li>
            <li>
              <a
                href="#d"
                aria-current="page"
                className="flex items-center justify-center text-sm z-10 py-2 px-3 leading-tight text-primary-600 bg-primary-50 border border-primary-300 hover:bg-primary-100 hover:text-primary-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
              >
                3
              </a>
            </li>
            <li>
              <a
                href="#d"
                className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                ...
              </a>
            </li>
            <li>
              <a
                href="#d"
                className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                100
              </a>
            </li>
            <li>
              <a
                href="#d"
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
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </li>
          </ul>
        </nav>
        <CreateProjectModal
          isOpen={isCreateModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onCreate={handleCreateProject}
        />
      </div>
    </section>
  );
};

export default ProjectTable;
