import React, { Component, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import TransportTable from './TransportTable'

const tipeTabs = [
  { label: "LNGC", value: "lngc" },
  { label: "LNG Barge", value: "lngbarge" },
  { label: "LNG Trucking", value: "lngtrucking" },
];

const kategoriList = [
  "Material Konstruksi",
  "Peralatan",
  "Upah",
  "Jasa",
  "Testing"
];

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

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

const tipeMap = {
  lngc: "LNGC",
  lngbarge: "LNG Barge",
  lngtrucking: "LNG Trucking"
};

const TransportPages = () => {
  const { data } = useSelector(state => state.transport);
  const query = useQuery();
  const navigate = useNavigate();

  // Ambil tab dan kategori dari query string
  const tab = query.get('tab') || 'lngc';
  const kategori = query.get('kategori') || '';

  // Filtering logic
  const filteredData = useMemo(() => {
    let d = data.filter(item => item.tipe === tipeMap[tab]);
    if (kategori && kategoriList.includes(kategori)) {
      d = d.filter(item => item.kategori === kategori);
    }
    return d;
  }, [data, tab, kategori]);

  // Tabs navigation
  const handleTabClick = (tabValue) => {
    navigate(`/transport?tab=${tabValue}${kategori ? `&kategori=${encodeURIComponent(kategori)}` : ''}`);
  };

  // Kategori navigation
  const handleKategoriClick = (kat) => {
    navigate(`/transport?tab=${tab}${kat ? `&kategori=${encodeURIComponent(kat)}` : ''}`);
  };

  return (
    <ErrorBoundary>
      <div className="p-4 dark:bg-darkmode md:h-screen dark:overflow-auto">
        <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Transportasi - Harga Satuan
        </p>
        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          {tipeTabs.map(tabItem => (
            <button
              key={tabItem.value}
              className={`px-4 py-2 rounded-t font-semibold border-b-2 ${
                tab === tabItem.value
                  ? "border-primary-700 text-primary-700 bg-primary-50 dark:bg-gray-800"
                  : "border-transparent text-gray-700 dark:text-gray-300"
              }`}
              onClick={() => handleTabClick(tabItem.value)}
            >
              {tabItem.label}
            </button>
          ))}
        </div>
        {/* Filter kategori */}
        <div className="flex flex-wrap gap-2 mb-4">
          {kategoriList.map(kat => (
            <button
              key={kat}
              className={`px-3 py-1 rounded border ${
                kategori === kat
                  ? "bg-primary-700 text-white border-primary-700"
                  : "bg-white dark:bg-gray-800 text-gray-700 border-gray-300"
              }`}
              onClick={() => handleKategoriClick(kat)}
            >
              {kat}
            </button>
          ))}
          <button
            className={`px-3 py-1 rounded border ${
              !kategori
                ? "bg-primary-700 text-white border-primary-700"
                : "bg-white dark:bg-gray-800 text-gray-700 border-gray-300"
            }`}
            onClick={() => handleKategoriClick("")}
          >
            Semua Kategori
          </button>
        </div>
        {/* Table */}
        <TransportTable data={filteredData} />
      </div>
    </ErrorBoundary>
  );
};

export default TransportPages