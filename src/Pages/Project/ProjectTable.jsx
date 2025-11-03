import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import CreateProjectModal from "./CreateProjectModal";
import { deleteProject, updateProjectApproval, fetchProjectFilters, fetchProjectsPaged, setProjectFilters, setProjectPagination, setFilterOpen } from "../../Provider/Project/ProjectSlice";
import { useNavigate } from "react-router-dom";
import DeleteModal from '../../Components/Modal/DeleteModal';

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
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const isAdmin = typeof user?.role === 'string' && user.role.toLowerCase() === 'admin';

  // NEW: list state from store
  const { projects, loading, filters, pagination, filterOptions, filterOpen } = useSelector((s) => s.projects);

  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  // REMOVED local openFilter state; use slice instead
  const dropdownRef = useRef(null); // NEW: for click-outside

  // Close on click-outside and Escape
  useEffect(() => {
    const handleDocClick = (e) => {
      if (!filterOpen) return;
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        dispatch(setFilterOpen(false));
      }
    };
    const handleKey = (e) => {
      if (e.key === 'Escape') dispatch(setFilterOpen(false));
    };
    document.addEventListener('mousedown', handleDocClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleDocClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [filterOpen, dispatch]);

  // Load initial filter options
  useEffect(() => {
    dispatch(fetchProjectFilters({})); // infrastruktur + volume awal
  }, [dispatch]);

  // Cascade volume options when infrastruktur changes
  useEffect(() => {
    if (filters.infrastruktur) {
      dispatch(fetchProjectFilters({ infrastruktur: filters.infrastruktur }));
      // reset volume to ensure consistent cascade
      dispatch(setProjectFilters({ volume: "" }));
      dispatch(setProjectPagination({ page: 1 }));
    }
  }, [dispatch, filters.infrastruktur]);

  // Load list whenever params change
  useEffect(() => {
    const params = {
      variant,
      page: pagination.page,
      limit: pagination.limit,
      sort: filters.sort,
      order: filters.order,
      infrastruktur: filters.infrastruktur || undefined,
      volume: filters.volume || undefined,
      // removed: search
    };
    dispatch(fetchProjectsPaged(params));
  }, [
    dispatch,
    variant,
    pagination.page,
    pagination.limit,
    filters.sort,
    filters.order,
    filters.infrastruktur,
    filters.volume,
    // removed: filters.search
  ]);

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
    dispatch(updateProjectApproval({ projectId: project.id, approval: !project.approval }));
  };

  // Filters & sorting handlers
  const onInfraChange = (e) => {
    dispatch(setProjectFilters({ infrastruktur: e.target.value || "", volume: "" }));
    dispatch(setProjectPagination({ page: 1 }));
  };
  const onVolumeChange = (e) => {
    dispatch(setProjectFilters({ volume: e.target.value || "" }));
    dispatch(setProjectPagination({ page: 1 }));
  };
  const onLimitChange = (e) => {
    const limit = Number(e.target.value) || 10;
    dispatch(setProjectPagination({ limit, page: 1 }));
  };
  const onPageChange = (page) => dispatch(setProjectPagination({ page }));
  const toggleSort = (key) => {
    const order = filters.sort === key && filters.order === 'asc' ? 'desc' : 'asc';
    dispatch(setProjectFilters({ sort: key, order }));
    dispatch(setProjectPagination({ page: 1 }));
  };

  const { page, limit, total, totalPages } = pagination;

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
        {/* Header bar: actions on right, no search */}
        <div className="flex flex-col items-center justify-between p-4 space-y-3 md:flex-row md:space-y-0 md:space-x-4">
          <div className="w-full md:w-1/2">
            {/* optional title area (left side) */}
          </div>
          <div className="flex flex-col items-stretch justify-end flex-shrink-0 w-full space-y-2 md:w-auto md:flex-row md:space-y-0 md:items-center md:space-x-3">
            <button
              type="button"
              className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700"
              onClick={() => setCreateModalOpen(true)}
            >
              <svg className="h-3.5 w-3.5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path clipRule="evenodd" fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
              </svg>
              Add Project
            </button>
            <div className="flex items-center w-full space-x-3 md:w-auto">
              {/* Filter button + dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => dispatch(setFilterOpen(!filterOpen))}
                  className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg md:w-auto hover:bg-gray-100 hover:text-primary-700 focus:ring-4 focus:ring-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="w-4 h-4 mr-2 text-gray-400 dark:text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                  </svg>
                  Filter
                  <svg className="-mr-1 ml-1.5 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path clipRule="evenodd" fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </button>
                {filterOpen && (
                  <div className="absolute right-0 z-10 mt-2 w-64 p-3 bg-white rounded-lg shadow dark:bg-gray-700">
                    <h6 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">Filters</h6>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs mb-1 text-gray-600 dark:text-white">Infrastruktur</label>
                        <select
                          value={filters.infrastruktur}
                          onChange={onInfraChange}
                          className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm dark:text-white"
                        >
                          <option value="">Semua Infrastruktur</option>
                          {(filterOptions.infrastruktur || []).map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs mb-1 text-gray-600 dark:text-white">Volume</label>
                        <select
                          value={filters.volume}
                          onChange={onVolumeChange}
                          className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm dark:text-white"
                        >
                          <option value="">Semua Volume</option>
                          {(filterOptions.volume || []).map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            dispatch(setProjectFilters({ infrastruktur: '', volume: '' }));
                            dispatch(setProjectPagination({ page: 1 }));
                            dispatch(setFilterOpen(false));
                          }}
                          className="px-3 py-1 text-xs rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-white"
                        >
                          Reset
                        </button>
                        <button
                          type="button"
                          onClick={() => dispatch(setFilterOpen(false))}
                          className="px-3 py-1 text-xs rounded bg-primary-600 text-white hover:bg-primary-700"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row">
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-4 py-3">No</th>
                  <th
                    scope="col"
                    className="px-4 py-3 cursor-pointer select-none"
                    onClick={() => toggleSort('name')}
                    title="Sort by Nama"
                  >
                    Nama Project
                  </th>
                  <th scope="col" className="px-4 py-3">Lokasi</th>
                  <th
                    scope="col"
                    className="px-4 py-3 cursor-pointer select-none"
                    onClick={() => toggleSort('tahun')}
                    title="Sort by Tahun"
                  >
                    Tahun
                  </th>
                  <th scope="col" className="px-4 py-3">AACE Level</th>
                  <th scope="col" className="px-4 py-3">Volume</th>
                  <th scope="col" className="px-4 py-3">Infrastruktur</th>
                  <th
                    scope="col"
                    className="px-4 py-3 cursor-pointer select-none"
                    onClick={() => toggleSort('harga')}
                    title="Sort by Total Harga"
                  >
                    Total Harga
                  </th>
                  <th scope="col" className="px-4 py-3 text-center">Aksi</th>
                  {isAdmin && (
                    <th scope="col" className="px-4 py-3 text-center">Approval</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={isAdmin ? 10 : 9} className="px-4 py-8 text-center text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : projects.length === 0 ? (
                  <tr>
                    <td colSpan={isAdmin ? 10 : 9} className="px-4 py-8 text-center text-gray-500">
                      Tidak ada data.
                    </td>
                  </tr>
                ) : (
                  projects.map((project, index) => (
                    <tr
                      key={project.id}
                      className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="px-4 py-3">{index + 1 + (page - 1) * limit}</td>
                      <td className="px-4 py-3">{project.name}</td>
                      <td className="px-4 py-3">{project.lokasi}</td>
                      <td className="px-4 py-3">{project.tahun}</td>
                      <td className="px-4 py-3">{project.levelAACE || "-"}</td>
                      <td className="px-4 py-3">
                        {project.volume ? `${project.volume}${project.satuan ? ` ${project.satuan}` : ""}` : "-"}
                      </td>
                      <td className="px-4 py-3">{project.infrastruktur}</td>
                      <td className="px-4 py-3">
                        {project.harga ? `Rp${Number(project.harga).toLocaleString()}` : "-"}
                      </td>
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
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* NEW: Pagination */}
        <nav
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 border-t border-gray-200 dark:border-gray-700"
          aria-label="Table navigation"
        >
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Showing
            <span className="mx-1 font-semibold text-gray-900 dark:text-white">
              {total === 0 ? 0 : (page - 1) * limit + 1}-{Math.min(page * limit, total)}
            </span>
            of
            <span className="ml-1 font-semibold text-gray-900 dark:text-white">{total}</span>
          </span>
          <div className="flex items-center gap-4">
            <select
              aria-label="Limit"
              value={limit}
              onChange={onLimitChange}
              className="px-3 py-2 border rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
            >
              {[10, 20, 30, 40, 50].map((n) => (
                <option key={n} value={n}>{n} per page</option>
              ))}
            </select>
            <ul className="inline-flex items-stretch">
              <li>
                <button
                  disabled={page === 1}
                  onClick={() => onPageChange(page - 1)}
                  className="flex items-center justify-center h-9 px-3 text-sm rounded-l-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-50 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Prev
                </button>
              </li>
              {[...Array(totalPages)].map((_, idx) => {
                const num = idx + 1;
                if (num === 1 || num === totalPages || (num >= page - 2 && num <= page + 2)) {
                  return (
                    <li key={num}>
                      <button
                        onClick={() => onPageChange(num)}
                        className={`h-9 px-3 text-sm border-t border-b ${
                          page === num
                            ? "bg-primary-600 text-white border-primary-600"
                            : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700"
                        }`}
                      >
                        {num}
                      </button>
                    </li>
                  );
                }
                if (num === page - 3 || num === page + 3) {
                  return (
                    <li key={num}>
                      <span className="h-9 px-3 inline-flex items-center justify-center text-sm border-t border-b bg-white text-gray-500 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-400">
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
                  className="flex items-center justify-center h-9 px-3 text-sm rounded-r-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-50 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Next
                </button>
              </li>
            </ul>
          </div>
        </nav>

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