import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useSelector } from "react-redux";

const LayoutPages = (props) => {
  const isSidebarOpen = useSelector((state) => state.global.isSidebarOpen);

  return (
    <>
      <div className="antialiased bg-gray-50 dark:bg-gray-900">
        <Navbar />
        {/* Sidebar hanya tampil jika isSidebarOpen */}
        {isSidebarOpen && <Sidebar />}
        {/* Main Pages */}
        <main
          className={`p-4 h-auto pt-20 transition-all duration-300 ease-in-out ${
            isSidebarOpen ? "md:ml-64" : ""
          }`}
        >
          {props.children}
        </main>
      </div>
    </>
  );
};

export default LayoutPages;
