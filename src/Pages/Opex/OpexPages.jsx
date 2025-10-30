import React, { Component } from 'react'
import Opex from './Opex'

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

const OpexPages = () => {
  return (
    <ErrorBoundary>
      <div className="p-4 dark:bg-darkmode md:h-screen dark:overflow-auto">
        <p className="text-3xl font-bold text-gray-900 dark:text-white">
          Operational Expenditure (OPEX) Data Overview
        </p>
        <p className="text-xl text-gray-600 dark:text-white mb-2">
          Access reference-based operational cost data to support performance analysis and budget planning.
        </p>
        <p className="text-xs text-gray-600 dark:text-gray-300 mb-4">
          Disclaimer: The data presented are indicative and based on reference operational records. Actual OPEX may vary depending on site conditions, asset performance, and market dynamics.
        </p>
        <Opex />
      </div>
    </ErrorBoundary>
  )
}

export default OpexPages