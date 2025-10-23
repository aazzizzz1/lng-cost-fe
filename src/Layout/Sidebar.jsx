import React from "react";
import { useLocation, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar } from "../Provider/GlobalSlice";
import ConstructionPriceSidebar from "./ConstructionPriceSidebar";
import UnitPriceSidebar from "./UnitPriceSidebar";
import { fetchApprovedLibraryProjects } from "../Provider/Library/PreviewSlice"; // NEW

const Sidebar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { isSidebarOpen } = useSelector((state) => state.global);
  const { user } = useSelector((state) => state.auth);
  const isActive = (path) => location.pathname === path;

  const prefetchLibrary = () => {
    dispatch(fetchApprovedLibraryProjects());
  };

  return (
    <aside
      className={`fixed top-0 left-0 z-40 w-64 h-screen pt-14 bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700 rounded-r-xl
        transition-all duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      aria-label="Sidenav"
      id="drawer-navigation"
    >
      <div className="overflow-y-auto py-5 px-3 h-full bg-white dark:bg-gray-800">
        {/* Button close sidebar, selalu tampil */}
        <button
          className="absolute top-2 right-2 z-50 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={() => dispatch(toggleSidebar())}
        >
          <svg
            className="w-6 h-6 text-gray-800 dark:text-white"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <form action="#" method="GET" className="md:hidden mb-2">
          <label htmlFor="sidebar-search" className="sr-only">
            Search
          </label>
          <div className="relative">
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
              name="search"
              id="sidebar-search"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder="Search"
            />
          </div>
        </form>
        <ul className="space-y-2">
          <Link to="/dashboard">
            <li
              className={
                isActive("/dashboard")
                  ? "border-l-4 border-blue-600 bg-blue-50 dark:bg-blue-900/10"
                  : ""
              }
            >
              <a
                href="#as"
                className="flex items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <svg
                  className={`w-6 h-6 ${
                    isActive("/dashboard")
                      ? "text-blue-600"
                      : "text-gray-800 dark:text-white"
                  }`}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.293 3.293a1 1 0 0 1 1.414 0l6 6 2 2a1 1 0 0 1-1.414 1.414L19 12.414V19a2 2 0 0 1-2 2h-3a1 1 0 0 1-1-1v-3h-2v3a1 1 0 0 1-1 1H7a2 2 0 0 1-2-2v-6.586l-.293.293a1 1 0 0 1-1.414-1.414l2-2 6-6Z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="ml-3">Dasboard</span>
              </a>
            </li>
          </Link>
          <Link to="/project">
            <li
              className={
                isActive("/project")
                  ? "border-l-4 border-blue-600 bg-blue-50 dark:bg-blue-900/10"
                  : ""
              }
            >
              <a
                href="#as"
                className="flex items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <svg
                  className={`w-6 h-6 ${
                    isActive("/project")
                      ? "text-blue-600"
                      : "text-gray-800 dark:text-white"
                  }`}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M3 4.92857C3 3.90506 3.80497 3 4.88889 3H19.1111C20.195 3 21 3.90506 21 4.92857V13h-3v-2c0-.5523-.4477-1-1-1h-4c-.5523 0-1 .4477-1 1v2H3V4.92857ZM3 15v1.0714C3 17.0949 3.80497 18 4.88889 18h3.47608L7.2318 19.3598c-.35356.4243-.29624 1.0548.12804 1.4084.42428.3536 1.05484.2962 1.40841-.128L10.9684 18h2.0632l2.2002 2.6402c.3535.4242.9841.4816 1.4084.128.4242-.3536.4816-.9841.128-1.4084L15.635 18h3.4761C20.195 18 21 17.0949 21 16.0714V15H3Z" />
                  <path d="M16 12v1h-2v-1h2Z" />
                </svg>
                <span className="ml-3">Project</span>
              </a>
            </li>
          </Link>
          {user?.role === "admin" && (
            <Link to="/manage-data">
            <li
              className={
                isActive("/manage-data")
                  ? "border-l-4 border-blue-600 bg-blue-50 dark:bg-blue-900/10"
                  : ""
              }
            >
              <a
                href="#as"
                className="flex items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <svg
                  className={`w-6 h-6 ${
                    isActive("/manage-data")
                      ? "text-blue-600"
                      : "text-gray-800 dark:text-white"
                  }`}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 7.205c4.418 0 8-1.165 8-2.602C20 3.165 16.418 2 12 2S4 3.165 4 4.603c0 1.437 3.582 2.602 8 2.602ZM12 22c4.963 0 8-1.686 8-2.603v-4.404c-.052.032-.112.06-.165.09a7.75 7.75 0 0 1-.745.387c-.193.088-.394.173-.6.253-.063.024-.124.05-.189.073a18.934 18.934 0 0 1-6.3.998c-2.135.027-4.26-.31-6.3-.998-.065-.024-.126-.05-.189-.073a10.143 10.143 0 0 1-.852-.373 7.75 7.75 0 0 1-.493-.267c-.053-.03-.113-.058-.165-.09v4.404C4 20.315 7.037 22 12 22Zm7.09-13.928a9.91 9.91 0 0 1-.6.253c-.063.025-.124.05-.189.074a18.935 18.935 0 0 1-6.3.998c-2.135.027-4.26-.31-6.3-.998-.065-.024-.126-.05-.189-.074a10.163 10.163 0 0 1-.852-.372 7.816 7.816 0 0 1-.493-.268c-.055-.03-.115-.058-.167-.09V12c0 .917 3.037 2.603 8 2.603s8-1.686 8-2.603V7.596c-.052.031-.112.059-.165.09a7.816 7.816 0 0 1-.745.386Z" />
                </svg>
                <span className="ml-3">Manage Data</span>
              </a>
            </li>
          </Link>
           )}
          
          {/* Ganti blok <li> Harga Satuan beserta dropdown-nya dengan komponen UnitPriceSidebar */}
          <UnitPriceSidebar />
          {/* Ganti blok <li> Harga Konstruksi dengan komponen ConstructionPriceSidebar */}
          <ConstructionPriceSidebar />
          {/* Admin only: User Management */}

          <li>
            <Link
              to={"/rab"}
              className="flex items-center p-2 textBase font-medium text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
            >
              <svg
                class="w-6 h-6 text-gray-800 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fill-rule="evenodd"
                  d="M12.512 8.72a2.46 2.46 0 0 1 3.479 0 2.461 2.461 0 0 1 0 3.479l-.004.005-1.094 1.08a.998.998 0 0 0-.194-.272l-3-3a1 1 0 0 0-.272-.193l1.085-1.1Zm-2.415 2.445L7.28 14.017a1 1 0 0 0-.289.702v2a1 1 0 0 0 1 1h2a1 1 0 0 0 .703-.288l2.851-2.816a.995.995 0 0 1-.26-.189l-3-3a.998.998 0 0 1-.19-.26Z"
                  clip-rule="evenodd"
                />
                <path
                  fill-rule="evenodd"
                  d="M7 3a1 1 0 0 1 1 1v1h3V4a1 1 0 1 1 2 0v1h3V4a1 1 0 1 1 2 0v1h1a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2H3a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1h6a2 2 0 0 0 2-2Zm10.67 8H19v8H5v-8h3.855l.53-.537a1 1 0 0 1 .87-.285c.097.015.233.13.277.087.045-.043-.073-.18-.09-.276a1 1 0 0 1 .274-.873l1.09-1.104a3.46 3.46 0 0 1 4.892 0l.001.002A3.461 3.461 0 0 1 17.67 11Z"
                  clip-rule="evenodd"
                />
              </svg>
              <span className="flex-1 ml-3 whitespace-nowrap">RAB</span>
              <span className="inline-flex justify-center items-center w-5 h-5 text-xs font-semibold rounded-full text-primary-800 bg-primary-100 dark:bg-primary-200 dark:text-primary-800">
                1
              </span>
            </Link>
          </li>
          <Link to="/library" onClick={prefetchLibrary}>
            <li
              className={
                isActive("/library")
                  ? "border-l-4 border-blue-600 bg-blue-50 dark:bg-blue-900/10"
                  : ""
              }
            >
              <a
                href="#as"
                className="flex items-center p-2 textBase font-medium text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <svg
                  className={`w-6 h-6 ${
                    isActive("/library")
                      ? "text-blue-600"
                      : "text-gray-800 dark:text-white"
                  }`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeWidth="2"
                    d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20M4 19.5V5a2 2 0 0 1 2-2h12M4 19.5A2.5 2.5 0 0 1 6.5 17H20M20 3v14"
                  />
                </svg>
                <span className="ml-3">Library Preview</span>
              </a>
            </li>
          </Link>
        </ul>
        <ul className="pt-5 mt-5 space-y-2 border-t border-gray-200 dark:border-gray-700">
          <Link to="/rekap">
            <li
              className={
                isActive("/rekap")
                  ? "border-l-4 border-blue-600 bg-blue-50 dark:bg-blue-900/10"
                  : ""
              }
            >
              <a
                href="#as"
                className="flex items-center p-2 textBase font-medium text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <svg
                  className={`w-6 h-6 ${
                    isActive("/rekap")
                      ? "text-blue-600"
                      : "text-gray-800 dark:text-white"
                  }`}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill-rule="evenodd"
                    d="M15 4H9v16h6V4Zm2 16h3a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-3v16ZM4 4h3v16H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span className="ml-3">Recap</span>
              </a>
            </li>
          </Link>
          {user?.role === "admin" && (
            <Link to="/users">
              <li
                className={
                  isActive("/users")
                    ? "border-l-4 border-blue-600 bg-blue-50 dark:bg-blue-900/10"
                    : ""
                }
              >
                <a
                  href="#users"
                  className="flex items-center p-2 textBase font-medium text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  <svg
                    className={`w-6 h-6 ${
                      isActive("/users")
                        ? "text-blue-600"
                        : "text-gray-800 dark:text-white"
                    }`}
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm-7 8a7 7 0 1 1 14 0v1H5v-1Z" />
                  </svg>
                  <span className="ml-3">User Management</span>
                </a>
              </li>
            </Link>
          )}
          {user?.role === "admin" && (
            <Link to="/administrator">
            <li
              className={
                isActive("/administrator")
                  ? "border-l-4 border-blue-600 bg-blue-50 dark:bg-blue-900/10"
                  : ""
              }
            >
              <a
                href="#as"
                className="flex items-center p-2 textBase font-medium text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <svg
                  className={`w-6 h-6 ${
                    isActive("/administrator")
                      ? "text-blue-600"
                      : "text-gray-800 dark:text-white"
                  }`}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7.58209 8.96025 9.8136 11.1917l-1.61782 1.6178c-1.08305-.1811-2.23623.1454-3.07364.9828-1.1208 1.1208-1.32697 2.8069-.62368 4.1363.14842.2806.42122.474.73509.5213.06726.0101.1347.0133.20136.0098-.00351.0666-.00036.1341.00977.2013.04724.3139.24069.5867.52125.7351 1.32944.7033 3.01552.4971 4.13627-.6237.8375-.8374 1.1639-1.9906.9829-3.0736l4.8107-4.8108c1.0831.1811 2.2363-.1454 3.0737-.9828 1.1208-1.1208 1.3269-2.80688.6237-4.13632-.1485-.28056-.4213-.474-.7351-.52125-.0673-.01012-.1347-.01327-.2014-.00977.0035-.06666.0004-.13409-.0098-.20136-.0472-.31386-.2406-.58666-.5212-.73508-1.3294-.70329-3.0155-.49713-4.1363.62367-.8374.83741-1.1639 1.9906-.9828 3.07365l-1.7788 1.77875-2.23152-2.23148-1.41419 1.41424Zm1.31056-3.1394c-.04235-.32684-.24303-.61183-.53647-.76186l-1.98183-1.0133c-.38619-.19746-.85564-.12345-1.16234.18326l-.86321.8632c-.3067.3067-.38072.77616-.18326 1.16235l1.0133 1.98182c.15004.29345.43503.49412.76187.53647l1.1127.14418c.3076.03985.61628-.06528.8356-.28461l.86321-.8632c.21932-.21932.32446-.52801.2846-.83561l-.14417-1.1127ZM19.4448 16.4052l-3.1186-3.1187c-.7811-.781-2.0474-.781-2.8285 0l-.1719.172c-.7811.781-.7811 2.0474 0 2.8284l3.1186 3.1187c.7811.781 2.0474.781 2.8285 0l.1719-.172c.7811-.781.7811-2.0474 0-2.8284Z"
                  />
                </svg>
                <span className="ml-3">Administrator</span>
              </a>
            </li>
          </Link>
           )}
          {/* <li>
            <a
              href="#askjd"
              className="flex items-center p-2 textBase font-medium text-gray-900 rounded-lg transition duration-75 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white group"
            >
              <svg
                class="w-6 h-6 text-gray-800 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M6 16v-3h.375a.626.626 0 0 1 .625.626v1.749a.626.626 0 0 1-.626.625H6Zm6-2.5a.5.5 0 1 1 1 0v2a.5.5 0 0 1-1 0v-2Z" />
                <path
                  fill-rule="evenodd"
                  d="M11 7V2h7a2 2 0 0 1 2 2v5h1a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-1a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2H3a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1h6a2 2 0 0 0 2-2Zm7.683 6.006 1.335-.024-.037-2-1.327.024a2.647 2.647 0 0 0-2.636 2.647v1.706a2.647 2.647 0 0 0 2.647 2.647H20v-2h-1.335a.647.647 0 0 1-.647-.647v-1.706a.647.647 0 0 1 .647-.647h.018ZM5 11a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h1.376A2.626 2.626 0 0 0 9 15.375v-1.75A2.626 2.626 0 0 0 6.375 11H5Zm7.5 0a2.5 2.5 0 0 0-2.5 2.5v2a2.5 2.5 0 0 0 5 0v-2a2.5 2.5 0 0 0-2.5-2.5Z"
                  clip-rule="evenodd"
                />
                <path d="M9 7V2.221a2 2 0 0 0-.5.365L4.586 6.5a2 2 0 0 0-.365.5H9Z" />
              </svg>
              <span className="ml-3">Dokumen Referensi</span>
            </a>
          </li> */}
        </ul>
      </div>
      {/* Bottom Navbar */}
      {/* <BottomNavSidebar /> */}
    </aside>
  );
};

export default Sidebar;
