import React, { Component, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { fetchFilteredConstructionCosts, setFilterJenis } from '../../Provider/ConstructionCost/ConstractionCostSlice'
import ConstractionCostTable from './ConstractionCostTable'

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

const ConstractionCostPages = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tipe = params.get('tipe') || undefined;
    const infrastruktur = params.get('infrastruktur') || undefined;
    const volume = params.get('volume') || undefined;
    const projectId = params.get('projectId') || undefined; // NEW

    if (tipe || infrastruktur || volume || projectId) {
      dispatch(setFilterJenis({
        tipe: tipe || null,
        proyek: infrastruktur || null,
        volume: volume || null,
        projectId: projectId || null, // NEW
      }));
      dispatch(fetchFilteredConstructionCosts({ tipe, infrastruktur, volume, projectId })); // NEW
    }
  }, [location.search, dispatch]);

  return (
    <ErrorBoundary>
      <div className="p-4 dark:bg-darkmode md:h-screen dark:overflow-auto">
        <p className="text-3xl font-bold text-gray-900 dark:text-white">
          Management and Configuration Construction Cost
        </p>
        <p className="text-xl text-gray-600 dark:text-white mb-2">
          Management and Configuration Construction Cost Detail
        </p>
        <ConstractionCostTable />
      </div>
    </ErrorBoundary>
  )
}

export default ConstractionCostPages