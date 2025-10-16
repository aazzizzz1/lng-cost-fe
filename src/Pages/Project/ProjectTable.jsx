import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import CreateProjectModal from "./CreateProjectModal";
import { fetchManualProjects, fetchAutoProjects, deleteProject, updateProjectApproval } from "../../Provider/Project/ProjectSlice";
import { useNavigate } from "react-router-dom";
import DeleteModal from '../../Components/Modal/DeleteModal'; // NEW

// Adaptive icons (SVG, inherit color via currentColor)
const EditIcon = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className} aria-hidden="true">
    <path strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" d="M16.862 3.487a2.25 2.25 0 0 1 3.182 3.182L9.06 17.653a2 2 0 0 1-.9.53L5 19l.817-3.16a2 2 0 0 1 .53-.9L16.862 3.487z" />
    <path strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" d="M19 13v5a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h5" />
  </svg>
);

const TrashIcon = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className} aria-hidden="true">
    <path strokeWidth="1.6" strokeLinecap="round" d="M4 7h16" />
    <path strokeWidth="1.6" strokeLinecap="round" d="M10 11v6M14 11v6" />
    <path strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" d="M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12" />
    <path strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
  </svg>
);

// NEW: Detail (eye) icon
const EyeIcon = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className} aria-hidden="true">
    <path strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" d="M1.5 12s4-7.5 10.5-7.5S22.5 12 22.5 12 18.5 19.5 12 19.5 1.5 12 1.5 12z" />
    <circle cx="12" cy="12" r="3" strokeWidth="1.6" />
  </svg>
);

const ProjectTable = ({ variant = "manual" }) => {
  const dispatch = useDispatch();
  const projects = useSelector((state) => state.projects.projects);
  const { user } = useSelector((state) => state.auth);
  const isAdmin = typeof user?.role === 'string' && user.role.toLowerCase() === 'admin';
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (variant === "auto") {
      dispatch(fetchAutoProjects());
    } else {
      dispatch(fetchManualProjects());
    }
  }, [dispatch, variant]);

  const handleDeleteProject = (projectId) => {
    setDeleteTarget(projectId);
    setShowDeleteModal(true);
  };
  const confirmDeleteProject = () => {
    if (!deleteTarget) return;
    dispatch(deleteProject(deleteTarget));
    setShowDeleteModal(false);
    setDeleteTarget(null);
  };

  const handleToggleApproval = (e, project) => {
    e.stopPropagation();
    if (!project?.id) return;
    const next = !project.approval;
    dispatch(updateProjectApproval({ projectId: project.id, approval: next }));
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
                  {/* ...existing headers... */}
                  <th scope="col" className="px-4 py-3">No</th>
                  <th scope="col" className="px-4 py-3">Nama Project</th>
                  <th scope="col" className="px-4 py-3">Lokasi</th>
                  <th scope="col" className="px-4 py-3">Tahun</th>
                  <th scope="col" className="px-4 py-3">AACE Level</th>
                  <th scope="col" className="px-4 py-3">Volume</th>
                  <th scope="col" className="px-4 py-3">Infrastruktur</th>
                  <th scope="col" className="px-4 py-3">Total Harga</th>
                  <th scope="col" className="px-4 py-3 text-center">Aksi</th>
                  {isAdmin && (
                    <th scope="col" className="px-4 py-3 text-center">Approval</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {projects.map((project, index) => (
                  <tr
                    key={project.id}
                    className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    {/* ...existing cells before Aksi... */}
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3">{project.name}</td>
                    <td className="px-4 py-3">{project.lokasi}</td>
                    <td className="px-4 py-3">{project.tahun}</td>
                    <td className="px-4 py-3">{project.levelAACE || "-"}</td>
                    <td className="px-4 py-3">
                      {project.volume ? `${project.volume}${project.satuan ? ` ${project.satuan}` : ""}` : "-"}
                    </td>
                    <td className="px-4 py-3">{project.infrastruktur}</td>
                    <td className="px-4 py-3">
                      {project.harga ? `Rp${project.harga.toLocaleString()}` : "-"}
                    </td>

                    {/* Aksi: Edit / Detail / Delete */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          aria-label="Edit"
                          title="Edit"
                          className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-primary-700 text-white hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-300 dark:focus:ring-primary-600 shadow-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/project/${project.id}/edit`);
                          }}
                        >
                          <EditIcon className="w-4 h-4" />
                        </button>

                        {/* NEW: Detail button to open construction detail */}
                        <button
                          aria-label="Detail"
                          title="Detail Konstruksi"
                          className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-sky-600 text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-300 dark:focus:ring-sky-600 shadow-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/project/${project.id}/detail`);
                          }}
                        >
                          <EyeIcon className="w-4 h-4" />
                        </button>

                        <button
                          aria-label="Hapus"
                          title="Delete"
                          className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-rose-600 text-white hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-300 dark:focus:ring-rose-600 shadow-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteProject(project.id);
                          }}
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                    {/* Approval: admin only */}
                    {isAdmin && (
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            title={project.approval ? "Set Unapproved" : "Set Approved"}
                            onClick={(e) => handleToggleApproval(e, project)}
                            className={`inline-flex items-center justify-center w-8 h-8 rounded-md ${
                              project.approval
                                ? 'bg-emerald-600 hover:bg-emerald-700'
                                : 'bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600'
                            } text-white focus:outline-none focus:ring-2 focus:ring-emerald-300 dark:focus:ring-emerald-600 shadow-sm`}
                          >
                            <span className="sr-only">Toggle Approval</span>
                            {project.approval ? '✓' : '✕'}
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Delete confirmation modal */}
        <DeleteModal
          isOpen={showDeleteModal}
          title="Delete Project"
          message="This will permanently remove the selected project and its construction cost records. This action cannot be undone. Proceed?"
          confirmText="Yes, delete"
          cancelText="Cancel"
          loading={false}
          onConfirm={confirmDeleteProject}
          onCancel={() => setShowDeleteModal(false)}
          danger
        />
        <CreateProjectModal
          isOpen={isCreateModalOpen}
          onClose={() => setCreateModalOpen(false)}
        />
      </div>
    </section>
  );
};

export default ProjectTable;