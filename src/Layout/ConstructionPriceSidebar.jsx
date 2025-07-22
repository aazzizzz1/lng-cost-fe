import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFilterJenis, fetchUniqueInfrastruktur, fetchFilteredConstructionCosts } from "../Provider/Project/ConstractionCostSlice";
import { useNavigate } from "react-router-dom";

const ConstructionPriceSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [openSections, setOpenSections] = useState({});
  const { uniqueInfrastruktur, loading } = useSelector((state) => state.constractionCost);

  useEffect(() => {
    dispatch(fetchUniqueInfrastruktur());
  }, [dispatch]);

  const handleClick = (tipe, infrastruktur) => {
    dispatch(setFilterJenis({ tipe, infrastruktur }));
    dispatch(fetchFilteredConstructionCosts({ tipe, infrastruktur }));
    navigate("/construction-cost");
  };

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <li>
      <button
        type="button"
        className="flex items-center p-2 w-full text-base font-medium text-gray-900 rounded-lg transition duration-75 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
        onClick={() => setOpen((v) => !v)}
      >
        {/* SVG di samping tombol Harga Konstruksi */}
        <svg
          className="w-6 h-6 text-gray-800 dark:text-white"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            fillRule="evenodd"
            d="M6 2a2 2 0 0 0-2 2v15a3 3 0 0 0 3 3h12a1 1 0 1 0 0-2h-2v-2h2a1 1 0 0 0 1-1V4a2 2 0 0 0-2-2h-8v16h5v2H7a1 1 0 1 1 0-2h1V2H6Z"
            clipRule="evenodd"
          />
        </svg>
        <span className="flex-1 ml-3 text-left whitespace-nowrap">
          Harga Konstruksi
        </span>
        <svg
          aria-hidden="true"
          className={`w-6 h-6 transform transition-transform ${
            open ? "rotate-180" : ""
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {open && (
        <ul className="py-2 space-y-2">
          {loading && <li>Loading...</li>}
          {Object.entries(uniqueInfrastruktur).map(([section, items]) => (
            <li key={section}>
              <button
                type="button"
                className="flex items-center p-2 pl-8 w-full text-sm font-medium text-gray-900 rounded-lg transition duration-75 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                onClick={() => toggleSection(section)}
              >
                <span className="flex-1 text-left whitespace-nowrap ml-3">
                  {section}
                </span>
                <svg
                  className={`w-4 h-4 ml-auto transition-transform ${
                    openSections[section] ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openSections[section] && (
                <ul className="ml-4 space-y-1">
                  {Object.entries(items).map(([subSection, volumes]) => (
                    <li key={subSection}>
                      <button
                        type="button"
                        className="flex items-center p-2 w-full text-xs font-medium text-gray-900 rounded-lg hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 ml-8"
                        onClick={() => handleClick(section, subSection)}
                      >
                        {subSection} (
                        {volumes.map((v) => v.volume).join(", ")}
                        )
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

export default ConstructionPriceSidebar;