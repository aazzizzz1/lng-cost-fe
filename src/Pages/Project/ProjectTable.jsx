import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import CreateProjectModal from "./CreateProjectModal";
import { fetchProjects, fetchProjectById } from "../../Provider/Project/ProjectSlice";
import { useNavigate } from "react-router-dom";

const ProjectTable = () => {
  const dispatch = useDispatch();
  const projects = useSelector((state) => state.projects.projects);
  const projectDetails = useSelector((state) => state.projects.selectedProjectDetails);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleRowClick = (project) => {
    setSelectedProject(project);
    dispatch(fetchProjectById(project.id));
  };

  const handleDetailClick = () => {
    if (projectDetails && projectDetails.id) {
      navigate(`/project/${projectDetails.id}/detail`);
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
          <div className="w-full md:w-1/2">
            <h1 className="text-base dark:text-white">Project Overview</h1>
          </div>
          <button
            type="button"
            className="flex items-center justify-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
            onClick={() => setCreateModalOpen(true)}
          >
            Add Project
          </button>
        </div>
        <div className="flex flex-col md:flex-row">
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-4 py-3">No</th>
                  <th scope="col" className="px-4 py-3">Nama Project</th>
                  <th scope="col" className="px-4 py-3">Kategori</th>
                  <th scope="col" className="px-4 py-3">Lokasi</th>
                  <th scope="col" className="px-4 py-3">Tahun</th>
                  <th scope="col" className="px-4 py-3">AACE Level</th> {/* Added column */}
                  <th scope="col" className="px-4 py-3">Volume</th>
                  <th scope="col" className="px-4 py-3">Infrastruktur</th>
                  <th scope="col" className="px-4 py-3">Total Harga</th>
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
                    <td className="px-4 py-3">{project.name}</td>
                    <td className="px-4 py-3">{project.kategori}</td>
                    <td className="px-4 py-3">{project.lokasi}</td>
                    <td className="px-4 py-3">{project.tahun}</td>
                    <td className="px-4 py-3">{project.levelAACE || "-"}</td> {/* Display AACE Level */}
                    <td className="px-4 py-3">{project.volume || "-"}</td>
                    <td className="px-4 py-3">{project.infrastruktur}</td>
                    <td className="px-4 py-3">
                      {project.harga ? `Rp${project.harga.toLocaleString()}` : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="w-full md:w-96 md:min-w-[320px] md:max-w-md p-4 bg-gray-100 dark:bg-gray-700 mt-2 md:mt-0 md:ml-4 rounded h-fit self-start">
            {projectDetails ? (
              <div className="flex flex-col gap-2">
                <div className="font-bold text-center text-gray-900 dark:text-white">{projectDetails.name}</div>
                <div className="text-center text-gray-700 dark:text-gray-200">{projectDetails.tahun}</div>
                <div className="text-center text-gray-700 dark:text-gray-200">{projectDetails.lokasi}</div>
                <div className="mt-4 flex flex-col gap-1 text-sm bg-white dark:bg-gray-800 rounded p-3 shadow">
                  <div>
                    <span className="font-semibold text-gray-700 dark:text-gray-200">Total Harga Pekerjaan: </span>
                    <span className="text-gray-900 dark:text-white">Rp{projectDetails.totalConstructionCost?.toLocaleString?.() ?? (projectDetails.harga?.toLocaleString?.() ?? "-")}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700 dark:text-gray-200">PPN 11%: </span>
                    <span className="text-gray-900 dark:text-white">Rp{projectDetails.ppn?.toLocaleString?.() ?? "-"}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700 dark:text-gray-200">Asuransi (2,5‰): </span>
                    <span className="text-gray-900 dark:text-white">Rp{projectDetails.insurance?.toLocaleString?.() ?? "-"}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700 dark:text-gray-200">Total Perkiraan: </span>
                    <span className="text-gray-900 dark:text-white">Rp{projectDetails.totalEstimation?.toLocaleString?.() ?? "-"}</span>
                  </div>
                </div>
                <button
                  className="mt-4 bg-primary-700 hover:bg-primary-800 text-white font-semibold py-2 px-4 rounded"
                  onClick={handleDetailClick}
                >
                  Lihat Detail Harga Konstruksi
                </button>
                {/* Hapus tampilan tabel constructionCosts di sini */}
              </div>
            ) : (
              <div className="text-gray-400 dark:text-gray-300 text-center">
                Klik salah satu project untuk melihat detail harga konstruksi.
              </div>
            )}
          </div>
        </div>
        <CreateProjectModal
          isOpen={isCreateModalOpen}
          onClose={() => setCreateModalOpen(false)}
        />
      </div>
    </section>
  );
};

export default ProjectTable;