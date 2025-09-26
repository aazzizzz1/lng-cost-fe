import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects } from "../../Provider/Project/ProjectSlice";
import { Link } from "react-router-dom";

const Card = ({ children }) => (
  <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">{children}</div>
);

const LibraryPages = () => {
  const dispatch = useDispatch();
  const projects = useSelector((s) => s.projects.projects);

  useEffect(() => {
    if (!projects?.length) dispatch(fetchProjects());
  }, [dispatch, projects?.length]);

  return (
    <div className="p-4 dark:bg-darkmode md:h-screen dark:overflow-auto">
      <p className="text-3xl font-bold text-gray-900 dark:text-white">Library</p>
      <p className="text-xl text-gray-600 dark:text-white mb-4">Pilih project untuk melihat CAPEX, OPEX, dan Drawing</p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(projects || []).map((p) => (
          <Card key={p.id}>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">{p.name}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              {p.kategori || "-"} • {p.tahun || "-"}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Infra: <span className="font-medium">{p.infrastruktur || "-"}</span> • Vol: <span className="font-medium">{p.volume || "-"}</span>
            </div>
            <div className="mt-3 flex gap-2">
              <Link
                to={`/library/${p.id}`}
                className="inline-flex items-center justify-center h-9 px-3 rounded-md bg-primary-700 hover:bg-primary-800 text-white text-sm"
              >
                Open Preview
              </Link>
              <Link
                to={`/project/${p.id}/detail`}
                className="inline-flex items-center justify-center h-9 px-3 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              >
                Project Detail
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LibraryPages;
