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