import React, { Component } from "react";
import Dashboard from "./Dashboard";

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

const DashboardPages = () => {
  return (
    <ErrorBoundary>
      <div className="p-4 dark:bg-darkmode min-h-screen">
        <p className="text-3xl font-bold text-gray-900 dark:text-white">
          Management and Configuration Project
        </p>
        <p className="text-xl text-gray-600 dark:text-white mb-2">
          Management and Configuration Project Detail
        </p>
        <Dashboard />
      </div>
    </ErrorBoundary>
  );
};

export default DashboardPages;

// import React from 'react'
// import { useNavigate } from 'react-router-dom'
// // import BackgroundLNG from "../../Assets/Images/PLI.jpeg";

// const DashboardPages = () => {
//   const navigate = useNavigate()

//   const handleClick = (path) => {
//     navigate(path)
//   }

//   return (
//     <div className="relative w-full h-screen bg-blue-200">
//       {/* Background Gambar Utama */}
//       {/* <img src={BackgroundLNG} alt="LNG Diagram" className="w-full h-auto" /> */}

//       {/* Tombol Interaktif - Posisi disesuaikan dengan posisi gambar */}
//       <button
//         onClick={() => handleClick('/storage')}
//         className="absolute top-[20%] left-[10%] w-[80px] h-[80px] bg-transparent"
//         title="Storage"
//       />

//       <button
//         onClick={() => handleClick('/fsru')}
//         className="absolute top-[10%] left-[30%] w-[80px] h-[80px] bg-transparent"
//         title="FSRU / LNGC"
//       />

//       <button
//         onClick={() => handleClick('/offshore-platform')}
//         className="absolute top-[10%] left-[60%] w-[80px] h-[80px] bg-transparent"
//         title="Offshore Platform"
//       />

//       <button
//         onClick={() => handleClick('/tank')}
//         className="absolute top-[50%] left-[40%] w-[80px] h-[80px] bg-transparent"
//         title="Tank"
//       />

//       <button
//         onClick={() => handleClick('/truck-tank')}
//         className="absolute top-[70%] left-[20%] w-[80px] h-[80px] bg-transparent"
//         title="Truck Tank"
//       />

//       <button
//         onClick={() => handleClick('/plant')}
//         className="absolute top-[70%] left-[60%] w-[80px] h-[80px] bg-transparent"
//         title="Plant"
//       />
//     </div>
//   )
// }

// export default DashboardPages
