import React, { Component } from 'react'
import ManageData from './ManageData';
import ProjectTable from '../Project/ProjectTable';

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

const ManageDataPages = () => {
  return (
    <ErrorBoundary>
      <div className="p-4 dark:bg-darkmode">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-9 space-y-3">
            <ManageData />
          {/* NEW: Notes card */}
          <aside className="lg:col-span-3">
            <div className="sticky top-4 rounded-xl border border-red-700/30 bg-red-50 dark:bg-red-900/20 p-4">
              <h3 className="text-sm font-bold text-red-700 dark:text-red-300">Data Update Guidelines</h3>
              <ol className="mt-2 list-decimal pl-4 text-xs text-red-800 dark:text-red-200 space-y-1">
                <li>Ensure uploaded Excel files follow the required column format exactly.</li>
                <li>Verify data completeness (no blank or duplicated values).</li>
                <li>Use validated reference and model-based datasets only.</li>
              </ol>
            </div>
          </aside>
            <div className="mt-2">
              <ProjectTable variant="auto" />
            </div>
          </div>

        </div>
      </div>
    </ErrorBoundary>
  )
}

export default ManageDataPages