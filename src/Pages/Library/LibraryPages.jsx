import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchApprovedLibraryProjects, selectApprovedLibraryProjects } from "../../Provider/Library/PreviewSlice"; // NEW
import { Link } from "react-router-dom";

const Card = ({ children }) => (
  <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
    {children}
  </div>
);

const iconForInfra = (infra = "") => {
  if (/LNGBV/i.test(infra)) return "⚓";
  if (/CARRIER|VESSEL|LNGC/i.test(infra)) return "🚢";
  if (/FSRU/i.test(infra)) return "🛳️";
  if (/PLANT|LNG\s*PLANT/i.test(infra)) return "🏭";
  if (/PIPE|PIPELINE/i.test(infra)) return "🛤️";
  if (/TRUCK/i.test(infra)) return "🚚";
  return "📁";
};

// NEW: ErrorBoundary like DashboardPages
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.error("LibraryPages ErrorBoundary:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) return <h1>Something went wrong.</h1>;
    return this.props.children;
  }
}

const LibraryPages = () => {
  const dispatch = useDispatch();
  const approved = useSelector(selectApprovedLibraryProjects);

  useEffect(() => {
    dispatch(fetchApprovedLibraryProjects()); // CHANGED: always fetch on mount
  }, [dispatch]);

  const list = approved || []; // CHANGED: use approved projects

  return (
    <ErrorBoundary>
      <div className="p-4 dark:bg-darkmode md:h-screen dark:overflow-auto">
        <p className="text-3xl font-bold text-gray-900 dark:text-white">Project Library</p>
        <p className="text-xl text-gray-600 dark:text-white mb-4">
          Pilih project untuk melihat CAPEX, OPEX, dan Drawing
        </p>

        {/* Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {list.map((p) => {
            const icon = iconForInfra(p.infrastruktur);
            return (
              <Card key={p.id}>
                <div className="h-20 w-full flex items-center justify-center">
                  <div className="w-14 h-14 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center text-2xl bg-white dark:bg-gray-900">
                    {icon}
                  </div>
                </div>
                <div className="pt-4">
                  <Link to={`/library/${p.id}`} className="text-lg font-semibold leading-tight text-gray-900 hover:underline dark:text-white">
                    {p.name}
                  </Link>
                  <div className="mt-2 flex items-center gap-2 text-xs">
                    <span className="rounded bg-primary-100 px-2.5 py-0.5 font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-300">
                      {p.kategori || "-"}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">{p.tahun || "-"}</span>
                  </div>
                  <ul className="mt-3 space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    <li>Infra: <span className="font-medium">{p.infrastruktur || "-"}</span></li>
                    <li>Volume: <span className="font-medium">{p.volume || "-"}</span></li>
                    <li>Lokasi: <span className="font-medium">{p.lokasi || "-"}</span></li>
                  </ul>
                  <div className="mt-4 flex items-center justify-between gap-4">
                    <div />
                    <Link
                      to={`/library/${p.id}`}
                      className="inline-flex items-center rounded-lg bg-primary-700 px-4 py-2 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                    >
                      Open Preview
                    </Link>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default LibraryPages;
