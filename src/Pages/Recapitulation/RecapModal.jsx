import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { fetchProjects } from '../../Provider/Project/ProjectSlice';
import { fetchApprovedLibraryProjects, selectApprovedLibraryProjects } from '../../Provider/Library/PreviewSlice';

const RecapModal = ({ isOpen, onClose, onAdd, selectedIds = [] }) => {
  const dispatch = useDispatch();
  const projects = useSelector(selectApprovedLibraryProjects) || [];
  const [checkedIds, setCheckedIds] = useState([]);

  // Fetch approved library projects when modal opens
  useEffect(() => {
    if (isOpen) {
      // dispatch(fetchProjects());
      dispatch(fetchApprovedLibraryProjects());
      setCheckedIds([]); // reset selection when opened
    }
  }, [isOpen, dispatch]);

  const displayProjects = projects.filter(p => !selectedIds.includes(p.id)); // exclude already selected

  const handleCheck = (id) => {
    setCheckedIds(prev =>
      prev.includes(id)
        ? prev.filter(pid => pid !== id)
        : [...prev, id]
    );
  };

  const handleAdd = () => {
    if (onAdd && checkedIds.length > 0) {
      onAdd(checkedIds);
      setCheckedIds([]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm">
      <section className="bg-white dark:bg-gray-900 rounded-lg shadow-lg min-w-[28rem] max-h-[32rem] overflow-y-auto">
        <div className="p-6">
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
            Choose Projects to Add
          </h2>
          <div className="mb-4">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {displayProjects.length === 0 && (
                <li className="py-2 text-gray-400 dark:text-gray-500 text-center">
                  {projects.length === 0 ? 'Memuat project...' : 'Semua project sudah dipilih.'}
                </li>
              )}
              {displayProjects.map(project => (
                <li key={project.id} className="flex items-center gap-2 py-2">
                  <input
                    type="checkbox"
                    checked={checkedIds.includes(project.id)}
                    onChange={() => handleCheck(project.id)}
                    className="accent-primary-600"
                  />
                  <span className="text-gray-900 dark:text-white">{project.name || project.title}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex gap-2 mt-4 justify-end">
            <button
              type="button"
              className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800 disabled:opacity-50"
              onClick={handleAdd}
              disabled={checkedIds.length === 0}
            >
              Add
            </button>
            <button
              type="button"
              className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-red-700 rounded-lg focus:ring-4 focus:ring-red-200 dark:focus:ring-red-900 hover:bg-red-800"
              onClick={() => {
                setCheckedIds([]);
                onClose();
              }}
            >
              Close
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RecapModal;