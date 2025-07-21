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
    };
    dispatch(setFilters(params));
    dispatch(fetchTransportData(params)).then((response) => {
      if (response.payload.pagination) {
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
        <div className="flex flex-wrap gap-2 mb-4">
          <input
            type="text"
            placeholder="Search..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="px-3 py-2 border rounded"
          />
          <select
            value={filters.kelompok}
            onChange={(e) => handleFilterChange('kelompok', e.target.value)}
            className="px-3 py-2 border rounded"
          >
            <option value="">Filter Kelompok</option>
            <option value="Material & Equipment">Material & Equipment</option>
            <option value="Construction and Installation">Construction and Installation</option>
            <option value="Engineering & Management">Engineering & Management</option>
            <option value="Testing & Commissioning">Testing & Commissioning</option>
            <option value="General & Finalization">General & Finalization</option>
          </select>
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