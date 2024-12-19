import React, { Component } from 'react';
import SensorFlow from './SensorFlow';

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

const MatrixPages = () => {
  return (
    <ErrorBoundary>
      <div className="p-8 dark:bg-darkmode">
        <p className="text-3xl font-bold text-gray-900 dark:text-white">Management and Configuration Sensor</p>
        <p className="text-xl text-gray-600 dark:text-white mb-8">
          Management and Configuration Sensor Detail
        </p>
        <div className="h-96">
        <SensorFlow/>
        </div>
      </div>
    </ErrorBoundary>
  )
}

export default MatrixPages