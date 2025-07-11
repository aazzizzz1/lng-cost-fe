import React, { Component } from 'react'
import ProjectTable from './ProjectTable'

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

const ProjectPages = () => {
  return (
    <ErrorBoundary>
      <div className="p-4 dark:bg-darkmode md:h-screen dark:overflow-auto">
        <p className="text-3xl font-bold text-gray-900 dark:text-white">
          Management and Configuration Project
        </p>
        <p className="text-xl text-gray-600 dark:text-white mb-2">
          Management and Configuration Project Detail
        </p>
        <ProjectTable />
      </div>
    </ErrorBoundary>
  )
}

export default ProjectPages