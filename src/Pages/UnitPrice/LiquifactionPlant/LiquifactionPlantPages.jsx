import React, { Component, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
import LiquifactionPlantTable from './LiquifactionPlantTable'
import { setFilterTipe, setFilterKategori } from '../../../Provider/HargaSatuan/liquifectionPlantSlice'

const tipeTabs = [
  { label: "Onshore LNG Plant", value: "Onshore LNG Plant" },
  { label: "Offshore LNG Plant", value: "Offshore LNG Plant" },
];

const kategoriList = [
  "Material Konstruksi",
  "Peralatan",
  "Upah",
  "Jasa",
  "Testing"
];

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

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

const tabMap = {
  onshore: "Onshore LNG Plant",
  offshore: "Offshore LNG Plant"
};

const LiquifactionPlantPages = () => {
  const dispatch = useDispatch();
  const { data, filterTipe, filterKategori } = useSelector(state => state.liquifectionPlant);
  const query = useQuery();

  // Ambil tab dan kategori dari query string
  const tab = query.get('tab');
  const kategori = query.get('kategori');

  // Sync redux filter dengan query string
  React.useEffect(() => {
    if (tab && tabMap[tab] && filterTipe !== tabMap[tab]) {
      dispatch(setFilterTipe(tabMap[tab]));
    }
    if (kategoriList.includes(kategori) && (filterKategori[0] !== kategori || filterKategori.length !== 1)) {
      dispatch(setFilterKategori([kategori]));
    }
    if (!kategori && filterKategori.length !== 0) {
      dispatch(setFilterKategori([]));
    }
    // eslint-disable-next-line
  }, [tab, kategori]);

  // Filtering logic
  const filteredData = useMemo(() => {
    let d = data.filter(item => item.tipe === filterTipe);
    if (filterKategori.length > 0) {
      d = d.filter(item => filterKategori.includes(item.kategori));
    }
    return d;
  }, [data, filterTipe, filterKategori]);

  // Tabs navigation
  const handleTabClick = (tabValue) => {
    dispatch(setFilterTipe(tabValue));
    dispatch(setFilterKategori([]));
  };

  // Kategori navigation
  const handleKategoriClick = (kat) => {
    if (!kat) {
      dispatch(setFilterKategori([]));
    } else {
      dispatch(setFilterKategori([kat]));
    }
  };

  return (
    <ErrorBoundary>
      <div className="p-4 dark:bg-darkmode md:h-screen dark:overflow-auto">
        <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Liquifaction Plant - Harga Satuan
        </p>
        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          {tipeTabs.map(tabItem => (
            <button
              key={tabItem.value}
              className={`px-4 py-2 rounded-t font-semibold border-b-2 ${
                filterTipe === tabItem.value
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
                filterKategori[0] === kat
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
              filterKategori.length === 0
                ? "bg-primary-700 text-white border-primary-700"
                : "bg-white dark:bg-gray-800 text-gray-700 border-gray-300"
            }`}
            onClick={() => handleKategoriClick("")}
          >
            Semua Kategori
          </button>
        </div>
        {/* Table */}
        <LiquifactionPlantTable data={filteredData} />
      </div>
    </ErrorBoundary>
  )
}

export default LiquifactionPlantPages