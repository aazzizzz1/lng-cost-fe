import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleDarkMode,
} from "../Provider/layoutSlice";
import { toggleSidebar} from "../Provider/GlobalSlice";
import PLILogo from "../Assets/Images/plilogo.png";
import { Link } from "react-router-dom";
import ModalCapacityFactor from "../Pages/CapacityFactor/ModalCapacityFactor";
import ProfileNavbar from "./ProfileNavbar";
import AppsNavbar from "./AppsNavbar";
// import NotificationNavbar from "./NotificationNavbar";

const Navbar = () => {
  const dispatch = useDispatch();
  const { isDarkMode } =
    useSelector((state) => state.layout);

  // Add state to track dark mode for icon
  const [isDark, setIsDark] = useState(
    typeof window !== "undefined" &&
      (document.documentElement.classList.contains("dark") ||
        document.body.classList.contains("dark"))
  );

  // State for Capacity Factor modal
  const [isCFModalOpen, setCFModalOpen] = useState(false);

  // Sync dark mode to body and localStorage
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark");
      localStorage.setItem("darkMode", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("darkMode", "light");
    }
  }, [isDarkMode]);

  // Listen for dark mode changes to update icon
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(
        document.documentElement.classList.contains("dark") ||
          document.body.classList.contains("dark")
      );
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-2.5 dark:bg-gray-800 dark:border-gray-700 fixed left-0 right-0 top-0 z-50">
      <div className="flex flex-wrap justify-between items-center">
        <div className="flex justify-start items-center flex-1 min-w-0">
          {/* Button toggle sidebar selalu tampil */}
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="p-2 mr-2 text-gray-600 rounded-lg cursor-pointer hover:text-gray-900 hover:bg-gray-100 focus:bg-gray-100 dark:focus:bg-gray-700 focus:ring-2 focus:ring-gray-100 dark:focus:ring-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <svg
              aria-hidden="true"
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span className="sr-only">Toggle sidebar</span>
          </button>
          <Link
            // href="https://pgnlng.co.id/"
            to="/dashboard"
            className="flex items-center justify-between mr-4"
          >
            <img src={PLILogo} className="mr-3 h-8" alt="Flowbite Logo" />
            {/* <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              COSTX
            </span> */}
          </Link>
        </div>
        {/* <div className="flex-1 flex justify-center">
          <form
            action="#"
            method="GET"
            className="hidden md:block md:pl-2 w-full max-w-md"
          >
            <label htmlFor="topbar-search" className="sr-only">
              Search
            </label>
            <div className="relative w-full">
              <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-500 dark:text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  />
                </svg>
              </div>
              <input
                type="text"
                name="email"
                id="topbar-search"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Search"
              />
            </div>
          </form>
        </div> */}
        <div className="flex items-center lg:order-2 flex-1 justify-end">
          <button
            type="button"
            data-drawer-toggle="drawer-navigation"
            aria-controls="drawer-navigation"
            className="p-2 mr-1 text-gray-500 rounded-lg md:hidden hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
          >
            <span className="sr-only">Toggle search</span>
            <svg
              aria-hidden="true"
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                clipRule="evenodd"
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              />
            </svg>
          </button>
          {/* dark mode */}
          <button
            className="w-10 h-10 hover:text-gray-700 dark:hover:text-gray-200 text-gray-900 dark:text-white"
            onClick={() => dispatch(toggleDarkMode())}
          >
            {isDark ? (
              // Moon icon for dark mode
              <svg
                className="w-6 h-6 text-gray-800 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 21a9 9 0 0 1-.5-17.986V3c-.354.966-.5 1.911-.5 3a9 9 0 0 0 9 9c.239 0 .254.018.488 0A9.004 9.004 0 0 1 12 21Z"
                />
              </svg>
            ) : (
              // Sun icon for light mode
              <svg
                className="w-6 h-6 text-gray-800 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 5V3m0 18v-2M7.05 7.05 5.636 5.636m12.728 12.728L16.95 16.95M5 12H3m18 0h-2M7.05 16.95l-1.414 1.414M18.364 5.636 16.95 7.05M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"
                />
              </svg>
            )}
          </button>
          {/* Notifications */}
          {/* <NotificationNavbar/> */}
          {/* Apps */}
          <AppsNavbar setCFModalOpen={setCFModalOpen} />
          {/* profile */}
          <ProfileNavbar />
        </div>
      </div>
      <ModalCapacityFactor
        isOpen={isCFModalOpen}
        onClose={() => setCFModalOpen(false)}
      />
    </nav>
  );
};

export default Navbar;