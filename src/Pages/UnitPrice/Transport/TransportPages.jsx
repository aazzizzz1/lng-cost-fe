import React, { Component, useMemo, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import TransportTable from './TransportTable';
import { fetchTransportData } from '../../../Provider/HargaSatuan/transportSlice';

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

class ErrorBoundary extends Component {
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

const TransportPages = () => {
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.transport);
  const query = useQuery();
  const navigate = useNavigate();

  const [tipeTabs, setTipeTabs] = useState([]);
  const [kelompokList, setKelompokList] = useState([]);

  useEffect(() => {
    dispatch(fetchTransportData());
  }, [dispatch]);

  useEffect(() => {
    // Extract unique `infrastruktur` and `kelompok` values from the data
    const uniqueTipe = [...new Set(data.map((item) => item.infrastruktur))].map((infrastruktur) => ({
      label: infrastruktur,
      value: infrastruktur.toLowerCase().replace(/\s+/g, ''),
    }));
    const uniqueKelompok = [...new Set(data.map((item) => item.kelompok))];
    setTipeTabs(uniqueTipe);
    setKelompokList(uniqueKelompok);
  }, [data]);

  // Ambil tab dan kelompok dari query string
  const tab = query.get('tab') || (tipeTabs[0]?.value || '');
  const kelompok = query.get('kelompok') || '';

  // Filtering logic
  const filteredData = useMemo(() => {
    let d = data.filter((item) => item.infrastruktur.toLowerCase().replace(/\s+/g, '') === tab);
    if (kelompok && kelompokList.includes(kelompok)) {
      d = d.filter((item) => item.kelompok === kelompok);
    }
    return d;
  }, [data, tab, kelompok, kelompokList]);

  // Tabs navigation
  const handleTabClick = (tabValue) => {
    navigate(`/transport?tab=${tabValue}${kelompok ? `&kelompok=${encodeURIComponent(kelompok)}` : ''}`);
  };

  // Kelompok navigation
  const handleKelompokClick = (kel) => {
    navigate(`/transport?tab=${tab}${kel ? `&kelompok=${encodeURIComponent(kel)}` : ''}`);
  };

  return (
    <ErrorBoundary>
      <div className="p-4 dark:bg-darkmode md:h-screen dark:overflow-auto">
        <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Transportasi - Harga Satuan
        </p>
        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          {tipeTabs.map((tabItem) => (
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
        {/* Filter kelompok */}
        <div className="flex flex-wrap gap-2 mb-4">
          {kelompokList.map((kel) => (
            <button
              key={kel}
              className={`px-3 py-1 rounded border ${
                kelompok === kel
                  ? "bg-primary-700 text-white border-primary-700"
                  : "bg-white dark:bg-gray-800 text-gray-700 border-gray-300"
              }`}
              onClick={() => handleKelompokClick(kel)}
            >
              {kel}
            </button>
          ))}
          <button
            className={`px-3 py-1 rounded border ${
              !kelompok
                ? "bg-primary-700 text-white border-primary-700"
                : "bg-white dark:bg-gray-800 text-gray-700 border-gray-300"
            }`}
            onClick={() => handleKelompokClick("")}
          >
            Semua Kelompok
          </button>
        </div>
        {/* Table */}
        <TransportTable data={filteredData} />
      </div>
    </ErrorBoundary>
  );
};

export default TransportPages;