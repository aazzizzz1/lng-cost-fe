import React, { Component, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import UnitPriceTable from './UnitPriceTable';
import { fetchTransportData, setFilters, setPagination } from '../../Provider/HargaSatuan/unitPriceSlice';

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

const UnitPricePages = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { transport: { data, filters, pagination, loading } } = useSelector((state) => state.unitPrice);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const params = {
      page: pagination.page,
      limit: pagination.limit,
      sort: filters.sort,
      order: filters.order,
      search: filters.search,
      tipe: queryParams.get('tipe') || filters.tipe,
      infrastruktur: queryParams.get('infrastruktur') || filters.infrastruktur,
      kelompok: queryParams.get('kelompok') || filters.kelompok,
      volume: queryParams.get('volume') || filters.volume, // include volume from query or current filters
    };
    dispatch(setFilters(params));
    dispatch(fetchTransportData(params)).then((response) => {
      if (response.payload && response.payload.pagination) {
        dispatch(setPagination(response.payload.pagination)); // Update pagination state
      }
    });
  }, [
    dispatch,
    location.search,
    pagination.page,
    pagination.limit,
    filters.sort,
    filters.order,
    filters.search,
    filters.tipe,
    filters.infrastruktur,
    filters.kelompok,
    filters.volume, // added dependency
  ]); // Added missing dependencies

  const handleFilterChange = (key, value) => {
    dispatch(setFilters({ [key]: value }));
    dispatch(setPagination({ page: 1 })); // Reset to first page on filter change
  };

  const handlePageChange = (page) => {
    dispatch(setPagination({ page }));
  };

  const handleLimitChange = (limit) => {
    dispatch(setPagination({ limit, page: 1 })); // Reset to first page on limit change
  };

  const handleSortChange = (key) => {
    const newOrder = filters.order === 'asc' ? 'desc' : 'asc'; // Toggle between ascending and descending
    dispatch(setFilters({ sort: key, order: newOrder }));
    dispatch(setPagination({ page: 1 })); // Reset to first page on sort change
  };

  return (
    <ErrorBoundary>
      <div className="p-4 dark:bg-darkmode md:h-screen dark:overflow-auto">
        <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Unit Price - Harga Satuan
        </p>
        {/* Filters */}
        <div className="">
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
            <div className="p-3 md:p-4">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {/* Search */}
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 dark:text-gray-500">
                    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.9 14.32a8 8 0 111.414-1.414l3.387 3.387a1 1 0 01-1.414 1.414L12.9 14.32zM14 8a6 6 0 11-12 0 6 6 0 0112 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    aria-label="Search"
                    placeholder="Search..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                  />
                </div>

                {/* Volume */}
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 dark:text-gray-500">
                    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path d="M2 6a2 2 0 012-2h3l2-2h2l2 2h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                    </svg>
                  </span>
                  <input
                    type="number"
                    aria-label="Volume"
                    placeholder="Volume (e.g. 5000)"
                    value={filters.volume}
                    onChange={(e) => handleFilterChange('volume', e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Table */}
        <UnitPriceTable
          data={data}
          loading={loading}
          pagination={pagination}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
          onSortChange={handleSortChange}
        />
      </div>
    </ErrorBoundary>
  );
};

export default UnitPricePages;