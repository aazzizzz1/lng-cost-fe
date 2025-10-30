import React, { Component } from "react";
import AdministratorLocation from "./AdministratorLocation";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
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

const AdministratorPages = () => {
  return (
    <ErrorBoundary>
      <div className="p-4 dark:bg-darkmode min-h-screen">
        <p className="text-3xl font-bold text-gray-900 dark:text-white">Application Settings</p>
        <p className="text-xl text-gray-600 dark:text-white mb-6">
          Set and adjust key calculation parameters and system settings for accurate application operation
        </p>
        <AdministratorLocation />
      </div>
    </ErrorBoundary>
  );
};

export default AdministratorPages;
