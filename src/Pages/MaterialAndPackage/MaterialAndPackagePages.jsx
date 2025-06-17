import React, { Component, useState } from 'react'
import { useLocation } from "react-router-dom";
import PackageTable from './PackageTable';
import MaterialTable from './MaterialTable';

class ErrorBoundary extends Component{
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}

const MaterialAndPackagePages = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const tab = params.get("tab");
  const [activeTab, setActiveTab] = useState(tab === "material" ? "material" : "package");

  // Sync tab with URL
  React.useEffect(() => {
    setActiveTab(tab === "material" ? "material" : "package");
  }, [tab]);

  return (
    <ErrorBoundary>
      <div className="p-4 dark:bg-darkmode md:h-screen dark:overflow-auto">
        <p className="text-3xl font-bold text-gray-900 dark:text-white">
          Harga Satuan Material dan Paket Pekerjaan
        </p>
        <p className="text-xl text-gray-600 dark:text-white mb-2">
          Managemen dan Konfigurasi Harga Satuan Material dan Paket Pekerjaan
        </p>
        {/* Tab Switcher (optional, for direct switching) */}
        {/* 
        <div className="mb-4 flex gap-2">
          <button onClick={() => setActiveTab("package")} className={activeTab === "package" ? "font-bold" : ""}>Package</button>
          <button onClick={() => setActiveTab("material")} className={activeTab === "material" ? "font-bold" : ""}>Material</button>
        </div>
        */}
        {activeTab === "package" && <PackageTable />}
        {activeTab === "material" && <MaterialTable />}
      </div>
    </ErrorBoundary>
  )
}

export default MaterialAndPackagePages