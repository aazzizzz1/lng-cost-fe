import React, { Component } from "react";
import RecapProject from "./RecapProject";

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

const RecapitulationPages = () => {
  return (
    <ErrorBoundary>
      <div className="p-4 dark:bg-darkmode md:h-screen dark:overflow-auto">
        <p className="text-3xl font-bold text-gray-900 dark:text-white">
          Management and Configuration Recapitulation Project
        </p>
        <p className="text-xl text-gray-600 dark:text-white mb-2">
          Management and Configuration Recapitulation Project Detail
        </p>
        <RecapProject />
      </div>
    </ErrorBoundary>
  );
};

export default RecapitulationPages;
