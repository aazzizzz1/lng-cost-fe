import React from "react";
import { Link } from "react-router-dom";

const MobileNavbar = ({ isOpen, toggleSidebar, toggleDarkMode }) => {
  return (
    <div className="flex flex-row">
      <button
        className={`inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 dark:hover:text-white focus:outline-none md:hidden p-2`}
        onClick={toggleSidebar}
      >
        <svg
          className="w-6 h-6"
          stroke="currentColor"
          fill="none"
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {isOpen && (
        <div className="md:hidden py-2">
          <div className="flex flex-row">
            <Link
              to="/dashboard"
              className="block px-2 py-1 rounded-md text-xs font-medium hover:text-gray-700 dark:text-white"
            >
              Home
            </Link>
            <Link
              to="/simulator"
              className="block px-2 py-1 rounded-md text-xs font-medium hover:text-gray-700 dark:text-white"
            >
              Simulator
            </Link>
            <Link
              to="/object"
              className="block px-2 py-1 rounded-md text-xs font-medium hover:text-gray-700 dark:text-white"
            >
              Object
            </Link>
            <Link
              to="/matrix"
              className="block px-2 py-1 rounded-md text-xs font-medium hover:text-gray-700 dark:text-white"
            >
              Matrix
            </Link>
            <Link
              to="/account"
              className="block px-2 py-1 rounded-md text-xs font-medium hover:text-gray-700 dark:text-white"
            >
              Account
            </Link>
            <Link
              to="/selftest"
              className="block px-2 py-1 rounded-md text-xs font-medium hover:text-gray-700 dark:text-white"
            >
              Test
            </Link>
            <button
              className="w-5 h-5 mr-4 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              onClick={toggleDarkMode}
            >
              <svg
                width="35"
                height="30"
                viewBox="0 0 40 41"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20 27.1666C23.6819 27.1666 26.6667 24.1819 26.6667 20.5C26.6667 16.8181 23.6819 13.8333 20 13.8333C16.3181 13.8333 13.3334 16.8181 13.3334 20.5C13.3334 24.1819 16.3181 27.1666 20 27.1666Z"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />
                <path
                  d="M33.3333 20.5H35M5 20.5H6.66667M20 33.8333V35.5M20 5.5V7.16667M29.4283 29.9283L30.6067 31.1067M9.39333 9.89333L10.5717 11.0717M10.5717 29.9283L9.39333 31.1067M30.6067 9.89333L29.4283 11.0717"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileNavbar;
