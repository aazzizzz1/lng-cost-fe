import React, { Component } from "react";
import { useDispatch } from "react-redux";
import { resetMatrix } from "../../Provider/matrixSlice";
import MatrixManagement from "./MatrixManagement";

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
  const dispatch = useDispatch();

  const handleResetMatrix = () => {
    dispatch(resetMatrix());
  };

  return (
    <ErrorBoundary>
      <div className="p-4 dark:bg-darkmode md:h-screen">
        <p className="text-3xl font-bold text-gray-900 dark:text-white">
          Management and Configuration Matrix
        </p>
        <div className="flex justify-between items-center mb-4">
          <p className="text-xl text-gray-600 dark:text-white">
            Management and Configuration Matrix Detail
          </p>
          <button
            type="button"
            data-modal-target="delete-modal"
            data-modal-toggle="delete-modal"
            className="px-3 py-2 flex items-center text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
            onClick={handleResetMatrix}
          >
            RESET MATRIX
          </button>
        </div>
        <MatrixManagement />
      </div>
    </ErrorBoundary>
  );
};

export default MatrixPages;
