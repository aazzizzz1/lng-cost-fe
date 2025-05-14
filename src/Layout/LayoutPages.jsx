import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const LayoutPages = (props) => {
  return (
    <>
      <div className="antialiased bg-gray-50 dark:bg-gray-900">
        <Navbar />
        {/* Sidebar */}
        <Sidebar />
        {/* Main Pages */}
        <main className="p-4 md:ml-64 h-auto pt-20">{props.children}</main>
      </div>
    </>
  );
};

export default LayoutPages;
