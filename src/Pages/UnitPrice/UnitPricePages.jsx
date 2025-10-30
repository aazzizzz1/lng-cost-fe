import React, { Component, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import UnitPriceTable from './UnitPriceTable';
import { fetchTransportData, setFilters, setPagination, fetchUniqueFields, fetchUnitPriceFilters } from '../../Provider/HargaSatuan/unitPriceSlice';

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
  const {
    transport: { data, filters, pagination, loading },
  } = useSelector((state) => state.unitPrice);

  useEffect(() => {
    dispatch(fetchUniqueFields()); // optional
    // NEW: preload all volumes (no infra dependency)
    dispatch(fetchUnitPriceFilters({}));
  }, [dispatch]);

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
      volume: filters.volume || '',
    };
    dispatch(setFilters(params));
    dispatch(fetchTransportData(params)).then((response) => {
      if (response.payload && response.payload.pagination) {
        // Preserve "all" selection on limit
        const server = response.payload.pagination;
        const currentLimit = pagination.limit;
        dispatch(setPagination({
          ...server,
          limit: String(currentLimit).toLowerCase() === 'all' ? 'all' : server.limit,
        }));
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
    filters.volume,
  ]);

  const handlePageChange = (page) => dispatch(setPagination({ page }));
  const handleLimitChange = (limit) => dispatch(setPagination({ limit, page: 1 }));
  const handleSortChange = (key) => {
    const newOrder = filters.order === 'asc' ? 'desc' : 'asc';
    dispatch(setFilters({ sort: key, order: newOrder }));
    dispatch(setPagination({ page: 1 }));
  };

  return (
    <ErrorBoundary>
      <div className="p-4 dark:bg-darkmode md:h-screen dark:overflow-auto">
        <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Basic Unit Price - Harga Satuan
        </p>

        {/* Table with header controls inside */}
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