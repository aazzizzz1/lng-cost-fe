import React, { Component } from "react";
import { useSelector, useDispatch } from "react-redux";
import { filterByJenis } from "../../Provider/materialSlice";
import PLILogo from "../../Assets/Images/PLI.jpeg";
import { useNavigate } from "react-router-dom";

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

const MaterialKonstruksiPages = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const jenisMaterial = useSelector((state) => state.material.jenisMaterial);

  const handleJenisClick = (jenis) => {
    dispatch(filterByJenis(jenis));
    navigate("/material-konstruksi/tabel");
  };

  return (
    <ErrorBoundary>
      <div className="p-4 dark:bg-darkmode md:h-screen dark:overflow-auto">
        <p className="text-3xl font-bold text-gray-900 dark:text-white">
          Management and Configuration Material Konstruksi
        </p>
        <p className="text-xl text-gray-600 dark:text-white mb-2">
          Management and Configuration Material Konstruksi Detail
        </p>
        <div className="grid grid-cols-4 gap-4">
          {jenisMaterial.map((jenis) => (
            <button
              key={jenis.id}
              onClick={() => handleJenisClick(jenis.id)}
              className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700"
            >
              <div className="flex flex-col items-center px-2 py-2">
                <img
                  className="w-24 h-24 mb-3 rounded-full shadow-lg"
                  src={PLILogo}
                  alt={jenis.nama}
                />
                <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
                  {jenis.jumlah}
                </h5>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {jenis.nama}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default MaterialKonstruksiPages;
